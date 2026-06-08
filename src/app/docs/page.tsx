'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DocumentationPage() {
    const [activeSection, setActiveSection] = useState("Mencari URL WP");

    const sections = [
        {
            title: "Panduan Setup",
            items: ["Mencari URL WP", "Membuat Password Aplikasi", "Setup OpenRouter"]
        },
        {
            title: "Panduan Deploy",
            items: ["Deploy ke Produksi", "Keamanan Lanjutan"]
        },
        {
            title: "Mekanisme Inti",
            items: ["Ikhtisar Arsitektur", "Implementasi RSC", "API Routes Handler"]
        },
        {
            title: "WordPress API",
            items: ["Password Aplikasi", "Endpoint Media", "Hook Pembuatan Post"]
        },
        {
            title: "Headless Setup",
            items: ["Ikhtisar Headless", "Implementasi Auth", "Mengambil Konten"]
        },
        {
            title: "Integrasi AI",
            items: ["Header OpenRouter", "Parsing Markdown", "Prompt Engineering", "Gambar Kontekstual"]
        }
    ];

    const contentData: Record<string, { title: string, text: string, code?: string }> = {
        "Mencari URL WP": {
            title: "Cara Menemukan URL WordPress",
            text: "URL Dasar WordPress adalah alamat utama situs web Anda. Misalnya, jika situs Anda adalah 'https://blogsaya.com', maka URL Dasarnya adalah 'https://blogsaya.com'. Jangan sertakan '/wp-admin' atau '/wp-json' di akhir; aplikasi akan menanganinya secara otomatis.",
        },
        "Membuat Password Aplikasi": {
            title: "Membuat Password Aplikasi",
            text: "1. Masuk ke dashboard Admin WordPress Anda.\n2. Navigasi ke 'Users' (Pengguna) -> 'Profile' (Profil).\n3. Gulir ke bawah ke bagian 'Application Passwords' (Kata Sandi Aplikasi).\n4. Ketik nama (misalnya, 'AI Generator') dan klik 'Add New Application Password'.\n5. Salin password 24 karakter yang muncul. Anda tidak akan bisa melihatnya lagi!",
        },
        "Setup OpenRouter": {
            title: "Mendapatkan API Key OpenRouter",
            text: "1. Buat akun di OpenRouter.ai.\n2. Buka Dashboard -> Keys.\n3. Buat API Key baru.\n4. Pastikan Anda memiliki saldo jika ingin menggunakan model berbayar, meskipun banyak model gratis (seperti Gemini Flash) yang tersedia.",
            code: "// Contoh ID Model\ngoogle/gemini-2.0-flash-exp:free"
        },
        "Gambar Kontekstual": {
            title: "Gambar Kontekstual dengan Pexels",
            text: "Aplikasi meminta AI membuat placeholder gambar berupa query foto yang spesifik, lalu mencari gambar di Pexels berdasarkan query tersebut. Jika Pexels tidak menemukan gambar yang cocok, proses akan berhenti dengan pesan error supaya draft tidak memakai gambar acak yang tidak relevan.",
            code: "// Contoh placeholder dari AI\n[Gambar: teacher using laptop in classroom]\n[Gambar: small business owner packing online orders]"
        },
        "Deploy ke Produksi": {
            title: "Panduan Deployment Produksi",
            text: "Untuk menjalankan aplikasi ini secara publik, Anda memiliki dua pilihan utama:\n\n1. **Vercel (Rekomendasi)**: Hubungkan repositori GitHub Anda ke Vercel. Mereka akan secara otomatis mendeteksi Next.js dan melakukan build.\n2. **VPS (Self-Hosted)**: Gunakan PM2 atau Docker. Jalankan 'npm run build' kemudian 'npm run start'.\n\nPastikan Anda mengatur domain dengan HTTPS karena API WordPress memerlukan koneksi aman.",
            code: "# Langkah Build Manual\nnpm run build\nnpm run start"
        },
        "Keamanan Lanjutan": {
            title: "Tips Keamanan Produksi",
            text: "1. **Batasi Password Aplikasi**: Hanya berikan akses ke user WordPress yang memiliki role 'Editor' atau 'Author', jangan Administrator jika tidak perlu.\n2. **CORS Policy**: Jika Anda memodifikasi API route, pastikan untuk membatasi origin hanya dari domain produksi Anda.\n3. **HTTPS**: Jangan pernah menggunakan aplikasi ini melalui HTTP biasa karena kredensial Anda akan dikirim dalam teks biasa (plain text).",
        },
        "Ikhtisar Arsitektur": {
            title: "Arsitektur Sistem",
            text: "Aplikasi ini dibangun menggunakan Next.js 15 dengan arsitektur App Router. Menggunakan React Server Components untuk rendering yang efisien dan Client Components untuk state interaktif seperti manajemen konfigurasi.",
            code: "// Contoh Struktur Permintaan API\nPOST /api/generate-post\n{\n  \"prompt\": \"Masa depan AI\",\n  \"openrouterModel\": \"google/gemini-2.0-flash-exp:free\"\n}"
        },
        "Implementasi RSC": {
            title: "React Server Components",
            text: "Kami memanfaatkan RSC untuk bagian statis dari dokumentasi dan halaman bantuan untuk mengurangi ukuran bundle JavaScript di sisi client. Komponen seperti ini adalah Client Component karena adanya state navigasi interaktif.",
        },
        "API Routes Handler": {
            title: "Route Handlers",
            text: "Semua komunikasi eksternal (WordPress API dan OpenRouter) ditangani melalui Next.js Route Handlers. Ini menjaga API Key Anda tetap aman karena tidak pernah sampai ke konsol browser client.",
        },
        "Password Aplikasi": {
            title: "Autentikasi WordPress",
            text: "Integrasi kami menggunakan Password Aplikasi WordPress. Ini lebih aman daripada menggunakan password akun utama Anda dan dapat dicabut kapan saja dari profil WordPress Anda.",
        },
        "Endpoint Media": {
            title: "Manajemen Media",
            text: "Gambar ditangani melalui endpoint /wp/v2/media. Kami pertama-tama mengunggah gambar ke pustaka media, mendapatkan ID-nya, lalu mengaitkannya dengan post atau menyisipkannya ke dalam HTML konten.",
        },
        "Ikhtisar Headless": {
            title: "Arsitektur Headless",
            text: "Dalam setup headless, WordPress bertindak semata-mata sebagai backend CMS yang menyediakan data melalui REST API, sementara frontend modern seperti Next.js atau Vue.js menangani rendering. Ini memberikan performa dan fleksibilitas pengembang yang unggul.",
        },
        "Implementasi Auth": {
            title: "Kode Autentikasi",
            text: "Untuk mengautentikasi aplikasi headless Anda, gunakan header Basic Auth dengan Password Aplikasi Anda. Pastikan string base64 Anda mengikuti format 'username:password'.",
            code: "// Konstruksi Header Basic Auth\nconst auth = btoa(`${username}:${appPassword}`);\n\nconst response = await fetch('https://wp-anda.com/wp-json/wp/v2/posts', {\n  method: 'POST',\n  headers: {\n    'Authorization': `Basic ${auth}`,\n    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify(postData)\n});"
        },
        "Mengambil Konten": {
            title: "Pengambilan & Rendering",
            text: "Saat mengambil post di frontend Anda, pastikan Anda menangani HTML yang di-render dengan aman. Jika menggunakan React, Anda biasanya akan menggunakan dangerouslySetInnerHTML untuk konten post.",
            code: "// Contoh Pengambilan dan Rendering\nconst post = await fetch('https://api.situs.com/wp-json/wp/v2/posts/1').then(r => r.json());\n\nreturn (\n  <article>\n    <h1>{post.title.rendered}</h1>\n    <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />\n  </article>\n);"
        }
    };

    const currentContent = contentData[activeSection] || {
        title: activeSection,
        text: `Detailed documentation for ${activeSection} is currently being drafted. Please check back soon for more information about this feature.`
    };

    return (
        <main className="min-h-screen py-20 px-4 sm:px-6 bg-white">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16">
                {/* Sidebar Nav */}
                <aside className="w-full md:w-72 space-y-10">
                    <Link href="/" className="inline-flex items-center text-primary font-bold hover:underline gap-2 mb-4 group">
                        <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Kembali ke Aplikasi
                    </Link>

                    {sections.map((section, idx) => (
                        <div key={idx} className="space-y-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{section.title}</h4>
                            <ul className="space-y-1">
                                {section.items.map((item, idy) => (
                                    <li key={idy}>
                                        <button
                                            onClick={() => setActiveSection(item)}
                                            className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${activeSection === item ? 'bg-primary/10 text-primary font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            {item}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </aside>

                {/* Content */}
                <article className="flex-1">
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <header className="mb-12 border-b border-gray-100 pb-10">
                            <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">{currentContent.title}</h1>
                            <p className="text-xl text-muted leading-relaxed">
                                {currentContent.text}
                            </p>
                        </header>

                        <section className="prose prose-slate max-w-none space-y-12">
                            {currentContent.code && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Contoh Implementasi</h2>
                                    <div className="bg-gray-900 rounded-2xl p-8 text-indigo-300 font-mono text-sm overflow-x-auto shadow-2xl border border-white/10">
                                        <pre>{currentContent.code}</pre>
                                    </div>
                                </div>
                            )}

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Keamanan & Praktik Terbaik</h2>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    Kami menggunakan **Base64 encoded Basic Authentication** untuk permintaan API WordPress. Pastikan situs WordPress Anda telah mengaktifkan &apos;Application Passwords&apos; (bawaan di WP 5.6+). Kredensial dapat dibaca dari .env.local di server atau disimpan lokal di browser jika Anda memakai form konfigurasi. Gambar diambil dari Pexels berdasarkan query kontekstual yang dibuat AI.
                                </p>
                            </div>

                            <div className="bg-amber-50 border-l-4 border-amber-500 p-8 rounded-r-2xl shadow-sm">
                                <h3 className="text-amber-900 font-bold mb-3 flex items-center gap-2 text-lg">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                                    Pemberitahuan Penting
                                </h3>
                                <p className="text-amber-800 leading-relaxed">
                                    Platform ini dirancang untuk pembuatan konten yang sah. Pastikan instansi WordPress Anda diamankan dengan HTTPS untuk melindungi header autentikasi Anda selama transit.
                                </p>
                            </div>
                        </section>
                    </div>
                </article>
            </div>
        </main>
    );
}
