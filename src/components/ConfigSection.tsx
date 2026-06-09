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

interface SecretToggleButtonProps {
    visible: boolean;
    onClick: () => void;
    label: string;
}

function SecretToggleButton({ visible, onClick, label }: SecretToggleButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={visible ? `Sembunyikan ${label}` : `Lihat ${label}`}
            title={visible ? `Sembunyikan ${label}` : `Lihat ${label}`}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary"
        >
            {visible ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58M9.88 4.24A10.62 10.62 0 0112 4c5 0 9.27 3.11 11 7.5a11.71 11.71 0 01-3.08 4.44M6.1 6.1A11.86 11.86 0 001 11.5a11.87 11.87 0 006.29 6.36A10.75 10.75 0 0012 19c1.37 0 2.68-.24 3.9-.68" />
                </svg>
            ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                </svg>
            )}
        </button>
    );
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
    const [showWpAppPassword, setShowWpAppPassword] = useState(false);
    const [showOpenrouterApiKey, setShowOpenrouterApiKey] = useState(false);
    const [showPexelsApiKey, setShowPexelsApiKey] = useState(false);

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
                            <div className="relative">
                                <input
                                    type={showWpAppPassword ? 'text' : 'password'}
                                    value={wpAppPassword}
                                    onChange={(e) => setWpAppPassword(e.target.value)}
                                    placeholder="xxxx xxxx xxxx xxxx"
                                    className="w-full rounded-lg border px-4 py-2 pr-12 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
                                />
                                <SecretToggleButton
                                    visible={showWpAppPassword}
                                    onClick={() => setShowWpAppPassword((value) => !value)}
                                    label="WP Application Password"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">OpenRouter API Key</label>
                            <div className="relative">
                                <input
                                    type={showOpenrouterApiKey ? 'text' : 'password'}
                                    value={openrouterApiKey}
                                    onChange={(e) => setOpenrouterApiKey(e.target.value)}
                                    placeholder="sk-or-..."
                                    className="w-full rounded-lg border px-4 py-2 pr-12 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
                                />
                                <SecretToggleButton
                                    visible={showOpenrouterApiKey}
                                    onClick={() => setShowOpenrouterApiKey((value) => !value)}
                                    label="OpenRouter API Key"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">OpenRouter Model</label>
                            <input
                                type="text"
                                value={openrouterModel}
                                onChange={(e) => setOpenrouterModel(e.target.value)}
                                placeholder="z-ai/glm-4.5-air:free"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-gray-700">Pexels API Key</label>
                            <div className="relative">
                                <input
                                    type={showPexelsApiKey ? 'text' : 'password'}
                                    value={pexelsApiKey}
                                    onChange={(e) => setPexelsApiKey(e.target.value)}
                                    placeholder="Pexels API key"
                                    className="w-full rounded-lg border px-4 py-2 pr-12 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
                                />
                                <SecretToggleButton
                                    visible={showPexelsApiKey}
                                    onClick={() => setShowPexelsApiKey((value) => !value)}
                                    label="Pexels API Key"
                                />
                            </div>
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
