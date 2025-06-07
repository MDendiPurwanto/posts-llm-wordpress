// app/api/wordpress/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';

// Fungsi uploadMedia perlu menerima kredensial sebagai argumen
async function uploadMedia(imageUrl, fileName, title, wpBaseUrl, wpUsername, wpAppPassword) { // Ubah wpApiUrl menjadi wpBaseUrl
  try {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
    });
    const imageBuffer = response.data;

    const formData = new FormData();
    formData.append('file', imageBuffer, fileName);
    formData.append('title', title);

    // Bentuk URL API lengkap di sini
    const fullApiUrl = `${wpBaseUrl}/wp-json/wp/v2`;
    
    const uploadResponse = await axios.post(`${fullApiUrl}/media`, formData, { // Gunakan fullApiUrl
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Basic ${Buffer.from(`${wpUsername}:${wpAppPassword}`).toString('base64')}`,
      },
    });
    return uploadResponse.data;
  } catch (error) {
    console.error('Error uploading media to WordPress:', error.response?.data || error.message);
    throw new Error('Failed to upload media to WordPress');
  }
}

async function getPlaceholderImageUrl() {
  const placeholderImages = [
    'https://picsum.photos/800/600',
    'https://picsum.photos/600/400',
    'https://picsum.photos/700/500'
  ];
  return placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
}

export async function POST(request) {
  try {
    const { title, content, wpApiUrl, wpUsername, wpAppPassword } = await request.json(); // Masih terima wpApiUrl dari frontend

    // Ganti nama variabel dari wpApiUrl menjadi wpBaseUrl untuk kejelasan
    const wpBaseUrl = wpApiUrl; // wpApiUrl dari frontend sekarang adalah base URL
    
    if (!title || !content || !wpBaseUrl || !wpUsername || !wpAppPassword) {
      return NextResponse.json({ error: 'Missing title, content, or WordPress configuration.' }, { status: 400 });
    }

    // Bentuk URL API lengkap di sini, untuk request post
    const fullApiUrl = `${wpBaseUrl}/wp-json/wp/v2`;

    // 1. Unggah Featured Image
    const featuredImageUrl = await getPlaceholderImageUrl();
    const featuredMediaFileName = `featured_image_${Date.now()}.jpeg`;
    // Teruskan wpBaseUrl ke fungsi uploadMedia
    const uploadedFeaturedMedia = await uploadMedia(featuredImageUrl, featuredMediaFileName, `${title} - Featured Image`, wpBaseUrl, wpUsername, wpAppPassword);

    const featuredMediaId = uploadedFeaturedMedia.id;

    // 2. Unggah Gambar dalam Konten
    let processedContent = content;
    const llmImagePlaceholders = content.match(/\[Gambar:\s*([^\]]+)\]/g);

    if (llmImagePlaceholders && llmImagePlaceholders.length > 0) {
      for (const placeholder of llmImagePlaceholders) {
        const inContentImageUrl = await getPlaceholderImageUrl();
        const inContentMediaFileName = `in_content_image_${Date.now()}.jpeg`;
        // Teruskan wpBaseUrl ke fungsi uploadMedia
        const uploadedInContentMedia = await uploadMedia(inContentImageUrl, inContentMediaFileName, placeholder.replace('[Gambar:', '').replace(']', ''), wpBaseUrl, wpUsername, wpAppPassword);

        processedContent = processedContent.replace(
          placeholder,
          `<img src="${uploadedInContentMedia.source_url}" alt="${uploadedInContentMedia.title.rendered}" />`
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

    const wpResponse = await axios.post(`${fullApiUrl}/posts`, postData, { // Gunakan fullApiUrl
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${wpUsername}:${wpAppPassword}`).toString('base64')}`,
      },
    });

    return NextResponse.json({ success: true, postId: wpResponse.data.id, postUrl: wpResponse.data.link });

  } catch (error) {
    console.error('Error interacting with WordPress API:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to create WordPress post', details: error.response?.data || error.message }, { status: 500 });
  }
}