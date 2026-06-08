'use client';

interface ContentFormProps {
    prompt: string;
    setPrompt: (val: string) => void;
    loading: boolean;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    configReady: boolean;
}

export default function ContentForm({
    prompt,
    setPrompt,
    loading,
    handleSubmit,
    configReady
}: ContentFormProps) {
    return (
        <div className="premium-card p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">1. Content Generation</h2>
            <p className="text-sm text-muted mb-6">Describe the topic you want to write about</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="prompt" className="text-sm font-semibold text-gray-700">Topic / Prompt</label>
                    <textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={5}
                        placeholder="e.g., The benefits of morning meditation for mental health..."
                        disabled={loading}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none bg-gray-50/50"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !prompt.trim() || !configReady}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 ${(loading || !configReady)
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-primary hover:bg-primary-hover shadow-primary/30'
                        }`}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>Generating & Publishing...</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            <span>{configReady ? 'Generate & Publish Draft' : 'Save Config to Start'}</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
