'use client';

import { useState } from 'react';
import Link from 'next/link';

const tutorials = [
    {
        title: "Memulai dengan WP Content Architect",
        description: "Pelajari cara menghubungkan situs WordPress Anda dan mulai membuat postingan dalam waktu kurang dari 5 menit.",
        icon: "🚀",
        content: "Untuk memulai, buka Admin WordPress Anda -> Users -> Profile. Gulir ke bawah ke bagian Application Passwords dan buat password baru. Salin password tersebut beserta username dan URL situs Anda ke bagian Konfigurasi di aplikasi ini."
    },
    {
        title: "Mengoptimalkan Prompt AI",
        description: "Temukan praktik terbaik untuk menulis perintah (prompt) yang menghasilkan postingan blog berkualitas tinggi.",
        icon: "✍️",
        content: "Jadilah spesifik! Daripada menulis 'Tulis tentang anjing', cobalah 'Tulis postingan blog tentang manfaat mengadopsi anjing senior bagi keluarga dengan anak kecil'. Sertakan kata kunci yang ingin Anda targetkan untuk SEO."
    },
    {
        title: "Mengelola Media & Gambar",
        description: "Cara kerja sistem placeholder gambar otomatis kami dan cara menyesuaikan gambar fitur.",
        icon: "🖼️",
        content: "Sistem kami secara otomatis mendeteksi placeholder '[Gambar: deskripsi]' dalam teks yang dihasilkan dan menggantinya dengan gambar berkualitas tinggi. Anda juga dapat mengubah gambar fitur di pengaturan API route."
    },
    {
        title: "Konfigurasi Tingkat Lanjut",
        description: "Pelajari lebih dalam tentang model OpenRouter dan password aplikasi WordPress.",
        icon: "⚙️",
        content: "Anda dapat menggunakan model apa pun yang tersedia di OpenRouter dengan mengubah ID Model (misalnya, 'anthropic/claude-3-sonnet'). Pastikan API Key Anda memiliki saldo yang cukup untuk model yang dipilih."
    }
];

export default function TutorialsPage() {
    const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

    return (
        <main className="min-h-screen py-20 px-4 sm:px-6 bg-slate-50/50">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="inline-flex items-center text-primary font-medium hover:underline mb-12 gap-2 group">
                    <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Kembali ke Generator
                </Link>

                <header className="mb-16">
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Tutorial</h1>
                    <p className="text-xl text-muted leading-relaxed max-w-2xl">Kuasai seni pembuatan konten bertenaga AI dengan panduan komprehensif dan praktik terbaik kami.</p>
                </header>

                <div className="grid grid-cols-1 gap-8">
                    {tutorials.map((item, idx) => (
                        <div
                            key={idx}
                            className={`premium-card p-8 transition-all duration-500 cursor-pointer ${expandedIdx === idx ? 'ring-2 ring-primary bg-white' : 'hover:border-primary/50 bg-white/80'}`}
                            onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                        >
                            <div className="flex gap-6 items-start">
                                <div className="p-4 bg-primary/5 rounded-2xl text-4xl">
                                    {item.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
                                        <span className={`text-primary font-bold transform transition-transform duration-300 ${expandedIdx === idx ? 'rotate-180' : ''}`}>
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </span>
                                    </div>
                                    <p className="text-muted text-lg leading-relaxed mb-4">{item.description}</p>

                                    {expandedIdx === idx && (
                                        <div className="mt-6 pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-500">
                                            <div className="prose prose-slate max-w-none">
                                                <p className="text-gray-700 leading-relaxed text-lg">
                                                    {item.content}
                                                </p>
                                                <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-3">
                                                    <svg className="w-6 h-6 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                    </svg>
                                                    <p className="text-sm text-blue-800 font-medium">Pro tip: Always double-check your generated drafts before publishing them live.</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <button className="text-primary font-bold text-sm mt-4 inline-flex items-center gap-1 hover:gap-2 transition-all">
                                        {expandedIdx === idx ? 'Tutup' : 'Baca Panduan →'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
