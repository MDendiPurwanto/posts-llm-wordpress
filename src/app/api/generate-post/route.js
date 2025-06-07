// app/api/generate-post/route.js
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { marked } from 'marked';

export async function POST(request) {
  try {
    // Ambil prompt, openrouterApiKey, dan openrouterModel dari body request
    const { prompt, openrouterApiKey, openrouterModel } = await request.json();

    if (!prompt || !openrouterApiKey || !openrouterModel) {
      return NextResponse.json({ error: 'Missing prompt or OpenRouter configuration.' }, { status: 400 });
    }

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: openrouterApiKey, // Gunakan API Key yang dikirim dari frontend
    });

    const chatCompletion = await openai.chat.completions.create({
      model: openrouterModel, // Gunakan Model yang dikirim dari frontend
      messages: [
        {
          role: "system",
          content: `Anda adalah penulis blog ahli untuk situs teknologi/pendidikan.
                    Buat postingan blog yang menarik dan informatif untuk audiens umum (mahasiswa, profesional muda).
                    Gaya penulisan harus santai namun berwibawa, dan mudah dipahami.
                    **Batasi panjang total postingan sekitar 5000 kata.**
                    Struktur output dalam format Markdown, meliputi:
                    1. Judul: Harus dimulai dengan '## Judul: [Judul Anda]'.
                    2. Pendahuluan (intro menarik).
                    3. Minimal 3-5 sub-bagian dengan heading (misalnya, '### Sub Judul').
                    4. Setiap sub-bagian harus mencakup satu ide untuk gambar yang relevan di dalam konten, formatnya '[Gambar: Deskripsi singkat gambar]'.
                    5. Kesimpulan yang merangkum poin utama dan ajakan bertindak (call to action) sederhana.
                    Gunakan tanda bintang ganda (**) untuk teks tebal.
                    Pastikan konten asli, informatif, dan tidak mengandung plagiarisme.`
        },
        {
          role: "user",
          content: `Hasilkan postingan blog lengkap tentang topik berikut: "${prompt}"`
        },
      ],
      max_tokens: 6700,
      temperature: 0.7,
    });

    let title = "Judul Postingan Default";
    let contentForConversion = chatCompletion.choices[0].message.content;

    const titleMatch = contentForConversion.match(/^## Judul:\s*(.*)/m);

    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].replace(/\*\*/g, '').trim();
      contentForConversion = contentForConversion.replace(titleMatch[0], '').trim();
    } else {
        const lines = contentForConversion.split('\n');
        const firstMeaningfulLine = lines.find(line => line.trim().length > 0);
        if (firstMeaningfulLine) {
            title = firstMeaningfulLine.replace(/^#+\s*/, '').replace(/\*\*/g, '').trim();
            contentForConversion = contentForConversion.replace(firstMeaningfulLine, '').trim();
        }
    }

    const contentHtml = marked(contentForConversion);

    return NextResponse.json({ title, content: contentHtml });

  } catch (error) {
    console.error('Error generating content with OpenRouter:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to generate content', details: error.response?.data || error.message }, { status: 500 });
  }
}