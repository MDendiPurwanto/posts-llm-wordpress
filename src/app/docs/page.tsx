import Link from 'next/link';

const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'local-setup', label: 'Local setup' },
    { id: 'environment', label: 'Environment' },
    { id: 'wordpress', label: 'WordPress' },
    { id: 'application-password', label: 'App password' },
    { id: 'publish-flow', label: 'Publish flow' },
    { id: 'images', label: 'Images' },
    { id: 'errors', label: 'Troubleshooting' },
    { id: 'security', label: 'Security' },
    { id: 'deploy', label: 'Deploy' },
    { id: 'qa', label: 'QA checklist' },
];

function Section({
    id,
    title,
    children,
}: {
    id: string;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section id={id} className="scroll-mt-8 border-b border-gray-100 py-10 last:border-b-0">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">{title}</h2>
            <div className="space-y-4 text-base leading-7 text-gray-600">
                {children}
            </div>
        </section>
    );
}

function CodeBlock({ children }: { children: string }) {
    return (
        <pre className="overflow-x-auto rounded-lg border border-gray-800 bg-gray-950 p-5 text-sm leading-6 text-gray-100">
            <code>{children}</code>
        </pre>
    );
}

function Checklist({ items }: { items: string[] }) {
    return (
        <ul className="space-y-2">
            {items.map((item) => (
                <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-primary" />
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );
}

export default function DocumentationPage() {
    return (
        <main className="min-h-screen bg-white px-4 py-12 sm:px-6">
            <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[240px_1fr]">
                <aside className="lg:sticky lg:top-8 lg:h-fit">
                    <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Kembali ke Aplikasi
                    </Link>

                    <nav aria-label="Dokumentasi" className="space-y-1 border-l border-gray-200 pl-4">
                        {sections.map((section) => (
                            <a
                                key={section.id}
                                href={`#${section.id}`}
                                className="block rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-primary"
                            >
                                {section.label}
                            </a>
                        ))}
                    </nav>
                </aside>

                <article className="min-w-0">
                    <header className="border-b border-gray-100 pb-10">
                        <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-primary">Dokumentasi Teknis</p>
                        <h1 className="mb-5 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
                            WP Content Architect
                        </h1>
                        <p className="max-w-3xl text-lg leading-8 text-muted">
                            Panduan setup, konfigurasi, flow publish, dan troubleshooting untuk generator artikel WordPress berbasis OpenRouter dan Pexels.
                        </p>
                    </header>

                    <Section id="overview" title="Overview Sistem">
                        <p>
                            Aplikasi ini memakai Next.js App Router sebagai UI dan API gateway. Browser hanya mengirim prompt dan konfigurasi yang dibutuhkan, lalu server route menangani komunikasi ke OpenRouter, Pexels, dan WordPress REST API.
                        </p>
                        <Checklist
                            items={[
                                'OpenRouter dipakai untuk membuat judul, konten Markdown, dan placeholder gambar kontekstual.',
                                'Pexels dipakai untuk mencari foto berdasarkan query gambar dari AI, bukan gambar acak.',
                                'WordPress REST API dipakai untuk membuat draft, mengunggah media, memperbarui konten, dan memasang featured image.',
                            ]}
                        />
                    </Section>

                    <Section id="local-setup" title="Local Setup">
                        <p>Gunakan npm karena repository ini memiliki `package-lock.json`. Install dependency dari lockfile agar versi lokal konsisten.</p>
                        <CodeBlock>{`npm ci
cp .env.local.example .env.local
npm run dev`}</CodeBlock>
                        <p>Untuk validasi sebelum deploy atau review, jalankan check berikut.</p>
                        <CodeBlock>{`npm run lint
npx tsc --noEmit
npm run build`}</CodeBlock>
                    </Section>

                    <Section id="environment" title="Environment Variables">
                        <p>
                            Simpan secret di `.env.local` untuk development dan environment variable platform untuk production. Form konfigurasi di browser hanya dipakai sebagai override cepat.
                        </p>
                        <CodeBlock>{`OPENROUTER_API_KEY=sk-or-...
OPENROUTER_MODEL=google/gemini-2.0-flash-exp:free
OPENROUTER_SITE_URL=http://localhost:3000
OPENROUTER_APP_TITLE=WP Content Architect

WORDPRESS_BASE_URL=https://your-wordpress-site.com
WORDPRESS_USERNAME=your-wp-username
WORDPRESS_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx

PEXELS_API_KEY=your-pexels-api-key`}</CodeBlock>
                        <Checklist
                            items={[
                                'Jangan commit `.env.local` atau credential production.',
                                'Gunakan `WORDPRESS_BASE_URL` tanpa `/wp-json` karena aplikasi menambahkan path REST API sendiri.',
                                'Gunakan `OPENROUTER_SITE_URL` sesuai domain aplikasi saat production.',
                            ]}
                        />
                    </Section>

                    <Section id="wordpress" title="WordPress Requirements">
                        <Checklist
                            items={[
                                'REST API WordPress aktif dan bisa diakses dari server aplikasi.',
                                'User WordPress memiliki capability untuk `edit_posts`, `publish_posts` jika diperlukan, dan `upload_files`.',
                                'Application Password dibuat dari user yang sama dengan `WORDPRESS_USERNAME`.',
                                'Permalink tidak memakai mode Plain.',
                                'Folder `wp-content/uploads` bisa ditulis oleh WordPress.',
                            ]}
                        />
                        <p>Validasi credential WordPress dari terminal dengan command berikut.</p>
                        <CodeBlock>{`curl -u "USERNAME:APP_PASSWORD" \\
  "https://your-wordpress-site.com/wp-json/wp/v2/users/me?context=edit"`}</CodeBlock>
                    </Section>

                    <Section id="application-password" title="Tutorial Ambil Application Password">
                        <p>
                            Application Password harus dibuat dari user WordPress yang sama dengan nilai `WORDPRESS_USERNAME`. Jika password dibuat dari user lain, WordPress akan menolak auth atau menganggap username tidak dikenal.
                        </p>
                        <Checklist
                            items={[
                                'Login ke dashboard WordPress dengan user yang akan dipakai aplikasi.',
                                'Buka menu Users, lalu Profile. Jika Anda admin dan ingin memakai user lain, buka Users, pilih user tersebut, lalu Edit.',
                                'Catat nilai Username pada halaman profile. Nilai ini yang dipakai untuk `WORDPRESS_USERNAME`, bukan display name.',
                                'Scroll ke bagian Application Passwords.',
                                'Isi nama aplikasi, misalnya `WP Content Architect Local`, lalu klik Add New Application Password.',
                                'Copy password yang muncul. WordPress hanya menampilkan password ini sekali.',
                                'Masukkan username tadi ke `WORDPRESS_USERNAME` dan password baru ke `WORDPRESS_APP_PASSWORD`.',
                            ]}
                        />
                        <CodeBlock>{`WORDPRESS_USERNAME=username-dari-profile-wp
WORDPRESS_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx`}</CodeBlock>
                        <p>Verifikasi dari terminal sebelum menjalankan publish flow.</p>
                        <CodeBlock>{`curl -u "username-dari-profile-wp:xxxx xxxx xxxx xxxx xxxx xxxx" \\
  "https://your-wordpress-site.com/wp-json/wp/v2/users/me?context=edit"`}</CodeBlock>
                        <Checklist
                            items={[
                                'Jika response berisi data user, credential sudah benar.',
                                'Jika muncul `Nama pengguna tidak dikenal`, cek lagi nilai username atau coba alamat email user yang sama.',
                                'Jika muncul `Application passwords are not available`, cek HTTPS, WordPress version, atau plugin/security policy yang mematikan Application Passwords.',
                            ]}
                        />
                    </Section>

                    <Section id="publish-flow" title="Publish Flow">
                        <p>Flow publish dibuat bertahap supaya error WordPress bisa dilacak di step yang spesifik.</p>
                        <Checklist
                            items={[
                                'Generate artikel dari OpenRouter.',
                                'Preflight auth ke `/wp-json/wp/v2/users/me?context=edit`.',
                                'Create draft minimal di WordPress.',
                                'Search foto Pexels berdasarkan query gambar dari AI.',
                                'Upload featured image dan inline image ke WordPress Media Library.',
                                'Update konten draft dengan HTML final.',
                                'Set featured image setelah konten berhasil diupdate.',
                            ]}
                        />
                    </Section>

                    <Section id="images" title="Best Practice Gambar">
                        <p>
                            AI harus membuat placeholder gambar yang spesifik dalam format `[Gambar: english stock photo search query]`. Query berbahasa Inggris biasanya lebih akurat untuk provider stock photo.
                        </p>
                        <CodeBlock>{`[Gambar: teacher using laptop in classroom]
[Gambar: small business owner packing online orders]
[Gambar: healthy meal preparation in home kitchen]`}</CodeBlock>
                        <Checklist
                            items={[
                                'Gunakan 3 sampai 7 keyword visual yang konkret.',
                                'Hindari query terlalu umum seperti `business`, `technology`, atau `success`.',
                                'Hindari brand name, nama tokoh, dan klaim medis sensitif.',
                                'Jika Pexels tidak menemukan hasil, proses berhenti agar draft tidak memakai gambar yang tidak relevan.',
                            ]}
                        />
                    </Section>

                    <Section id="errors" title="Troubleshooting">
                        <Checklist
                            items={[
                                '`WordPress authentication failed` berarti username atau application password tidak cocok.',
                                '`WordPress minimal draft creation failed` biasanya terkait role user, REST API, plugin security, atau hook WordPress saat membuat post.',
                                '`WordPress content update failed` biasanya terkait filter konten, block editor, sanitizer, WAF, atau plugin yang memproses HTML.',
                                '`WordPress featured image update failed` biasanya terkait media capability, attachment ID, atau plugin media.',
                                '`Pexels image search failed` berarti API key, quota, atau koneksi ke Pexels bermasalah.',
                            ]}
                        />
                        <p>Jika WordPress menampilkan pesan fatal seperti &quot;Ada eror serius pada situs web Anda&quot;, cek `wp-content/debug.log` atau error log hosting karena crash terjadi di sisi WordPress.</p>
                    </Section>

                    <Section id="security" title="Security Best Practice">
                        <Checklist
                            items={[
                                'Pakai HTTPS untuk aplikasi dan WordPress agar Basic Auth tidak lewat koneksi plain HTTP.',
                                'Buat user WordPress khusus untuk integrasi, jangan gunakan akun administrator utama.',
                                'Batasi role user ke permission yang benar-benar diperlukan.',
                                'Rotasi Application Password dan API key jika pernah terekspos.',
                                'Jangan log credential, prompt sensitif, atau data user di server log.',
                                'Review draft AI sebelum publish live karena output AI bisa salah konteks.',
                            ]}
                        />
                    </Section>

                    <Section id="deploy" title="Deploy Best Practice">
                        <p>Deploy production harus memakai environment variable platform, bukan value dari browser localStorage.</p>
                        <Checklist
                            items={[
                                'Set semua env di Vercel, VPS, atau platform deploy yang dipakai.',
                                'Jalankan `npm run build` sebelum release.',
                                'Pastikan domain production dimasukkan ke `OPENROUTER_SITE_URL`.',
                                'Pastikan server production bisa mengakses WordPress, OpenRouter, dan Pexels.',
                                'Pantau response `/api/wordpress` setelah deploy pertama.',
                            ]}
                        />
                    </Section>

                    <Section id="qa" title="QA Checklist">
                        <Checklist
                            items={[
                                'Config section bisa membaca env server atau override dari form browser.',
                                'Tombol show or hide secret berfungsi untuk WP Application Password, OpenRouter, dan Pexels.',
                                'Prompt valid menghasilkan title dan preview konten.',
                                'Draft minimal berhasil dibuat di WordPress.',
                                'Gambar featured dan inline relevan dengan konteks artikel.',
                                'Error WordPress tampil dengan step yang jelas.',
                                'Draft akhir tetap berstatus draft, bukan publish otomatis.',
                            ]}
                        />
                    </Section>
                </article>
            </div>
        </main>
    );
}
