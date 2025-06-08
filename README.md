# AI-Powered WordPress Post Generator (Next.js & OpenRouter)


Aplikasi ini adalah sebuah generator postingan WordPress bertenaga AI yang dibangun menggunakan Next.js. Ia mengintegrasikan model bahasa besar (LLM) dari [OpenRouter](https://openrouter.ai/) untuk menghasilkan konten blog yang menarik, dan kemudian menggunakan WordPress REST API untuk membuat postingan dan mengelola media secara otomatis.

Aplikasi ini didesain untuk membantu blogger, pembuat konten, dan profesional pemasaran untuk mempercepat proses pembuatan konten dengan memanfaatkan kecerdasan buatan.

## Fitur-Fitur Utama

* **Generasi Konten Dinamis:** Hasilkan judul dan konten postingan blog lengkap dari *prompt* sederhana menggunakan LLM.
* **Dukungan Markdown ke HTML:** Konten yang dihasilkan AI dalam format Markdown secara otomatis dikonversi ke HTML yang kompatibel dengan editor WordPress.
* **Manajemen Gambar Otomatis:** Aplikasi secara otomatis mengunggah gambar *placeholder* (dari Picsum Photos) sebagai *featured image* dan gambar *inline* ke pustaka media WordPress, lalu menyisipkannya ke postingan.
* **Integrasi WordPress API:** Buat *draft* postingan baru langsung di WordPress melalui REST API.
* **Konfigurasi API Fleksibel:** Pengguna dapat memasukkan dan menyimpan kredensial API mereka sendiri (WordPress & OpenRouter) melalui antarmuka web aplikasi. Konfigurasi disimpan secara lokal di *browser*.
* **Kontrol Panjang Output:** Batasi panjang postingan yang dihasilkan LLM hingga perkiraan jumlah kata tertentu.
* **Antarmuka Pengguna yang Bersih:** Desain UI/UX yang intuitif dengan bagian konfigurasi yang dapat dibuka-tutup untuk pengalaman pengguna yang lebih baik.

## Demo



## Persyaratan Teknis

* Node.js **v18 LTS atau v20 LTS** (sangat penting untuk kompatibilitas dengan Next.js 15).
* Next.js v15.3.3+ (App Router).
* React v19.0.0+.
* Instalasi WordPress aktif dengan:
    * REST API diaktifkan (default).
    * **Application Passwords** diaktifkan (disarankan untuk otentikasi API).
    * Izin tulis untuk direktori `wp-content/uploads`.
    * **Permalinks** diatur selain "Plain" (misalnya "Post name").
* Akun [OpenRouter](https://openrouter.ai/) dengan API Key yang valid dan akses ke model LLM pilihan.

## Instalasi dan Setup (Lokal)

Ikuti langkah-langkah ini untuk menjalankan aplikasi di lingkungan pengembangan lokal Anda:

1.  **Clone Repositori:**
    ```bash
    git clone https://github.com/MDendiPurwanto/posts-llm-wordpress.git 
    cd posts-llm-wordpress
    ```

2.  **Instal Dependensi:**
    ```bash
    npm install
    # atau jika Anda menggunakan Yarn:
    # yarn install
    ```

3.  **Jalankan Aplikasi dalam Mode Pengembangan:**
    ```bash
    npm run dev
    # atau
    # yarn dev
    ```
    Aplikasi akan berjalan di `http://localhost:3000`.

## Konfigurasi API

Sebelum menggunakan generator, Anda perlu memasukkan kredensial API Anda. Aplikasi ini dirancang agar Anda dapat mengonfigurasi ini langsung dari antarmuka web.

1.  Buka aplikasi di *browser* Anda (`http://localhost:3000` di lokal).
2.  Pergi ke bagian **"0. API Configuration"** (klik panah bawah untuk membukanya).
3.  Isi kolom-kolom berikut:

    * **WordPress Base URL:** URL dasar WordPress Anda (misalnya `https://cms.dendipur.web.id`). **Jangan sertakan `/wp-json/wp/v2`**.
    * **WP Username:** *Username* akun WordPress Anda.
    * **WP Application Password:** Dapatkan dari **Users > Profile > Application Passwords** di dasbor WordPress Anda. Beri nama "Next.js AI Generator" dan salin sandi yang muncul. Pastikan pengguna memiliki izin `create_posts` dan `upload_files`.
    * **OpenRouter API Key:** Dapatkan dari dashboard [OpenRouter](https://openrouter.ai/keys).
    * **OpenRouter Model:** Nama model AI yang ingin Anda gunakan dari OpenRouter (misalnya `qwen/qwen3-235b-a22b:free` atau `google/gemini-flash-1.5`).

4.  Klik tombol **"Save Configuration"**. Konfigurasi ini akan disimpan di `localStorage` *browser* Anda.

## Penggunaan

1.  Setelah konfigurasi disimpan, pergi ke bagian **"1. Tell AI What to Write"**.
2.  Masukkan *prompt* atau topik untuk postingan blog yang Anda inginkan di *textarea*.
3.  Klik tombol **"Generate & Publish Draft"**.
4.  Aplikasi akan menampilkan status, pratinjau konten yang dihasilkan AI di bagian **"2. AI-Generated Content Preview"**, dan tautan ke *draft* postingan di WordPress jika berhasil.
## Kontribusi

Kami menyambut kontribusi! Jika Anda menemukan *bug* atau memiliki ide untuk peningkatan, silakan buka *issue* atau kirim *pull request*.

---