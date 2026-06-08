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

interface WordPressPost {
    id: number | string;
    link?: string;
}

class ApiRouteError extends Error {
    status: number;

    constructor(message: string, status = 500) {
        super(message);
        this.name = 'ApiRouteError';
        this.status = status;
    }
}

function stripHtml(value: string) {
    return value
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/\s+/g, ' ')
        .trim();
}

async function readResponseError(response: Response, fallback: string) {
    try {
        const text = await response.text();
        if (!text) return fallback;

        try {
            const data = JSON.parse(text);
            return typeof data?.message === 'string' ? stripHtml(data.message) : stripHtml(text);
        } catch {
            return stripHtml(text);
        }
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
            throw new ApiRouteError(`Pexels image search failed: ${message}`, response.status);
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

    throw new ApiRouteError(`No Pexels image found for query: ${cleanQueries[0]}`, 422);
}

async function assertWordPressConnection(fullApiUrl: string, auth: string) {
    const response = await fetch(`${fullApiUrl}/users/me?context=edit`, {
        headers: {
            Authorization: `Basic ${auth}`,
        },
    });

    if (response.ok) {
        return;
    }

    const message = await readResponseError(response, 'Failed to authenticate with WordPress');
    const prefix = response.status === 401 || response.status === 403
        ? 'WordPress authentication failed'
        : 'WordPress REST API check failed';

    throw new ApiRouteError(`${prefix}: ${message}`, response.status);
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
        if (!imageResponse.ok) {
            throw new ApiRouteError('Failed to fetch image from Pexels', imageResponse.status);
        }
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
            throw new ApiRouteError(`WordPress media upload failed: ${message}`, uploadResponse.status);
        }

        return await uploadResponse.json() as UploadedWordPressMedia;
    } catch (error: unknown) {
        console.error('Error uploading media to WordPress:', getErrorMessage(error));
        throw error;
    }
}

async function writeWordPressJson<T>(
    url: string,
    auth: string,
    body: Record<string, unknown>,
    step: string
) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const message = await readResponseError(response, `${step} failed`);
        throw new ApiRouteError(`${step} failed: ${message}`, response.status);
    }

    return await response.json() as T;
}

function buildFeaturedImageQuery(title: string, prompt: string, content: string) {
    const firstPlaceholder = content.match(/\[Gambar:\s*([^\]]+)\]/)?.[1] || '';
    return [firstPlaceholder, prompt, title];
}

export async function POST(request: Request) {
    let createdPost: WordPressPost | null = null;

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

        await assertWordPressConnection(fullApiUrl, auth);

        // 1. Buat draft minimal dulu supaya error create-post tidak tercampur dengan upload gambar/content.
        createdPost = await writeWordPressJson<WordPressPost>(
            `${fullApiUrl}/posts`,
            auth,
            {
                title,
                content: '<p>Draft sedang diproses oleh WP Content Architect.</p>',
                status: 'draft',
            },
            'WordPress minimal draft creation'
        );

        // 2. Unggah Featured Image
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

        // 3. Unggah Gambar dalam Konten
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

        // 4. Update konten dulu, lalu featured image secara terpisah agar fatal error WP lebih mudah dilacak.
        const contentUpdate = await writeWordPressJson<WordPressPost>(
            `${fullApiUrl}/posts/${createdPost.id}`,
            auth,
            {
                content: processedContent,
            },
            'WordPress content update'
        );

        const featuredUpdate = await writeWordPressJson<WordPressPost>(
            `${fullApiUrl}/posts/${createdPost.id}`,
            auth,
            {
                featured_media: featuredMediaId,
            },
            'WordPress featured image update'
        );

        return NextResponse.json({
            success: true,
            postId: featuredUpdate.id || contentUpdate.id || createdPost.id,
            postUrl: featuredUpdate.link || contentUpdate.link || createdPost.link
        });

    } catch (error: unknown) {
        const status = error instanceof ApiRouteError ? error.status : 500;
        console.error('Error interacting with WordPress API:', getErrorMessage(error));
        return NextResponse.json({
            error: 'Failed to create WordPress post',
            details: getErrorMessage(error),
            postId: createdPost?.id,
            postUrl: createdPost?.link,
        }, { status });
    }
}
