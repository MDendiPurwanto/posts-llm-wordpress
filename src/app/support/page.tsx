'use client';

import Link from 'next/link';

export default function SupportPage() {
    return (
        <main className="min-h-screen py-20 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="inline-flex items-center text-primary hover:underline mb-8 gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Kembali ke Generator
                </Link>

                <div className="premium-card overflow-hidden">
                    <div className="bg-primary p-8 text-white text-center">
                        <h1 className="text-3xl font-bold mb-2">Butuh Bantuan?</h1>
                        <p className="opacity-90">Tim kami siap mendukung perjalanan pembuatan konten Anda.</p>
                    </div>

                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Topik Dukungan Umum</h2>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-2 text-gray-600">
                                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                                    Kegagalan koneksi WordPress
                                </li>
                                <li className="flex items-center gap-2 text-gray-600">
                                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                                    Masalah kuota API OpenRouter
                                </li>
                                <li className="flex items-center gap-2 text-gray-600">
                                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                                    Pemecahan masalah pembuatan gambar
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col justify-center items-center text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Dukungan Langsung</h3>
                            <p className="text-sm text-muted mb-4">Kirimkan email kepada kami dan kami akan membalas dalam waktu 24 jam.</p>
                            <a href="mailto:support@unma.ac.id" className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover transition-colors">
                                Hubungi Dukungan
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
