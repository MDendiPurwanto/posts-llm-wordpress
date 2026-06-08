import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { marked } from 'marked';
import { getErrorMessage, getOpenRouterConfig } from '@/lib/config';

export const runtime = 'nodejs';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
        const openRouterConfig = getOpenRouterConfig(body);

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
        }

        if (!openRouterConfig.apiKey || !openRouterConfig.model) {
            return NextResponse.json({ error: 'Missing OpenRouter configuration.' }, { status: 400 });
        }

        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: openRouterConfig.apiKey,
            defaultHeaders: {
                "HTTP-Referer": openRouterConfig.siteUrl,
                "X-Title": openRouterConfig.appTitle,
            }
        });

        const chatCompletion = await openai.chat.completions.create({
            model: openRouterConfig.model,
            messages: [
                {
                    role: "system",
                    content: `You are an expert blog writer.
          Generate a high-quality, SEO-optimized blog post in Indonesian.
          Structure:
          1. Title: Must start with '## Title: [The Title]'.
          2. Engaging introduction.
          3. 3-5 sub-sections with '### Sub-title'.
          4. Include 2-3 contextual image placeholders using exactly this format: '[Gambar: english stock photo search query]'.
          5. Image queries must be concrete, visual, and context-specific. Use 3-7 English keywords, avoid abstract words, avoid brand names, and avoid generic queries like "technology" or "business".
          6. Conclusion with a call to action.
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
        let contentMarkdown = chatCompletion.choices[0]?.message?.content || "";

        if (!contentMarkdown.trim()) {
            throw new Error('OpenRouter returned empty content.');
        }

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

    } catch (error: unknown) {
        console.error('OpenRouter Generation Error:', error);
        return NextResponse.json({
            error: 'Failed to generate content',
            details: getErrorMessage(error)
        }, { status: 500 });
    }
}
