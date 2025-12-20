import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { marked } from 'marked';

export async function POST(request: Request) {
    try {
        const { prompt, openrouterApiKey, openrouterModel } = await request.json();

        if (!prompt || !openrouterApiKey || !openrouterModel) {
            return NextResponse.json({ error: 'Missing prompt or OpenRouter configuration.' }, { status: 400 });
        }

        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: openrouterApiKey,
            defaultHeaders: {
                "HTTP-Referer": "https://github.com/MDendiPurwanto/posts-llm-wordpress",
                "X-Title": "WP Content Architect",
            }
        });

        const chatCompletion = await openai.chat.completions.create({
            model: openrouterModel,
            messages: [
                {
                    role: "system",
                    content: `You are an expert blog writer. 
          Generate a high-quality, SEO-optimized blog post in Indonesian.
          Structure:
          1. Title: Must start with '## Title: [The Title]'.
          2. Engaging introduction.
          3. 3-5 sub-sections with '### Sub-title'.
          4. Include image placeholders: '[Gambar: description]'.
          5. Conclusion with a call to action.
          Format: Markdown.`
                },
                {
                    role: "user",
                    content: `Write a blog post about: "${prompt}"`
                },
            ],
            max_tokens: 4000,
            temperature: 0.7,
        });

        let title = "Default Title";
        let contentMarkdown = chatCompletion.choices[0].message.content || "";

        const titleMatch = contentMarkdown.match(/^## Title:\s*(.*)/m) || contentMarkdown.match(/^## Judul:\s*(.*)/m);

        if (titleMatch && titleMatch[1]) {
            title = titleMatch[1].replace(/\*\*/g, '').trim();
            contentMarkdown = contentMarkdown.replace(titleMatch[0], '').trim();
        } else {
            const lines = contentMarkdown.split('\n');
            const firstLine = lines.find(line => line.trim().startsWith('#'));
            if (firstLine) {
                title = firstLine.replace(/^#+\s*/, '').replace(/\*\*/g, '').trim();
                contentMarkdown = contentMarkdown.replace(firstLine, '').trim();
            }
        }

        const contentHtml = await marked.parse(contentMarkdown);

        return NextResponse.json({ title, content: contentHtml });

    } catch (error: any) {
        console.error('OpenRouter Generation Error:', error);
        return NextResponse.json({
            error: 'Failed to generate content',
            details: error.message
        }, { status: 500 });
    }
}
