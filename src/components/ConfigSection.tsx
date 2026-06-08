'use client';

import { useState } from 'react';

interface ConfigSectionProps {
    wpApiUrl: string;
    setWpApiUrl: (val: string) => void;
    wpUsername: string;
    setWpUsername: (val: string) => void;
    wpAppPassword: string;
    setWpAppPassword: (val: string) => void;
    openrouterApiKey: string;
    setOpenrouterApiKey: (val: string) => void;
    openrouterModel: string;
    setOpenrouterModel: (val: string) => void;
    pexelsApiKey: string;
    setPexelsApiKey: (val: string) => void;
    saveConfig: () => void;
    configSaved: boolean;
    serverConfigReady: boolean;
}

export default function ConfigSection({
    wpApiUrl, setWpApiUrl,
    wpUsername, setWpUsername,
    wpAppPassword, setWpAppPassword,
    openrouterApiKey, setOpenrouterApiKey,
    openrouterModel, setOpenrouterModel,
    pexelsApiKey, setPexelsApiKey,
    saveConfig, configSaved, serverConfigReady
}: ConfigSectionProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="premium-card p-6 mb-8 overflow-hidden transition-all duration-300 ease-in-out">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between text-left group"
            >
                <div>
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                        0. API Configuration
                    </h2>
                    <p className="text-sm text-muted">Setup your WordPress and AI credentials</p>
                </div>
                <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg className="w-6 h-6 text-gray-400 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            </button>

            {isOpen && (
                <div className="mt-6 space-y-6">
                    {serverConfigReady && (
                        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
                            Konfigurasi server dari .env.local sudah lengkap, termasuk Pexels. Form ini hanya diperlukan jika ingin override dari browser.
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">WordPress Base URL</label>
                            <input
                                type="text"
                                value={wpApiUrl}
                                onChange={(e) => setWpApiUrl(e.target.value)}
                                placeholder="https://yourdomain.com"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">WP Username</label>
                            <input
                                type="text"
                                value={wpUsername}
                                onChange={(e) => setWpUsername(e.target.value)}
                                placeholder="Username"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">WP Application Password</label>
                            <input
                                type="password"
                                value={wpAppPassword}
                                onChange={(e) => setWpAppPassword(e.target.value)}
                                placeholder="xxxx xxxx xxxx xxxx"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">OpenRouter API Key</label>
                            <input
                                type="password"
                                value={openrouterApiKey}
                                onChange={(e) => setOpenrouterApiKey(e.target.value)}
                                placeholder="sk-or-..."
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">OpenRouter Model</label>
                            <input
                                type="text"
                                value={openrouterModel}
                                onChange={(e) => setOpenrouterModel(e.target.value)}
                                placeholder="google/gemini-2.0-flash-exp:free"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-gray-700">Pexels API Key</label>
                            <input
                                type="password"
                                value={pexelsApiKey}
                                onChange={(e) => setPexelsApiKey(e.target.value)}
                                placeholder="Pexels API key"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                            <p className="text-xs text-muted">Dipakai untuk mencari gambar yang sesuai konteks artikel dan placeholder gambar.</p>
                        </div>
                    </div>

                    <button
                        onClick={saveConfig}
                        className={`w-full py-3 px-6 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${configSaved ? 'bg-green-500 hover:bg-green-600' : 'bg-primary hover:bg-primary-hover shadow-primary/30'
                            }`}
                    >
                        {configSaved ? 'Configuration Saved' : 'Save Configuration'}
                    </button>
                </div>
            )}
        </div>
    );
}
