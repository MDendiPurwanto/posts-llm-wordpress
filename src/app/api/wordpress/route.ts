import { NextResponse } from 'next/server';

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
            const errorData = await uploadResponse.json();
            console.error('WordPress Media Upload Error:', errorData);
            throw new Error(errorData.message || 'Failed to upload media');
        }

        return await uploadResponse.json();
    } catch (error: any) {
        console.error('Error uploading media to WordPress:', error.message);
        throw error;
    }
}

async function getPlaceholderImageUrl() {
    const ids = [10, 11, 12, 13, 14, 15];
    const id = ids[Math.floor(Math.random() * ids.length)];
    return `https://picsum.photos/id/${id}/800/600`;
}

export async function POST(request: Request) {
    try {
        const { title, content, wpApiUrl, wpUsername, wpAppPassword } = await request.json();

        if (!title || !content || !wpApiUrl || !wpUsername || !wpAppPassword) {
            return NextResponse.json({ error: 'Missing title, content, or WordPress configuration.' }, { status: 400 });
        }

        const cleanBaseUrl = wpApiUrl.replace(/\/+$/, '');
        const fullApiUrl = `${cleanBaseUrl}/wp-json/wp/v2`;
        const auth = Buffer.from(`${wpUsername}:${wpAppPassword}`).toString('base64');

        // 1. Unggah Featured Image
        const featuredImageUrl = await getPlaceholderImageUrl();
        const featuredMediaFileName = `featured_image_${Date.now()}.jpeg`;
        const uploadedFeaturedMedia = await uploadMedia(
            featuredImageUrl,
            featuredMediaFileName,
            `${title} - Featured Image`,
            cleanBaseUrl,
            wpUsername,
            wpAppPassword
        );

        const featuredMediaId = uploadedFeaturedMedia.id;

        // 2. Unggah Gambar dalam Konten
        let processedContent = content;
        const llmImagePlaceholders = content.match(/\[Gambar:\s*([^\]]+)\]/g);

        if (llmImagePlaceholders && llmImagePlaceholders.length > 0) {
            for (const placeholder of llmImagePlaceholders) {
                const inContentImageUrl = await getPlaceholderImageUrl();
                const inContentMediaFileName = `in_content_image_${Date.now()}.jpeg`;
                const uploadedInContentMedia = await uploadMedia(
                    inContentImageUrl,
                    inContentMediaFileName,
                    placeholder.replace('[Gambar:', '').replace(']', ''),
                    cleanBaseUrl,
                    wpUsername,
                    wpAppPassword
                );

                processedContent = processedContent.replace(
                    placeholder,
                    `<img src="${uploadedInContentMedia.source_url}" alt="${uploadedInContentMedia.title.rendered}" class="wp-image-${uploadedInContentMedia.id}" />`
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
            const errorData = await wpResponse.json();
            throw new Error(errorData.message || 'Failed to create WordPress post');
        }

        const result = await wpResponse.json();

        return NextResponse.json({
            success: true,
            postId: result.id,
            postUrl: result.link
        });

    } catch (error: any) {
        console.error('Error interacting with WordPress API:', error.message);
        return NextResponse.json({
            error: 'Failed to create WordPress post',
            details: error.message
        }, { status: 500 });
    }
}
