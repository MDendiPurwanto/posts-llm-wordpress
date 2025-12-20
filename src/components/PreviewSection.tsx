'use client';

interface PreviewSectionProps {
    title: string;
    content: string;
    postUrl: string;
}

export default function PreviewSection({ title, content, postUrl }: PreviewSectionProps) {
    if (!title || !content) return null;

    return (
        <div className="premium-card p-6 border-t-4 border-primary">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-bottom border-gray-100">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 leading-tight">2. Preview Content</h2>
                    <p className="text-sm text-muted">Review what AI generated for your blog</p>
                </div>

                {postUrl && (
                    <a
                        href={postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition-colors"
                    >
                        <span>View on WordPress</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                )}
            </div>

            <div className="prose prose-sm max-w-none">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">{title}</h1>
                <div
                    className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-inner overflow-y-auto max-h-[600px] leading-relaxed text-gray-700"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
        </div>
    );
}
