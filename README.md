# Kancil Pintar

Game belajar huruf dan berhitung untuk anak usia 4 tahun, bersama Kancil.
Berjalan di peramban HP dan bisa dipasang di layar utama seperti aplikasi.

## Isi game

- **Petualangan Kancil**: Kancil berjalan lewat 5 tempat untuk mencari timun. Tiap tempat ada satu soal berhitung atau mengenal huruf.
- **Tebak Gambar**: 8 soal per putaran, menebak huruf awal sebuah gambar atau menghitung jumlah benda.
- **Cari Pasangan**: kartu memori dengan 3 level (gambar-gambar, lalu gambar-huruf).
- Nama anak diketik sekali di awal, lalu Kancil menyebutnya.
- Semua soal dibacakan, jadi anak tidak perlu bisa membaca.

Nama anak dan jumlah bintang hanya disimpan di HP (localStorage). Tidak ada yang dikirim ke server mana pun.

## Struktur folder

```
index.html            kerangka halaman dan semua layar
css/style.css         tampilan
js/app.js             logika layar dan tiga permainan
js/data.js            isi pelajaran (kata, benda hitung, tempat petualangan)
js/art.js             gambar Kancil, bintang, ikon
js/audio.js           efek bunyi dan bacaan suara
js/utils.js           alat kecil
manifest.webmanifest  data aplikasi untuk dipasang di HP
sw.js                 supaya tetap bisa dibuka tanpa internet
assets/               ikon aplikasi
```

## Menjalankan di komputer

Game memakai ES modules, jadi **tidak bisa dibuka dengan klik dua kali** `index.html`. Jalankan server kecil:

```
python3 -m http.server 8000
```

Lalu buka `http://localhost:8000` di peramban.

## Menaruh di GitHub dan memasangnya di HP (GitHub Pages)

1. Buat repositori baru di github.com, misalnya `kancil-pintar` (Public, supaya Pages gratis).
2. Dari dalam folder ini, jalankan (ganti `USERNAME`):

   ```
   git init
   git add .
   git commit -m "Versi pertama Kancil Pintar"
   git branch -M main
   git remote add origin https://github.com/USERNAME/kancil-pintar.git
   git push -u origin main
   ```

   Tanpa git, bisa juga lewat tombol **Add file > Upload files** di halaman repositori, lalu seret semua isi folder ini.
3. Di repositori: **Settings > Pages > Build and deployment**. Pilih **Deploy from a branch**, branch `main`, folder `/ (root)`, lalu **Save**.
4. Tunggu sekitar satu menit. Alamatnya: `https://USERNAME.github.io/kancil-pintar/`
5. Buka alamat itu di Chrome HP, buka menu titik tiga, lalu pilih **Tambahkan ke layar utama** (atau **Instal aplikasi**). Di iPhone, buka di Safari, tekan tombol bagikan, lalu **Tambah ke Layar Utama**.

Setiap kali Anda `git push` perubahan baru, GitHub Pages memperbarui game secara otomatis.

## Mengembangkan

**Menambah kata atau tempat petualangan.** Buka `js/data.js` dan tambah baris di `WORDS`, `COUNT_ITEMS`, atau `STOPS`. Setiap kata butuh gambar (emoji), nama, dan huruf awal. Tebak Gambar dan Cari Pasangan akan memakainya otomatis.

**Menambah level kartu.** Di `js/app.js`, cari `const MEM`. Tiap baris adalah satu level: jumlah pasang, jumlah kolom, dan mode (`same` atau `letter`).

**Suara yang lebih natural.** Bacaan sekarang memakai suara bawaan HP, kualitasnya beda-beda. Cara meningkatkannya:

1. Siapkan rekaman (suara Anda, pengisi suara, atau hasil layanan text-to-speech yang punya suara bahasa Indonesia yang bagus) dan taruh di `assets/audio/`.
2. Daftarkan di `CLIPS` pada `js/audio.js`. Kuncinya adalah kalimat persis seperti yang diucapkan game, nilainya alamat berkas.
3. Kalimat yang belum direkam tetap dibacakan suara HP, jadi bisa dikerjakan bertahap.

Catatan: pujian di game disusun dari beberapa potongan (misalnya "Hebat! A untuk Apel"), jadi nanti sebaiknya `say()` diubah agar memutar rekaman per potongan. Nama anak yang bebas diketik tidak bisa direkam semua, jadi bagian itu tetap perlu suara HP atau layanan text-to-speech online.

Ide berikutnya:

- [ ] Rekaman suara untuk kalimat tetap
- [ ] Angka sampai 10 dan menulis angka
- [ ] Huruf kecil, mengenal bentuk dan warna
- [ ] Beberapa profil anak
- [ ] Ilustrasi sendiri pengganti emoji
- [ ] Font disimpan di repositori supaya tampilan sama persis saat offline
- [ ] Laporan belajar untuk orang tua

## Catatan teknis

- Font (Fredoka, Nunito) diambil dari Google Fonts. Tanpa internet, game memakai font cadangan, tampilannya sedikit berbeda tapi tetap jalan.
- Setelah menambah berkas baru, tambahkan juga ke daftar `CORE` di `sw.js` dan naikkan nomor `CACHE`.
- Bacaan memakai Web Speech API. Di sebagian HP suara bahasa Indonesia tidak terpasang. Cek di pengaturan HP: Bahasa dan Input, Text-to-speech.
