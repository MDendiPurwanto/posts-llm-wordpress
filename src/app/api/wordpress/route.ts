import { NextResponse } from 'next/server';
import { getErrorMessage, getImageProviderConfig, getWordPressConfig } from '@/lib/config';

export const runtime = 'nodejs';

interface PexelsPhoto {
    id: number;
    alt?: string;
    photographer?: string;
    src?: {
        original?: string;
        large2x?: string;
        large?: string;
        medium?: string;
    };
}

interface UploadedWordPressMedia {
    id: number | string;
    source_url?: string;
    title?: {
        rendered?: string;
    };
}

async function readResponseError(response: Response, fallback: string) {
    try {
        const data = await response.json();
        return typeof data?.message === 'string' ? data.message : fallback;
    } catch {
        return fallback;
    }
}

function escapeAttribute(value: unknown) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function cleanImageQuery(value: unknown) {
    return String(value ?? '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/[^\w\s,-]/g, '')
        .trim()
        .slice(0, 120);
}

function getImageUrl(photo: PexelsPhoto) {
    return photo.src?.large2x || photo.src?.large || photo.src?.original || photo.src?.medium || '';
}

async function searchPexelsPhoto(queries: string[], pexelsApiKey: string) {
    const cleanQueries = Array.from(new Set(queries.map(cleanImageQuery).filter(Boolean)));

    if (cleanQueries.length === 0) {
        throw new Error('Image query is empty.');
    }

    for (const cleanQuery of cleanQueries) {
        const searchParams = new URLSearchParams({
            query: cleanQuery,
            per_page: '8',
            orientation: 'landscape',
            size: 'large',
        });

        const response = await fetch(`https://api.pexels.com/v1/search?${searchParams.toString()}`, {
            headers: {
                Authorization: pexelsApiKey,
            },
        });

        if (!response.ok) {
            const message = await readResponseError(response, 'Failed to search Pexels images');
            throw new Error(message);
        }

        const data = await response.json();
        const photos = Array.isArray(data?.photos) ? data.photos as PexelsPhoto[] : [];
        const photo = photos.find((candidate) => Boolean(getImageUrl(candidate)));

        if (photo) {
            return {
                id: photo.id,
                url: getImageUrl(photo),
                alt: cleanImageQuery(photo.alt) || cleanQuery,
                photographer: photo.photographer || 'Pexels',
            };
        }
    }

    throw new Error(`No Pexels image found for query: ${cleanQueries[0]}`);
}

async function uploadMedia(
    imageUrl: string,
    fileName: string,
    title: string,
    wpBaseUrl: string,
    wpUsername: string,
    wpAppPassword: string
) {
    try {
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) throw new Error('Failed to fetch image');
        const imageBlob = await imageResponse.blob();

        const formData = new FormData();
        formData.append('file', imageBlob, fileName);
        formData.append('title', title);

        const fullApiUrl = `${wpBaseUrl}/wp-json/wp/v2`;
        const auth = Buffer.from(`${wpUsername}:${wpAppPassword}`).toString('base64');

        const uploadResponse = await fetch(`${fullApiUrl}/media`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
            },
            body: formData,
        });

        if (!uploadResponse.ok) {
            const message = await readResponseError(uploadResponse, 'Failed to upload media');
            console.error('WordPress Media Upload Error:', message);
            throw new Error(message);
        }

        return await uploadResponse.json() as UploadedWordPressMedia;
    } catch (error: unknown) {
        console.error('Error uploading media to WordPress:', getErrorMessage(error));
        throw error;
    }
}

function buildFeaturedImageQuery(title: string, prompt: string, content: string) {
    const firstPlaceholder = content.match(/\[Gambar:\s*([^\]]+)\]/)?.[1] || '';
    return [firstPlaceholder, prompt, title];
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const title = typeof body.title === 'string' ? body.title.trim() : '';
        const content = typeof body.content === 'string' ? body.content.trim() : '';
        const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
        const wpConfig = getWordPressConfig(body);
        const imageConfig = getImageProviderConfig(body);

        if (!title || !content || !wpConfig.baseUrl || !wpConfig.username || !wpConfig.appPassword || !imageConfig.pexelsApiKey) {
            return NextResponse.json({ error: 'Missing title, content, WordPress configuration, or Pexels API key.' }, { status: 400 });
        }

        const fullApiUrl = `${wpConfig.baseUrl}/wp-json/wp/v2`;
        const auth = Buffer.from(`${wpConfig.username}:${wpConfig.appPassword}`).toString('base64');

        // 1. Unggah Featured Image
        const featuredImageQuery = buildFeaturedImageQuery(title, prompt, content);
        const featuredImage = await searchPexelsPhoto(featuredImageQuery, imageConfig.pexelsApiKey);
        const featuredMediaFileName = `featured_image_${featuredImage.id}_${Date.now()}.jpeg`;
        const uploadedFeaturedMedia = await uploadMedia(
            featuredImage.url,
            featuredMediaFileName,
            `${title} - ${featuredImage.alt}`,
            wpConfig.baseUrl,
            wpConfig.username,
            wpConfig.appPassword
        );

        const featuredMediaId = uploadedFeaturedMedia.id;

        // 2. Unggah Gambar dalam Konten
        let processedContent = content;
        const llmImagePlaceholders = content.match(/\[Gambar:\s*([^\]]+)\]/g);

        if (llmImagePlaceholders && llmImagePlaceholders.length > 0) {
            for (const placeholder of llmImagePlaceholders) {
                const imageQuery = placeholder.replace('[Gambar:', '').replace(']', '');
                const inContentImage = await searchPexelsPhoto([imageQuery, prompt, title], imageConfig.pexelsApiKey);
                const inContentMediaFileName = `in_content_image_${inContentImage.id}_${Date.now()}.jpeg`;
                const uploadedInContentMedia = await uploadMedia(
                    inContentImage.url,
                    inContentMediaFileName,
                    inContentImage.alt,
                    wpConfig.baseUrl,
                    wpConfig.username,
                    wpConfig.appPassword
                );

                processedContent = processedContent.replace(
                    placeholder,
                    `<figure><img src="${escapeAttribute(uploadedInContentMedia.source_url)}" alt="${escapeAttribute(inContentImage.alt)}" class="wp-image-${escapeAttribute(uploadedInContentMedia.id)}" /><figcaption>Foto: ${escapeAttribute(inContentImage.photographer)} / Pexels</figcaption></figure>`
                );
            }
        }

        // 3. Buat Post di WordPress
        const postData = {
            title: title,
            content: processedContent,
            status: 'draft',
            featured_media: featuredMediaId,
        };

        const wpResponse = await fetch(`${fullApiUrl}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`,
            },
            body: JSON.stringify(postData),
        });

        if (!wpResponse.ok) {
            const message = await readResponseError(wpResponse, 'Failed to create WordPress post');
            throw new Error(message);
        }

        const result = await wpResponse.json();

        return NextResponse.json({
            success: true,
            postId: result.id,
            postUrl: result.link
        });

    } catch (error: unknown) {
        console.error('Error interacting with WordPress API:', getErrorMessage(error));
        return NextResponse.json({
            error: 'Failed to create WordPress post',
            details: getErrorMessage(error)
        }, { status: 500 });
    }
}
