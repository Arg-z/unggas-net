---
judul: "Proyek unggas.net"
versi: v6.0
diperbarui: 28 Oktober 2026
---

# Proyek unggas.net: forum komunitas peternak unggas

Status per 28 Oktober 2026: **UI v6.0 "tangga aksen" live di https://unggas.net, dengan login sementara tanpa email**. Tanah hijau-kelabu pucat `#f4f7f1` dan kartu putih duduk langsung di atasnya; sidebar 252px menyatu dengan tanah dan desktop tidak memakai bilah atas. Hijau daun penuh hanya ada di penanda kecil: satu gaya tombol terisi, ikon nav aktif, angka notifikasi, dan tautan. Tint `accent-soft` memikul baris nav aktif, papan komunitas, kepala kartu auth, dan keadaan kosong. Sidebar hanya satu grup Forum dan satu pemilih komunitas, tanpa indeks komunitas; beranda tanpa tab, jumlah, urutan, dan rel kanan; auth tanpa kolom kedua; ponsel tanpa navigasi bawah. Pendaftaran dan masuk hanya username dan password; alur verifikasi, lupa password, dan reset lewat email dimatikan lewat `EMAIL_AKTIF=false`, jadi SES tidak dipanggil. Build `cLUIk599zawNyLC5EpoXP`, `tsc` bersih, 59 test hijau di 9 berkas, inspeksi produksi 0 FAIL 0 WARN di beranda dan masuk, thread 0 FAIL 1 WARN `ragged-row` yang diterima sebagai dua kartu bertumpuk. Backup pra-deploy `~/backup-unggas-20261028-061454`.

Dokumen ini adalah serah terima sekaligus satu-satunya dokumen proyek. Sejak 28 Oktober 2026 isi `docs/PROYEK.md`, `app/theme/DESIGN.md`, dan `app/README.md` digabung ke sini, lalu ketiga berkas itu dihapus supaya tidak ada dua versi yang saling bertentangan. Salinan `app/theme/DESIGN.md` dan `.bak` yang sempat tertinggal di salinan kerja dan di `/var/www/unggas-app/theme/` ikut dihapus pada hari yang sama, jadi tidak ada lagi rujukan desain di luar dokumen ini. `app/AGENTS.md` tetap ada karena dibuat ulang otomatis oleh `next dev`. Bagian "Syarat skill" dan "Jebakan" ditulis untuk agen berikutnya, bukan untuk manusia yang sudah hafal proyeknya.

Cara memakai dokumen ini:

- **Agen baru**: baca Status dan Apa ini, lalu lompat ke Syarat skill dan Jebakan sebelum menyentuh kode.
- **Tugas desain**: baca Arsitektur UI v6 dan Sistem desain.
- **Tugas operasional**: baca Operasional harian. Perintah deploy ada di sana dan sudah diperbarui.

## Daftar isi

1. Apa ini
2. Arsitektur singkat
3. Struktur komunitas dan aturan UI
4. Arsitektur UI v6 (28 Okt 2026)
5. Sistem desain
6. Mulai cepat dan aturan Next.js
7. Syarat skill untuk agen berikutnya
8. Jebakan yang sudah ditemui
9. Kredensial dan rahasia
10. Operasional harian
11. Email
12. Keputusan penting dan riwayat
13. Angka dan target
14. Rencana lanjutan

## Apa ini

unggas.net dulu situs edukasi satu arah (panduan puyuh), sekarang forum komunitas peternak unggas berbahasa Indonesia, dibangun dari nol dengan Next.js (bukan template forum software). Strukturnya ala subreddit: satu akun untuk semua komunitas (Puyuh, Lobby, kelak Ayam, Bebek dan Entok, Jual-Beli), sementara tag wilayah menempel pada diskusi sebagai penanda lokasi yang bisa diklik. Kebalikan dari grup Facebook yang terfragmentasi per daerah.

## Arsitektur singkat

```
Pengunjung -> nginx (unggas.net, HTTPS certbot)
              |-- /            -> proxy 127.0.0.1:3000 -> Next.js (PM2 "unggas-app")
              |-- /panduan*    -> 301 ke / (arsip dihapus 26 Okt)
              `-- ACME renewal -> /var/www/html
Database  -> PostgreSQL 16 di Docker container "ungas-postgres" (127.0.0.1:5433)
Backup    -> cron 03:15 harian -> S3 unggas-backups-385207569778 (lifecycle 30 hari)
```

- Server: AWS EC2 t8i.small, ap-southeast-1, Ubuntu 26.04 (`ssh aws`)
- Stack: Next.js 16.4.3 (App Router, TypeScript, Tailwind v4), Prisma 6, PostgreSQL 16, PM2
- Repo GitHub: `Arg-z/unggas-net` (private, https://github.com/Arg-z/unggas-net). Salinan kerja di server: `~/unggas-net` (`app/` + `proyek unggas.md` + `app/.taste-skill/direction.json`), disinkron dari produksi 28 Okt. Setiap perubahan produksi: commit + push dari situ.
- Aplikasi di server: `/var/www/unggas-app`, bukan repo git. Pembanding sebelum deploy adalah salinan kerja `~/unggas-net`. Repo lama `~/unggas-forum` di macbook masih v3.1 (plus docs/ops/theme/archive dan riwayat commit lama) dan belum direkonsiliasi; jangan dijadikan dasar deploy sampai disatukan.
- Data desain: `src/app/globals.css` blok `@theme` adalah sumber kebenaran visual. Token dan aturan lengkap ada di bagian Sistem desain dokumen ini. Lembar arah v6 `accent-ladder` (seed 1252606000) tersimpan di `.taste-skill/direction.json`.
- Pernah terjadi drift: 26 Okt kode di server lebih baru daripada repo karena diedit langsung di server. Sudah diselamatkan lewat commit `c87850e`. Selalu diff dulu sebelum deploy.

## Struktur komunitas dan aturan UI

- Topik aktif: Puyuh, Lobby. Sejak 28 Okt tidak lagi tampil di bilah samping sebagai indeks; pemilih komunitas ada di panel atas sidebar (desktop), di baris judul beranda (ponsel), dan di lembar menu ponsel.
- Topik disiapkan, tersembunyi lewat `is_restricted`: Ayam, Bebek dan Entok, Jual-Beli. Preview "Segera Dibuka" sudah dihapus dari beranda (keputusan pemilik 27 Okt). Buka penuh dengan `UPDATE tags SET is_restricted=false WHERE slug='ayam';` saat anggotanya siap.
- Wilayah, 10 tag: Sumatera Utara, Sumatera Selatan, Jawa Barat, Jawa Tengah, Jawa Timur, Bali dan Nusa Tenggara, Kalimantan, Sulawesi, Maluku dan Papua, Luar Negeri.
- Keputusan UI 27 Okt yang masih berlaku: jangan tampilkan daftar atau panel filter wilayah di beranda maupun di bilah samping. Wilayah dipilih opsional saat membuat diskusi di `/baru` dan tampil sebagai label kecil berikon pin pada baris diskusi, tetap bisa diklik ke `/?tag=<slug>`.

## Arsitektur UI v6 (28 Okt 2026)

### Alasan penggantian

v5.2 sudah rapi, tetapi masih terbaca sebagai kertas berbingkai di atas meja: chrome dan inset memisahkan navigasi dari isi, tombol near-black membuat semua aksi seragam, dan warna merek hampir hilang. Pemilik memilih arah `accent-ladder` dari `draw.mjs --app --kind community --keep palette,type` dengan seed 1252606000, lalu meminta seluruh UI dirombak. Palet daun, Fraunces, Plus Jakarta Sans, dan mode terang tetap. Rute, nama field, dan Server Action tidak berubah.

### Aturan arah

Satu tanah hijau-kelabu `#f4f7f1` dan kartu putih yang duduk langsung di atasnya. Tidak ada bilah atas desktop dan tidak ada lembar inset. Hijau daun `#2e7d32` hanya muncul di penanda kecil: satu gaya tombol terisi, ikon nav aktif, angka notifikasi, garis fokus, dan tautan. Tint `accent-soft` memikul bidang besar: baris nav aktif, papan komunitas, kepala kartu auth, keadaan kosong, dan hover tombol bergaris. Baris nav aktif tidak memakai bilah kiri atau garis bawah tambahan.

Bentuk yang dilarang: bayangan, gradien, glass, ikon di dalam kotak berwarna, hijau penuh sebagai latar besar atau teks prosa, dan dot yang tidak menandai state nyata.

### Shell

Sidebar 252px sticky setinggi layar mulai 1024px, menyatu dengan tanah dan dipisah satu garis rambut. Isinya: wordmark di baris 56px, pemilih komunitas di panel `accent-soft`, kotak cari, satu grup nav Forum (Semua diskusi, Notifikasi, Tulis diskusi, Panel admin), lalu kartu akun atau KartuTamu di kaki. Baris nav 32px; yang aktif memakai pil `accent-soft` dengan teks `accent-ink` dan ikon `accent`.

Ponsel memakai bilah 48px berisi wordmark, lonceng dengan angka, tombol plus 44px, dan tombol menu 44px. Menu membuka lembar penuh berisi pencarian, pemilih komunitas, nav 44px, dan kartu akun/tamu. Lembar dirender lewat portal ke `body` karena bilah atas ber-`backdrop-blur` menjadi acuan posisi untuk elemen `fixed`; tanpa portal, lembar hanya setinggi bilah. Latar halaman dikunci selama lembar terbuka. Tidak ada navigasi bawah, keputusan pemilik.

### Papan komunitas

Diskusi tersemat dibaca sebagai papan pengumuman, bukan baris tabel. Papan hanya muncul di halaman pertama tampilan utama, memakai panel `accent-soft` bergaris `accent-track`, label `.label-aksen` dengan ikon sematkan, judul Fraunces 18px ponsel dan 25px desktop, cuplikan dua baris, penulis, waktu, dan tautan "Baca pengumuman". Saat pencarian atau filter aktif, sematan kembali ke daftar supaya hasil tidak terbelah.

### Halaman

Beranda memakai pola feed. Judul 26px ponsel dan 28px desktop dengan satu kalimat pengantar 13px, pemilih komunitas dan pencarian di ponsel. Papan komunitas, lalu satu kartu putih berisi label bagian dan baris diskusi tanpa header kolom: judul Fraunces 18/20px maksimal dua baris, cuplikan dua baris 13.8/14.5px, byline avatar + nama + waktu + jumlah balasan + tag. Nol tetap dicetak "0 balasan". Seluruh baris bisa diklik lewat overlay judul, dan `TagPill` duduk di z-10 supaya tag tetap bisa diklik. Hover memberi tint `accent-soft/35`. Tidak ada tab, jumlah, urutan, atau rel kanan.

Thread memakai pola detail di atas kartu. Kartu pembuka putih radius 16 berisi tag dan satu tombol Balas hijau di baris pertama, judul 26px ponsel dan 30px desktop dengan `text-balance`, meta 13px, lalu prosa 68ch. Balasan adalah satu kartu putih dengan garis rambut per balasan. Mulai 1280px ada rel kanan 280px berisi Tentang diskusi (komunitas, dibuka, balasan, penulis) dan diskusi lain di komunitas yang sama. Tautan `#post-N` tetap bisa dibagikan.

Notifikasi memakai lebar kanvas penuh dan satu kartu putih bergaris dengan kepala "Balasan terbaru" + hitungan. Baris berisi byline "nama membalas · waktu", judul diskusi Fraunces 16.5px, "Balasan #N", dan chip "Baru"; baris belum dibaca bertint `accent-soft/50`. Admin memakai lebar kanvas penuh, tab pil 36px yang aktif bertint, lalu satu kartu putih berisi tabel. Halaman tulis memakai grid form + rel panduan 280px mulai 1280px; panduan berisi hal yang membuat pertanyaan mudah dijawab. Halaman masuk, daftar, lupa password, dan verifikasi memakai satu kartu 440px di tengah: kepala `accent-soft` memikul judul dan sub, badan putih memegang form. Keadaan kosong memakai bidang `accent-soft/50` bergaris `accent-track`, judul serif, satu kalimat, dan satu aksi. 404 menampilkan lima diskusi terbaru sebagai jalan keluar.

### Berkas baru dan berubah

Baru di v6: `components/KartuTamu.tsx`, `components/MenuPonsel.tsx`.

Sudah ada sejak v5: `components/AuthShell.tsx`, `components/TombolTulis.tsx`, `components/AksiTamu.tsx`.

Berubah di v6: `app/layout.tsx`, `app/page.tsx`, `app/t/[id]/page.tsx`, `app/notifikasi/page.tsx`, `app/baru/page.tsx`, `app/baru/BuatDiskusiForm.tsx`, `app/BalasForm.tsx`, `app/admin/page.tsx`, `app/not-found.tsx`, semua halaman auth dan verifikasi, `app/globals.css`, `components/BilahCari.tsx`, `NavSamping.tsx`, `NotifikasiBadge.tsx`, `PemilihKomunitas.tsx`, `TagPill.tsx`, `Wordmark.tsx`, `theme/tokens.json`, `theme/tokens.tailwind.css`. `NavBawah.tsx` sudah dihapus di v5.2.

### Verifikasi yang sudah dijalankan

- `npx tsc --noEmit` keluar 0.
- `npm run lint` keluar 0 error; dua warning lama (`LIMIT_DISKUSI_BARU` dan `_user`) tetap ada.
- Build produksi `cLUIk599zawNyLC5EpoXP`. CSS hasil build memuat `#f4f7f1` dan `btn-primary` sebelum restart.
- `npx vitest run` di server: 59 test hijau di 9 berkas.
- `inspect.mjs --app` produksi: beranda 0 FAIL 0 WARN; masuk 0 FAIL 0 WARN; thread 0 FAIL 1 WARN `ragged-row` (dua kartu utama bertumpuk dengan tinggi berbeda, bukan kartu sebaris) dengan `--allow headline-lines` untuk judul buatan pengguna yang tiga baris di 390px.
- Halaman berlogin (notifikasi, tulis, admin, thread) diperiksa lewat sesi sementara untuk `arga`, lalu sesi dihapus. Tidak ada konten pengguna yang diubah.
- Produksi: `/`, `/masuk`, `/daftar`, `/lupa-password`, `/t/20`, `/robots.txt` 200; `/t/999999` 404; tamu dialihkan 307 dari `/notifikasi` dan `/admin`. HTML produksi memuat `w-[252px]`, `MenuPonsel`, dan chunk CSS `3l5weu7kn5l2f.css`.
- Tangkapan layar lokal ada di `.taste-skill/v6/`; tangkapan produksi ada di `.taste-skill/live-v6/`, `live-v6-thread/`, dan `live-v6-masuk/`.

### Yang belum selesai

- Verifikasi email, lupa password, dan reset password sengaja mati sejak 28 Okt lewat `EMAIL_AKTIF=false`.
- Akun yang dibuat selama mode mati memakai email placeholder dan belum punya alamat email asli.
- Dua warning ESLint lama: `LIMIT_DISKUSI_BARU` di `app/actions/forum.ts` tidak terpakai, dan parameter `_user` di `getTags` (`lib/forum.ts`). Keduanya bukan error.
- Judul thread buatan pengguna bisa tiga baris atau lebih di 390px. Aturan dua baris tidak mungkin dipaksakan pada judul bebas, jadi inspeksi thread memakai `--allow headline-lines`.
- WARN `ragged-row` pada thread berasal dari dua kartu utama yang bertumpuk; kartu kanan memang kolom terpisah, bukan pasangan sebaris.
- Belum ada foto asli di forum; seluruh gambar adalah ikon SVG di dalam kode, sesuai sifat aplikasi.

## Sistem desain

Bagian ini adalah pengganti `app/theme/DESIGN.md` (versi terakhirnya v6.0). Sejak 28 Oktober 2026 seluruh salinan `DESIGN.md` dan `.bak`-nya dihapus dari repo, salinan kerja, dan `/var/www/unggas-app/theme/`; `README.md` juga tidak dihidupkan kembali. Dokumen ini satu-satunya catatan desain. Sumber eksekusi tetap `src/app/globals.css` blok `@theme`; kalau ada selisih, CSS yang menang dan bagian ini harus diperbarui.

### Token

```yaml
version: v6.0
name: Unggas.net
description: Forum komunitas peternak unggas berbahasa Indonesia. Arah "tangga aksen": tanah hijau-kelabu pucat, kartu putih, dan hijau daun penuh hanya pada penanda kecil. Judul dan prosa Fraunces, UI Plus Jakarta Sans, mode terang saja.
colors:
  # Permukaan
  ground: "#f4f7f1"
  surface: "#ffffff"
  raised: "#fbfdfa"
  wash: "#f0f6ee"
  sunken: "#e7efe4"
  # Garis
  border: "#dde6d9"
  rule: "#edf2ea"
  control: "#7d8d79"
  # Teks
  ink: "#1b2621"
  ink-strong: "#0f1714"
  ink-soft: "#47524c"
  ink-faint: "#5f6672"
  # Tangga aksen
  accent: "#2e7d32"
  accent-deep: "#236327"
  accent-ink: "#1b5e20"
  accent-soft: "#e8f5e9"
  accent-track: "#c8e6c9"
  # Status
  warn-soft: "#fef3c7"
  warn-line: "#fde68a"
  warn-ink: "#92400e"
  danger: "#bf000f"
  danger-soft: "#fdecec"
  danger-line: "#f4c7c9"
  # Avatar
  av-hijau: "#e8f5e9"
  av-hijau-ink: "#1b5e20"
  av-hijau-line: "#9ac59e"
  av-amber: "#fef3c7"
  av-amber-ink: "#92400e"
  av-amber-line: "#e8b93a"
  av-biru: "#e0f2fe"
  av-biru-ink: "#075985"
  av-biru-line: "#7cc7ee"
  av-oranye: "#ffedd5"
  av-oranye-ink: "#9a3412"
  av-oranye-line: "#f5b473"
  av-teal: "#ccfbf1"
  av-teal-ink: "#115e59"
  av-teal-line: "#42d3bb"
  av-rose: "#ffe4e6"
  av-rose-ink: "#9f1239"
  av-rose-line: "#f9a6b0"
typography:
  display:
    fontFamily: "Fraunces (next/font, variable opsz; self-hosted)"
    peran: "h1 halaman, judul papan & thread, wordmark, prosa"
    bobot: 600
    tracking: "-0.02em"
  prose:
    fontFamily: "Fraunces, kelas .prosa"
    peran: "isi post pembuka dan balasan"
    ukuran: "17.5px / 1.72"
  body:
    fontFamily: "Plus Jakarta Sans (next/font, self-hosted; Tokotype)"
    peran: "seluruh UI: daftar, meta, tombol, form, sidebar"
  skala:
    h1-beranda: "26px mobile / 28px desktop, display 600"
    h1-thread: "26px mobile / 30px desktop, display 600, text-balance"
    h1-sekunder: "26px, display 600 (notifikasi, tulis, admin, auth)"
    judul-papan: "18px mobile / 25px desktop, display 600"
    judul-baris: "18px mobile / 20px desktop, display 600, line-clamp 2"
    cuplikan-baris: "13.8px mobile / 14.5px desktop, leading 1.65, ink-soft, line-clamp 2"
    judul-notifikasi: "16.5px, display 600, line-clamp 2"
    isi-post: "17.5px / 1.72 serif (.prosa)"
    meta: "13px ink-faint"
    meta-baris: "12.5px ink-faint, nama penulis ink-soft 500"
    label-form: "13px, 600, ink-strong"
rounded:
  card: 16px
  panel: 14px
  control: 8px
  chip: 4px
spacing:
  sidebar: "252px"
  bilah-ponsel: "48px"
  wordmark-row: "56px"
  konten: "max 1120px; padding 16/24/40px"
  konten-thread: "grid 1fr + 280px mulai 1280px"
  konten-tulis: "grid 1fr + 280px mulai 1280px"
  konten-auth: "max 440px, satu kolom di tengah"
  konten-notifikasi: "lebar penuh kanvas (max 1120px)"
  konten-admin: "lebar penuh kanvas (max 1120px)"
```

### Token dan kelas di `globals.css`

- Permukaan: `ground` `#f4f7f1`, `surface` `#ffffff`, `raised` `#fbfdfa`, `wash` `#f0f6ee`, `sunken` `#e7efe4`
- Garis: `border` `#dde6d9`, `rule` `#edf2ea`, `control` `#7d8d79`
- Teks: `ink` `#1b2621`, `ink-strong` `#0f1714`, `ink-soft` `#47524c`, `ink-faint` `#5f6672`
- Aksen: `accent` `#2e7d32`, `accent-deep` `#236327`, `accent-ink` `#1b5e20`, `accent-soft` `#e8f5e9`, `accent-track` `#c8e6c9`
- Status: `warn-soft/line/ink`, `danger`, `danger-soft`, `danger-line`
- Avatar: 6 triple `av-*` (hijau, amber, biru, oranye, teal, rose)

Kelas: `.btn` (36px, radius 8) dengan varian `-primary` (hijau daun), `-outline`, `-quiet`, `-sm` (30px), `-lg` (44px); `.panel`, `.well`, `.panel-accent` (radius 14); `.input` 40px; `.label`, `.hint`, `.label-aksen`, `.alert-error`, `.alert-ok`; di luar layer `.prosa` (Fraunces 17.5px/1.72), `.tabular`, `.link`, `.scroll-x`, `.lewati-nav`.

Kelas lama tetap dihapus. Jangan dipakai lagi: `bg-canvas`, `border-line`, `border-line-soft`, `border-line-strong`, `bg-leaf`, `leaf-tint*`, `leaf-ink`, `text-leaf`, `bg-paper`, `bg-panel`, `bg-unread`, `danger-tint`, `.card`, `.btn-secondary`, `.btn-tint`, `.btn-ghost`, `.link-hijau`, `.no-scrollbar`, `divide-line-soft`.

### Gambaran

Unggas.net UI v6 "tangga aksen". Satu tanah hijau-kelabu pucat (`ground`) dan kartu putih yang duduk langsung di atasnya. Tidak ada bilah atas di desktop dan tidak ada lembar berbingkai: sidebar menyatu dengan tanah, dipisah satu garis rambut. Hijau daun hanya muncul di penanda kecil, yaitu satu gaya tombol terisi, ikon nav aktif, angka notifikasi, garis fokus, dan tautan. Bidang besar memakai tint hijau 50–200: baris nav aktif, papan komunitas, kepala form auth, keadaan kosong, dan hover tombol bergaris.

Ini pengganti arah framed-sheet v5. Bingkai 8px, kertas inset, tombol near-black, dan panel auth `wash` tidak dipakai lagi.

Keputusan pemilik yang dipegang versi ini: sidebar hanya satu grup Forum dan satu pemilih komunitas, tanpa indeks komunitas; beranda tanpa tab status, tanpa jumlah diskusi, tanpa pemilih urutan, dan tanpa rel kanan; halaman auth tanpa kolom kedua; tidak ada navigasi bawah di ponsel; topik terbatas tetap tersembunyi; nol tetap dicetak sebagai 0; wilayah bukan panel filter.

### Warna: pasangan terukur

- putih di atas `accent` 5.0:1 (label `.btn-primary`)
- putih di atas `ink-strong` 17.8:1 (teks terang di blok gelap)
- `ink-faint` di `ground` 5.1:1; di `surface` 5.8:1 (meta, waktu, label kolom)
- `ink-soft` di `ground` 7.4:1 (teks sekunder)
- `accent-ink` di `accent-soft` 6.9:1 (nav aktif, tag topik, label bagian)
- `control` di putih 3.52:1 (batas kontrol; WCAG 1.4.11 non-teks)
- `warn-ink` di `warn-soft` 6.37:1 (badge Disematkan)

Peran permukaan: `ground` tanah halaman; `surface` kartu dan kontrol; `wash` panel tonal netral; `accent-soft` bidang tint yang memikul judul atau keadaan kosong; `sunken` hover sekunder dan kerangka pemuatan; `raised` blok tenang di dalam kartu. Jangan menambah warna tanpa mengukur dan mencatatnya di sini.

### Tipografi

- Fraunces untuk identitas dan bacaan: h1, judul thread, judul papan, judul baris diskusi dan notifikasi, wordmark, isi post (`.prosa`, 17.5px/1.72), copy 404. Bobot 600, tracking rapat.
- Plus Jakarta Sans untuk seluruh UI: cuplikan, meta, tombol, form, sidebar. Angka memakai `.tabular`.
- Baris diskusi dibaca seperti feed: judul serif 18/20px maksimal dua baris, cuplikan dua baris, lalu byline penulis · waktu · balasan · tag. Tidak ada angka balasan rata kanan dan tidak ada header kolom.
- Judul thread memakai `text-balance` supaya dua baris desktop seimbang. Judul buatan pengguna boleh tiga baris di ponsel; aturan dua baris hanya berlaku untuk judul tetap.
- Baris prosa dibatasi `max-w-[68ch]`; kepala thread dan balasan duduk di kartu putih, bukan di atas kertas telanjang.
- Input 16px untuk mencegah zoom iOS. Label 13px/600, hint 12px.
- Tidak ada uppercase bertracking pada header tabel atau label sidebar.

### Komponen inti

- `.btn` 36px, radius 8, 14px/600. `.btn-sm` 30px, `.btn-lg` 44px. `.btn-primary` hijau daun penuh dengan teks putih, hover `accent-deep`. `.btn-outline` putih + `control`, hover `accent-soft` + `accent-track`. `.btn-quiet` transparan, hover tint. Satu aksi terisi hijau per pandangan.
- `TombolTulis`: di ponsel tombol plus 44x44 hijau di bilah atas; label "Tulis diskusi" muncul mulai 768px. Di `/baru` tombol ini diam.
- `.panel` putih, 1px `border`, radius 14. `.well` `wash`, 1px, radius 14. `.panel-accent` `accent-soft` + `accent-track`, radius 14. Kartu halaman memakai `rounded-2xl` (16px). Tanpa bayangan; kedalaman dari langkah warna dan garis.
- Baris nav: 32px desktop / 44px di lembar ponsel, radius 8. Aktif = `accent-soft` + `accent-ink` semibold + ikon `accent`; tidak ada bilah kiri atau garis bawah tambahan.
- Keadaan kosong: bidang `accent-soft/50` bergaris `accent-track`, judul serif di tengah, satu kalimat penjelas, satu aksi bergaris atau terisi.
- Form auth: kartu putih radius 16 dengan kepala `accent-soft` (judul + sub) dan badan putih. Input tetap putih sehingga batas kontrol terbaca.
- `.input` 40px, radius 8, batas `control`, fokus `accent` + ring 3px 15%.
- `.label-aksen` 12px/600 `accent-ink` untuk penanda papan dan label kecil.
- TagPill topik: tint aksen, radius 4. Wilayah: putih + pin, pin informatif.
- Avatar inisial, 6 tint deterministik; border 1px agar tepi terbaca di putih.
- `.link` target sentuh 24px, underline saat hover.
- Ikon satu ketebalan 1.5px + `non-scaling-stroke`. Lonceng 19px di target 40px dengan lencana 15px bercincin `ground`; jangan menutupi ikonnya.
- Fokus global 2px `accent` offset 2. `.lewati-nav` untuk WCAG 2.4.1.

### Tata letak

- Bidang terbuka: sidebar 252px sticky setinggi layar (>=1024px) dengan `border-r`, tanpa bilah atas desktop. Di bawah 1024px sidebar hilang dan bilah ponsel 48px memegang navigasi.
- Kanvas: max 1120px, padding 16/24/40px, atas 24px (36px di desktop), bawah 40px + safe area.
- Sidebar: wordmark di baris 56px, pemilih komunitas di panel `accent-soft` radius 12, kotak cari, nav 32px, lalu kartu pengguna bergaris atau KartuTamu di kaki sidebar.
- Bilah ponsel 48px: wordmark, lonceng + angka, tombol plus 44px, tombol menu 44px. Menu membuka lembar penuh lewat portal ke `body`, berisi pencarian, pemilih komunitas, nav 44px, dan kartu pengguna/tamu. Latar halaman dikunci selama lembar terbuka.
- Beranda: judul dan satu kalimat pengantar, pemilih komunitas dan kotak cari di ponsel, papan komunitas untuk sematan, lalu satu kartu putih berisi label bagian dan daftar diskusi ala feed. Tanpa tab, jumlah, urutan, header kolom, angka rata kanan, atau rel kanan.
- Thread: grid `1fr + 280px` mulai 1280px. Kartu pembuka putih berisi tag + tombol Balas di baris pertama, judul, meta, lalu prosa 68ch. Balasan adalah satu kartu putih dengan garis rambut per balasan; kolom kanan berisi fakta diskusi (termasuk penulis) dan diskusi lain di komunitas yang sama.
- Notifikasi: lebar kanvas penuh, satu kartu putih bergaris dengan kepala "Balasan terbaru" + hitungan. Baris belum dibaca bertint `accent-soft/50`.
- Tulis: grid `1fr + 280px` mulai 1280px; form di `.panel`, panduan di rel kanan. Tombol Tulis di bilah atas disembunyikan di halaman ini.
- Admin: lebar kanvas penuh, tab pil 36px (`accent-soft` saat aktif), lalu satu kartu putih berisi tabel. Tindakan per baris.
- Auth: satu kartu 440px di tengah, kepala `accent-soft`, badan putih. Shell menyembunyikan tautan Masuk/Daftar saat sudah berada di halaman auth.
- 404: dua kolom, salinan dan aksi di kiri, kartu diskusi terbaru di kanan.
- Wilayah tidak pernah menjadi panel filter di beranda (keputusan pemilik).

### Do's and Don'ts

- Lakukan: tambah token di `@theme` sebelum memakai warna/kelas baru.
- Lakukan: jaga target sentuh >=44px untuk aksi utama, >=36px untuk kontrol padat.
- Lakukan: satu tombol primary hijau per pandangan.
- Lakukan: pakai `control` untuk batas kontrol, `border` untuk tepi panel, `rule` untuk pemisah baris.
- Lakukan: biarkan tint yang memikul bidang; hijau penuh tetap untuk penanda.
- Jangan: memakai shadow, gradien, glass, atau emoji sebagai ikon.
- Jangan: memakai `gray-*` Tailwind, pakai tangga `ink*`.
- Jangan: memakai hijau penuh untuk latar besar atau teks prosa panjang.
- Jangan: menambah bilah kiri pada baris nav aktif di atas tint.
- Jangan: menambah dot yang tidak menandai state nyata.
- Jangan: mengganti Fraunces/PJS tanpa alasan brand.

### Riwayat desain

- v6.0 (28 Okt 2026): arah "tangga aksen" menggantikan framed-sheet. Tanah `#f4f7f1`, kartu putih tanpa lembar induk, sidebar 252px menyatu dengan tanah, tanpa bilah atas desktop. Tombol primary kembali hijau daun penuh; nav aktif, papan komunitas, kepala auth, dan keadaan kosong memakai tint `accent-soft`. Radius panel 14, kartu 16. Beranda, thread, notifikasi, tulis, admin, auth, 404, dan menu ponsel dibangun ulang. Menu ponsel pindah ke portal `body`; lonceng ponsel diperbesar ke target 40px; judul thread `text-balance`; judul papan berhenti di dua baris pada 390px. Rute, field form, Server Action, palet daun, font, dan keputusan pemilik tidak berubah.
- v5.2 (28 Okt 2026): nav bawah ponsel dihapus atas permintaan pemilik. Kertas ponsel memakai tinggi penuh tanpa bilah tetap; footer turun ke tepi dengan aman untuk home indicator. Aksi Tulis pindah ke bilah atas sebagai tombol plus 44x44 near-black, label penuh muncul mulai 768px. Wordmark, lonceng, dan keluar tetap menjadi navigasi utama ponsel; komunitas lewat pemilih di baris judul beranda.
- v5.1 (28 Okt 2026): beranda dibaca seperti feed editorial, acuan Medium. Header kolom dan angka balasan rata kanan dibuang; judul diskusi memakai Fraunces 18/20px dengan cuplikan dua baris dan byline penulis · waktu · balasan · tag. Papan komunitas naik ke 22/25px. Notifikasi memakai judul serif dan chip "Baru". Keadaan kosong beranda, notifikasi, dan balasan thread menjadi blok `wash`; form auth duduk di panel `wash` tanpa garis.
- v5.0 (27 Okt 2026): framed-sheet. Bingkai + kertas inset, sidebar satu grup Forum, pemilih komunitas di bilah atas, papan komunitas, thread tanpa kartu dengan rel fakta + Penulis, auth satu kolom, form tulis dengan rel panduan, notifikasi/admin/404 diselaraskan. Token `ground/wash/sunken` menggantikan `canvas/panel/paper`; tombol primary near-black.
- v3.2 (27 Okt 2026): audit header, h1 sekunder, target sentuh link, badge sematkan tunggal, radius, padding auth, title ganda.
- v3.1 (27 Okt 2026): sistem tombol `.btn`, token `@theme`, Fraunces + PJS.

## Mulai cepat dan aturan Next.js

Proyek ini Next.js **16.4.3**. Versi ini punya perubahan yang memutus cara lama: API, konvensi, dan struktur berkas bisa berbeda dari yang dihafal model. Sebelum menulis kode, baca panduan yang relevan di `node_modules/next/dist/docs/` dan perhatikan catatan deprecation.

`app/AGENTS.md` berisi peringatan yang sama. Blok itu ditulis ulang otomatis oleh `next dev`; jangan menghapusnya dari diff, cukup ikutkan di commit supaya working tree bersih.

Perintah yang tersedia di `app/`:

```bash
npm run dev        # next dev
npm run build      # next build
npm run start      # next start
npm run lint       # eslint
npm run test       # vitest run
```

Prasyarat lokal: Node yang cocok dengan Next 16, PostgreSQL 16 lewat tunnel SSH port 5433 (lihat Operasional harian), dan variabel `.env` yang tidak ada di repo. Build produksi selalu dijalankan di server dengan cap memori 1280MB.

## Syarat skill untuk agen berikutnya

Tiga skill dipakai di proyek ini. Semuanya skill tingkat pengguna di `~/.claude/skills/<nama>/`. Kalau agen berikutnya jalan di mesin lain, salin ketiga folder itu dulu. Aturan pemuatan skill ada di `~/.claude/AGENTS.md` dan hook `skill-router`: skill wajib dimuat sebelum baris kode atau copy pertama, tanpa bertanya dan tanpa mengumumkan.

### Skill dan kapan dipakai

| Skill | Kapan | Yang dipakai |
|---|---|---|
| `design-taste-frontend` | Setiap menyentuh tampilan: halaman, komponen, layout, review visual | `references/app-screens.md` (baca utuh dulu), `scripts/draw.mjs --app`, `scripts/inspect.mjs --app`, `scripts/lint.mjs --app` |
| `ui-ux-pro-max` | Tugas yang sama, untuk token, tipografi, kontras, aturan UX | `scripts/search.py --design-system` |
| `anti-ai-slop` | Setiap kali menulis atau mengubah prosa di deliverable: dokumen ini, copy halaman, pesan error | `scripts/sanitize.py --fix`, `scripts/slopcheck.py` |

Proyek ini adalah aplikasi, bukan landing page. Jadi yang berlaku adalah jalur app screen: `draw.mjs --app --kind community`, bukan `draw.mjs --sector`.

### Perintah persis

Cetak ulang lembar arah (jangan menggambar ulang tanpa alasan yang bisa disebutkan):

```bash
node ~/.claude/skills/design-taste-frontend/scripts/draw.mjs --show
```

Ukur tampilan. Chrome wajib ada di jalur ini, kalau tidak inspector keluar dengan `Chrome exited early`:

```bash
export CHROME_PATH=/home/ubuntu/.local/bin/chrome-nosandbox
cd /var/www/unggas-app
node ~/.claude/skills/design-taste-frontend/scripts/inspect.mjs \
  http://127.0.0.1:3100/ --app --out .taste-skill/after-home --widths 1440,768,390
```

Token desain diambil dengan perintah berikut, dan jangan pernah menambahkan `-I` ke `search.py` karena flag itu memutus import `core` lokal.

```bash
python3 ~/.claude/skills/ui-ux-pro-max/scripts/search.py "forum komunitas diskusi" --design-system
```

Pemeriksa prosa. Gerbang lulus 90 dan tidak ada temuan di atas minor. Nama berkas memakai tanda kutip karena ada spasi:

```bash
python3 ~/.claude/skills/anti-ai-slop/scripts/sanitize.py "proyek unggas.md" --fix
python3 ~/.claude/skills/anti-ai-slop/scripts/slopcheck.py "proyek unggas.md"
```

### Gerbang lulus sebelum menyerahkan pekerjaan

1. `npx tsc --noEmit` keluar 0.
2. `NODE_OPTIONS=--max-old-space-size=1280 npx next build` sukses dan `.next/BUILD_ID` ada.
3. `npx vitest run` 59 test hijau di 9 berkas.
4. `inspect.mjs --app` di 1440, 768, 390 tanpa FAIL. WARN boleh, tapi harus bisa dijelaskan. Untuk thread, tambahkan `--allow headline-lines` karena judul buatan pengguna boleh lebih dari dua baris di 390px.
5. Buka ketiga tangkapan layar dan lihat sendiri. Meter yang lulus bukan nilai akhir.
6. `slopcheck.py` minimal 90 untuk setiap dokumen atau copy yang berubah.

### Aturan proyek yang tidak diketahui skill

- Bahasa antarmuka Indonesia, sapaan "kamu", nada peternak. Jangan menerjemahkan ke Inggris.
- Jangan memasang mode gelap. Keputusan pemilik, dan arah desainnya terang.
- Jangan mengganti palet daun atau pasangan Fraunces dan Plus Jakarta Sans. Yang boleh berubah komposisinya.
- Jangan menambah panel filter wilayah di beranda. Wilayah hanya label pada baris dan pilihan opsional di `/baru`.
- Topik ber-`is_restricted` tetap tersembunyi dari semua daftar.
- Email hanya untuk daftar dan lupa password. Notifikasi balasan tetap di dalam web.
- Angka nol ditulis nol, bukan disembunyikan atau dibulatkan jadi seolah ada aktivitas. Data aslinya 13 diskusi, 14 post, 3 akun, dan satu thread dengan satu balasan. Desain harus tetap masuk akal dalam keadaan hampir kosong.
- Jangan mengubah rute, nama field form, atau Server Action. Yang berubah di v6 hanya tampilan dan query daftar.

## Jebakan yang sudah ditemui

Enam hal ini sudah memakan waktu di sesi sebelumnya. Tulis di sini supaya tidak terulang.

1. `next start` menyajikan build yang ada saat proses dijalankan. Kalau build ulang lalu tidak restart, `inspect.mjs` akan mengukur versi lama dan melaporkan FAIL yang sebenarnya sudah beres. Selalu restart server pratinjau setelah build, lalu cek `cat .next/BUILD_ID` cocok dengan build terakhir.
2. `pkill -f "next start -p 3100"` bisa ikut mematikan shell yang menjalankannya, karena pola itu muncul di baris perintah shell itu sendiri. Gejalanya exit code 144. Pakai pola yang tidak cocok dengan perintah sendiri, atau simpan PID.
3. Vitest 5 menolak `vitest.config.ts` berisi ESM di paket tanpa `"type": "module"`. Nama berkasnya harus `.mts`. Konfigurasi memakai `import.meta.dirname`, bukan `__dirname`.
4. Turbopack bisa menyajikan CSS basi meski build exit 0. Kalau `globals.css` berubah, cek dulu penandanya ada di `.next/static/chunks/*.css`. Kalau tidak ada, `rm -rf .next` lalu build ulang. Tanpa cek ini, restart akan menjalankan CSS lama bersama markup baru.
5. Turbopack menolak `node_modules` yang berupa symlink ke luar root workspace. Gejalanya `Error: Could not find the Next.js package (next/package.json)` saat build, padahal `next` ada. Ganti symlink dengan salinan nyata (`cp -a` dari produksi) atau jalankan build di direktori yang punya `node_modules` asli.
6. Elemen `position: fixed` di dalam bilah yang memakai `backdrop-blur` mengacu pada bilah itu, bukan viewport. Menu ponsel v6 sempat hanya setinggi 47px karena lembar ditanam di dalam `header` ber-`backdrop-blur`. Render lembar lewat `createPortal(..., document.body)`, lalu kunci `document.body.style.overflow` selama terbuka. Klik tautan dan submit form menutup lembar.

## Kredensial dan rahasia (di server, tidak ada di repo)

| Apa | Lokasi |
|---|---|
| Password DB PostgreSQL | `/var/www/unggas-app/.env` (chmod 600), variabel `DATABASE_URL` |
| Password admin forum (arga) | `~/.flarum-env`, variabel `FLARUM_ADMIN_PASS`. Ganti lewat profil setelah login pertama |
| Root password container PostgreSQL | `~/.unggas-env`, variabel `MARIADB_ROOT_PASS` (nama lama dari era MariaDB) |
| Secret sesi aplikasi | `/var/www/unggas-app/.env`, variabel `SESSION_SECRET` |
| Kredensial AWS untuk kirim email | Tidak disimpan di mana pun. Memakai IAM role `HermesFullAdminRole` yang menempel di instance |
| Token API Cloudflare (DNS) | `~/.cf_token` (chmod 600) |
| Token GitHub (gh CLI, akun `Arg-z`) | `~/.config/gh/hosts.yml` di server (HTTPS, scope repo) |

## Operasional harian

Login admin di https://unggas.net/masuk dengan user `arga`. Tautan Panel admin muncul di bilah samping setelah login: sembunyikan diskusi atau post, sematkan, blokir akun.

Update aplikasi setelah kode diubah:

```bash
ssh aws 'set -e; set -o pipefail; cd ~/unggas-net && git pull --ff-only \
  && rsync -a --delete --exclude node_modules --exclude .next --exclude .env \
       --exclude .taste-skill app/ /var/www/unggas-app/ \
  && cd /var/www/unggas-app \
  && npm ci --no-audit --no-fund \
  && npx prisma generate \
  && npx prisma migrate deploy \
  && NODE_OPTIONS="--max-old-space-size=1280" npm run build \
  && test -f .next/BUILD_ID \
  && pm2 restart unggas-app'
```

Sumber deploy adalah repo server `~/unggas-net/app`, bukan `~/unggas-forum` di macbook yang masih v3.1. Kalau kode diubah di mesin lain, commit dan push dulu, baru jalankan perintah ini.

Jangan pernah restart PM2 kalau build belum sukses. `test -f .next/BUILD_ID` adalah penggereknya. Restart saat build gagal membuat aplikasi crash-loop "Could not find a production build" sampai dibuild ulang, dan itu pernah terjadi 58 restart pada 26 Okt. `set -o pipefail` wajib karena perintahnya di-pipe, tanpa itu kegagalan build tertelan oleh `tail`.

`prisma generate` wajib karena klien Prisma tidak ikut dibangun Next.js. `migrate deploy` hanya menjalankan migrasi yang belum jalan, aman diulang, tapi wajib setiap kali `prisma/schema.prisma` berubah.

**Simpan perubahan produksi ke GitHub** (setiap kali kode di server berubah). Dokumen ini sudah ada di repo, jadi tidak ada lagi langkah menyalin berkas markdown:

```bash
ssh aws 'cd ~/unggas-net \
  && rsync -a --exclude node_modules --exclude .next --exclude .env --exclude ".taste-skill/**" --exclude .git \
       /var/www/unggas-app/ app/ \
  && git add -A && git commit -m "Sinkron dari produksi" && git push'
```

`.env`, `node_modules`, dan `.next` selalu keluar dari commit; `app/.taste-skill/direction.json` sengaja dipertahankan.

Backup sebelum deploy:

```bash
ssh aws 'TS=$(date +%Y%m%d-%H%M%S); mkdir -p ~/backup-unggas-$TS; \
  tar -czf ~/backup-unggas-$TS/app.tar.gz -C /var/www/unggas-app \
    --exclude=node_modules --exclude=.next .; \
  sudo docker exec ungas-postgres pg_dump -U unggas -d unggas > ~/backup-unggas-$TS/db.sql'
```

Backup manual: `ssh aws 'bash ~/ops/backup-forum.sh'`, log di `~/backup-forum.log`. Isi bucket: `aws s3 ls s3://unggas-backups-385207569778/unggas/`. Restore darurat: unduh dump terbaru, buat DB sementara di container, `psql -d <db> < dump.sql`, cek jumlah baris, lalu ganti. Pola ini pernah diuji lewat `restore_test`.

Cek kesehatan: `pm2 status`, `docker ps`, `curl -o /dev/null -w "%{http_code}" https://unggas.net/`.

Autostart setelah reboot sudah dipasang 27 Okt: `pm2-ubuntu.service` berstatus enabled dan `pm2 save` sudah dijalankan. Kalau daftar proses PM2 berubah, wajib `pm2 save` lagi, kalau tidak reboot akan mengembalikan daftar lama dari `~/.pm2/dump.pm2`.

Cek email: `aws sesv2 get-account --region ap-southeast-1` untuk `ProductionAccessEnabled` dan sisa kuota, `aws sesv2 get-email-identity --email-identity unggas.net --region ap-southeast-1` untuk status DKIM. Kalau `SentLast24Hours` naik tanpa wajar, periksa `/cek-email` dan `/lupa-password`, dua endpoint itulah yang memicu pengiriman.

## Email (aktif 26 Okt 2026, dimatikan sementara 28 Okt 2026)

**Status sekarang: mati.** `EMAIL_AKTIF=false` di `/var/www/unggas-app/.env`. Selama mati, tidak ada satu pun jalur yang memanggil SES.

Yang berlaku saat `EMAIL_AKTIF` bernilai selain `"true"`:

- Daftar di `/daftar` hanya meminta username dan password. Tidak ada field email. Akun langsung dibuat dengan `emailVerifiedAt = now()`, sesi langsung dibuat, lalu pengguna diarahkan ke beranda.
- Email placeholder diisi `<username>@unggas.local` karena kolom `email` di database masih `@unique` dan belum ada migrasi. Jangan menganggap alamat itu bisa dikirimi email.
- Masuk di `/masuk` memakai username saja, tanpa peduli huruf besar/kecil. Pemeriksaan "akun belum diverifikasi" dilewati.
- `/lupa-password` menampilkan pemberitahuan bahwa reset lewat email dimatikan, tanpa form. `/cek-email`, `/verifikasi/[token]`, dan `/reset-password/[token]` mengalihkan ke `/masuk`.
- Panel admin belum punya tombol reset password. Selama email mati, pengaturan ulang password dilakukan lewat database atau dengan menambahkan aksi admin lebih dulu.
- Server Action `lupaPassword`, `resetPassword`, `kirimUlangVerifikasi`, dan `aktifkanAkun` tetap menolak dengan pesan yang jelas bila dipanggil langsung.

Menyalakan lagi: set `EMAIL_AKTIF=true` di `.env`, build ulang, lalu restart PM2. Kode email tidak dihapus, hanya dijaga sakelar di `src/lib/fitur.ts`. Akun yang dibuat selama mode mati tidak punya email asli, jadi verifikasi dan reset untuk akun itu tidak akan pernah sampai; kalau email dinyalakan lagi, akun tersebut perlu diberi email lewat jalur admin atau database.

### Alur email bila sakelar menyala

Pengirim `no-reply@unggas.net`, region SES `ap-southeast-1`, kuota 50.000 per 24 jam.

Alur yang berjalan:

- Daftar: akun dibuat belum aktif, email verifikasi berlaku 24 jam, tombol "Aktifkan akun".
- Lupa password: tautan reset berlaku 1 jam, password baru, semua sesi lama diputus.
- Kirim ulang verifikasi di `/cek-email`.

Batas fungsi email, keputusan pemilik 26 Okt: email hanya untuk daftar dan lupa password. Notifikasi balasan adalah notifikasi di dalam web (bel dan `/notifikasi`), bukan email. Jangan menambah pengiriman email lain tanpa persetujuan.

Catatan teknis:

- Token disimpan sebagai hash SHA-256 di tabel `email_tokens`, sekali pakai.
- Verifikasi sengaja lewat tombol, bukan saat halaman dibuka, karena pemindai tautan di penyedia email akan menghabiskan token sekali pakai.
- Semua balasan form netral ("kalau terdaftar, kami sudah kirim") supaya keberadaan email tidak bisa ditebak.
- Variabel `.env`: `SES_REGION`, `SES_FROM`, `APP_URL`.
- Uji kirim: `cd /var/www/unggas-app && npx tsx -e 'import {kirimEmail} from "./src/lib/email"; ...'`

## Keputusan penting dan riwayat

1. Flarum dibatalkan (25 Okt). Setelah staging jalan, pemilik memilih build custom dari nol. Semua infrastruktur diwariskan.
2. MariaDB diganti PostgreSQL. MariaDB di server ini (distro 11.8.6 plus image 11.4 dan 10.11) rusak untuk jalur Prisma dan mysql2, gagal di db-grant dan handshake. PostgreSQL 16 di container bebas masalah. MariaDB distro dimatikan lewat `systemctl disable mariadb`.
3. Arsip `/panduan/` dihapus total (26 Okt, keputusan pemilik). Sebelumnya diselamatkan ke `archive/unggas-net-snapshot/` di repo laptop dan tarball `~/backup-unggas-panduan-*.tar.gz` di server, jadi tidak benar-benar hilang, hanya tidak di-host. URL lama `/panduan.html`, `/panduan`, `/panduan/` beserta sub-path, dan `/p` semuanya 301 ke homepage. Sejak 27 Okt diarahkan langsung oleh nginx lewat `location ~ ^/panduan(/.*)?(\.html)?$`. Sebelumnya `/panduan/` bolak-balik tanpa henti karena 301 nginx berkelahi dengan normalisasi trailing slash Next.js.
4. Email lewat SES selesai (26 Okt). Production access disetujui dengan CaseId 179301169600650, domain terverifikasi DKIM, SPF ditambah `include:amazonses.com`. Auto-activate dihapus, akun baru wajib verifikasi email. Driver di `src/lib/email.ts` (SESv2, kredensial dari IAM role).
5. Role IAM `HermesFullAdminRole` tetap dipakai (keputusan pemilik). Backup S3 jalan lewat role ini.
6. Dev dan test di laptop memakai DB lewat tunnel SSH port 5433. Build produksi dijalankan di server dengan cap memori 1280MB.
7. UI v2, kartu organik dan hapus filter wilayah (27 Okt, keputusan pemilik). UI awal yang berupa daftar baris di atas putih polos diganti kanvas hangat `#f6f8f5`, kartu putih ber-avatar inisial, banner komunitas, dan pemisahan visual post pembuka dari balasan. Panel filter wilayah di beranda sengaja dihapus, wilayah tetap menempel sebagai label pada masing-masing diskusi.
8. UI v3, tipografi dan sistem tombol (27 Okt). v2 masih terasa generik: font system-ui, tombol kecil, hex ditulis langsung di 20 berkas. v3 memasang Bricolage Grotesque plus Plus Jakarta Sans lewat `next/font`, sistem tombol `.btn` 44px, token `@theme` Tailwind v4 dengan semua pasangan teks terukur AA, banner komunitas tonal, dan digit tabular. Font judul v3 sudah digantikan Fraunces di v3.1.
9. UI v3.1, medium.com jadi acuan (27 Okt). Font identitas dan permukaan baca diganti Fraunces (variable `opsz`), UI tetap Plus Jakarta Sans. Isi thread memakai `.prosa` serif 17px dan lebar `max-w-3xl` sekitar 70 karakter. Judul beranda dan thread naik ke 26 dan 32px. 404 dan empty state ditulis ulang dengan suara peternak. Backup pra-deploy `~/backup-unggas-20261027-033947`.
10. Audit produksi dan empat perbaikan (27 Okt). Loop redirect `/panduan/` diselesaikan di nginx. `pm2-ubuntu.service` di-enable dan `pm2 save` dijalankan. `app/robots.ts` dan `app/sitemap.ts` ditambahkan, robots menutup admin, auth, dan api, sitemap memuat 5000 diskusi terbaru tanpa yang `isHidden`. `next.config.ts` mendapat `poweredByHeader: false` dan `Cache-Control` immutable untuk `/_next/static/*` serta 7 hari untuk gambar dan font. Build `HMqVPVB6Bzml8D4xbzzwS`, 52 test hijau, backup `~/backup-unggas-20261027-160552`.
11. Audit UI terukur dan empat perbaikan (27 Okt). Kontras `N diskusi` di banner hanya 4.32:1, dinaikkan ke `ink-soft` (6.75:1). Bug cascade layer: `header a, footer a { min-height:32px }` di luar `@layer` mengalahkan `.btn`, diperbaiki dengan `:not(.btn)`. Batas `.input` 1.48:1 gagal WCAG 1.4.11, diganti token `--color-line-control: #7d9178` (3.39:1). Badge jumlah pada label aktif 3.50:1 diganti `bg-leaf-ink` (7.87:1). Sapuan ulang 0 elemen kontras gagal di 5 halaman. Build `gOXqneCvEdNI_vWeO6_k5`, backup `~/backup-unggas-20261027-184219`.
12. Aksesibilitas dan token lanjutan (27 Okt). Skip link `.lewati-nav` ke `#konten`, semua `<main>` diberi `id="konten"` dan `tabIndex={-1}`. `prefers-reduced-motion` mematikan transisi (0.01ms). `aria-current="page"` pada komunitas aktif. 12 hex liar di `Avatar.tsx` diganti 18 token `av-*`, border avatar dinaikkan dari 1.12 sampai 1.41:1 ke 1.80 sampai 1.93:1. `ink-faint` digeser dari `#6a7282` ke `#61697a` karena di kanvas hanya 4.53:1. Build `U4HBbOWL7S84VnhxVQ4oY`, 0 kontras gagal di 5 halaman.
13. Jebakan Turbopack, build sukses tapi CSS basi (27 Okt). Setelah `globals.css` diubah, build selesai exit 0 dan `BUILD_ID` terbentuk, tetapi CSS hasil build masih versi lama dari cache `.next/cache/turbopack`. Kalau langsung restart, utility `bg-av-*` tidak ter-generate dan avatar kehilangan warna. Selalu cek penanda perubahan di CSS hasil build sebelum restart, dan kalau tidak ada, `rm -rf .next` lalu build ulang.
14. Pembersihan "terasa template" (27 Okt). Dot 6px dekoratif di setiap label topik dibuang karena menandai state yang tidak ada. Ketebalan ikon diseragamkan ke `strokeWidth="1.5"` plus `vectorEffect="non-scaling-stroke"`; sebelumnya 1.6 sampai 2.2 menghasilkan stroke efektif 1.04 sampai 1.76px bercampur. Tag tak dikenal tidak lagi diam-diam menampilkan semua diskusi, sekarang 404. Build `kHz8mCBDjFo3RMSn1g22j`.
15. Redesign UI v4, arah "accent ladder" (27 Okt). v3.1 masih terbaca sebagai template: primary hijau di setiap aksi, tint hijau di setiap label, ikon di cakram putih, kartu 20px seragam, dan tidak ada struktur kolom di mana pun. v4 mengambil arah `accent-ladder` dari `draw.mjs --app --keep palette,type` lalu menyusun ulang seluruh frame: bilah samping 230px dan bilah atas 64px di satu tanah, switcher komunitas di ujung bilah atas, gutter 29px, daftar sebagai tabel tanpa kartu, thread sebagai pola detail dengan kolom kanan. Hijau tinggal di tanda kecil, primary jadi near black. Palet daun dan pasangan Fraunces plus Plus Jakarta Sans dipertahankan. Rincian v4 tidak lagi disimpan; desain yang berlaku adalah v6.0 di atas.
16. Hapus grup Komunitas di bilah samping (28 Okt, permintaan pemilik). NavSamping tinggal memuat grup Forum (Semua diskusi, Tulis diskusi, Notifikasi, Panel admin); prop `topik` dan tipe `TopikNav` dihapus dari NavSamping, layout tidak lagi meneruskannya. Pemilih komunitas tinggal di bilah atas (desktop) dan baris judul beranda (mobile); PanelKomunitas di halaman masuk/daftar dan kolom kanan thread tidak berubah. Gerbang: tsc bersih, 52 test hijau, inspect.mjs 0 FAIL 0 WARN di 1440/768/390 untuk beranda, thread, dan masuk. Build `o1ul4GJKx9dHdNP6XeL81`, backup pra-deploy `~/backup-unggas-20261028-004931`.
17. Hapus baris tab keadaan daftar (28 Okt, permintaan pemilik): tab Semua, Disematkan, dan Belum dijawab di beranda dihilang seluruhnya karena tinggal satu tab tidak bermakna. Konstanta `TAB` dan blok tab dihapus dari `page.tsx`; logika `?saring=` di `lib/forum.ts` dan status kosong untuk `saring` tetap dipertahankan supaya tautan lama tetap berfungsi, penanda pin `sr-only` pada baris tersemat tetap ada, dan sematan tetap tampil di atas. Toolbar jumlah dan urutan langsung menyusul judul. Gerbang: tsc bersih, 52 test hijau, inspect.mjs 0 FAIL 0 WARN di 1440/768/390. Build `eofTQKlJ6mU0WYesr1Zko`, backup pra-deploy `~/backup-unggas-20261028-005533`.
18. Hapus jumlah diskusi dan dropdown urutan di beranda (28 Okt, permintaan pemilik). Blok kanan toolbar ("N diskusi" + Pemilih `urut`) dihilang dari `page.tsx` beserta konstanta `URUTAN`, import `Pemilih`, dan variabel `total`; pembungkus toolbar jadi `md:hidden` karena isinya tinggal kotak cari ponsel. `parseUrutan` dan `?urut=` tetap berfungsi untuk tautan langsung, begitu juga `?q=`. Gerbang: tsc bersih, 52 test hijau, inspect.mjs 0 FAIL 0 WARN di 1440/768/390. Build `o9elqJRoRn3S2W_1I9eSC`, backup pra-deploy `~/backup-unggas-20261028-010722`.
19. Hapus seksi Komunitas di kolom kanan halaman masuk/daftar (28 Okt, permintaan pemilik): daftar topik berjumlah dan baris "N diskusi sejauh ini" dihilang dari `PanelKomunitas.tsx`; `getTags`, `topik`, `total`, dan import `TopicIcon` ikut dibuang, sisa satu query `terbaru`. Panel kini hanya memuat "Sedang dibahas". Akibatnya inspeksi /masuk 1440 menemukan WARN `hero-void` (33% layar kosong di bawah kartu, sebelumnya 0 WARN), dibereskan dengan menengahkan blok auth secara vertikal: `lg:min-h-[calc(100svh-12rem)] lg:content-center` pada `main` /masuk dan /daftar. Re-inspeksi /masuk dan /daftar: 0 FAIL 0 WARN di 1440/768/390. Gerbang lain: tsc bersih, 52 test hijau. Build `9DoyyemJjsNpkqJB9QbP4`, backup pra-deploy `~/backup-unggas-20261028-013939`.
20. Hapus seluruh kolom kanan halaman masuk/daftar (28 Okt, permintaan pemilik): `<PanelKomunitas />` dicabut dari kedua halaman, layout main jadi satu kolom `mx-auto max-w-[392px]` dengan penengahan vertikal dari item 19, dan berkas `components/PanelKomunitas.tsx` dihapus karena tak terpakai. Inspeksi /masuk dan /daftar 1440 memberi WARN `hero-void` (blok kosong 600×600, 28% layar) dan sengaja diterima: halaman auth adalah satu form di tengah, kekosongan simetris di sekelilingnya adalah komposisinya, sama seperti pola lupa-password dan cek-email. Gerbang lain: tsc bersih, 52 test hijau, 0 FAIL. Build `VQhMKwJx5aNaBJrYTINCI`, backup pra-deploy `~/backup-unggas-20261028-015708`.
21. Repo GitHub `Arg-z/unggas-net` dibuat dari server (28 Okt, private): `gh` CLI 2.103.3 terpasang, login perangkat dengan akun `Arg-z`. Salinan kerja `~/unggas-net` di-commit dan didorong (`2d5312d`); `.env`, `node_modules`, dan `.next` dikecualikan dan diverifikasi bebas nilai rahasia. Tujuannya mematahkan pola drift: produksi kini punya pembanding permanen dan cadangan di luar server. Riwayat commit lama di repo macbook belum ikut.
22. Login tanpa email sementara (28 Okt, permintaan pemilik). Web belum punya user dan alur auth sudah menempel ke SES, jadi verifikasi dan reset lewat email dimatikan dulu. Sakelar `EMAIL_AKTIF` di `src/lib/fitur.ts` menjaga semua jalur; `.env` produksi diisi `EMAIL_AKTIF=false`. Daftar kini cukup username dan password, email diisi `<username>@unggas.local`, akun langsung aktif, sesi langsung dibuat. Masuk memakai username saja dan tidak peduli huruf besar/kecil. Empat Server Action email menolak dengan pesan jelas, halaman lupa password menampilkan pemberitahuan, dan tiga rute email mengalihkan ke `/masuk`. Test bertambah: `validateSignupTanpaEmail`, sakelar, pendaftaran tanpa email, dan masuk sukses (59 test, 9 berkas). Build `vZ-eLgI8x5pYluKsyp2hp`, backup pra-deploy `~/backup-unggas-20261028-030516`. Uji asap di produksi: daftar sebagai `uji_emailless_a1b2c3`, langsung masuk, keluar, lalu masuk lagi dengan username huruf besar; akun uji dihapus sesudahnya.
23. Redesign UI v5, arah framed-sheet (28 Okt, permintaan pemilik). v4 sudah bersih dari primary hijau, tetapi semua halaman masih berupa tabel di atas kanvas kosong tanpa bingkai. Arah diambil dari `draw.mjs --app --kind community --keep palette,type` dengan seed 1338313458: bingkai `#edf2ea` memegang sidebar 228px dan bilah atas 48px, kertas putih inset 8px, radius 16, tanpa bayangan. Sidebar tinggal satu grup Forum, pemilih komunitas ada di bilah atas mulai 1024px dan di baris judul beranda pada ponsel. Sematan dibaca sebagai papan komunitas dengan garis atas aksen 2px. Beranda tidak memakai tab, jumlah, urutan, atau rel kanan; thread punya rel 260px berisi Tentang diskusi termasuk penulis; notifikasi 820px, admin 1120px, tulis 1028px, auth satu kolom 420px yang mulai ditengahkan di 768px. Tombol primary tetap near black, dan `TombolTulis` menyembunyikan aksi bilah atas di `/baru` supaya hanya tombol Terbitkan yang terisi. Palet daun, Fraunces, Plus Jakarta Sans, dan tanpa mode gelap tetap. Gerbang: `tsc` bersih, 59 test hijau di 9 berkas, build `h3Jnu_jE0X14ZT0ugShiC`, inspeksi 0 FAIL di 1440/768/390 untuk beranda, thread, dan masuk; halaman berlogin diperiksa lewat sesi sementara `arga` yang langsung dihapus. Build sempat gagal karena `node_modules` berupa symlink ke luar workspace; diperbaiki dengan salinan nyata. Backup pra-deploy `~/backups/unggas-src-20261028-0343.tar.gz`. Uji asap produksi: lima rute publik 200, tamu dialihkan dari admin dan notifikasi, `/t/999999` 404, tanpa field email di daftar, satu tombol terisi di `/baru`.
24. Revisi UI v5.1, daftar ala Medium (28 Okt, permintaan pemilik). v5 dinilai masih kaku: judul 15px sans, header kolom Diskusi/Balasan/Aktivitas, dan angka nol rata kanan membuat beranda terbaca sebagai tabel. Header kolom dicabut dan diganti satu label bagian; baris diskusi memakai judul Fraunces 18/20px dua baris, cuplikan dua baris 13.8/14.5px, lalu byline avatar + nama + waktu + balasan + tag, dengan overlay judul agar seluruh baris bisa diklik dan `TagPill` di z-10 agar tag tetap bisa diklik. Papan komunitas naik ke 22/25px. Notifikasi memakai byline "nama membalas · waktu", judul diskusi serif 16.5px, nomor balasan, dan chip "Baru". Keadaan kosong beranda, notifikasi, dan balasan thread memakai blok `wash` tanpa garis putus-putus; form auth memakai panel `wash` tanpa garis. Rute, field, Server Action, palet, dan font tidak berubah. Gerbang: `tsc` bersih, 59 test hijau di 9 berkas di server, build `6nROVtdqVHfOeDiU3bolq`, marker CSS `bg-wash/70`, `text-[13.8px]`, `after:inset-0`, dan `sm:py-5` ditemukan sebelum restart. Inspect beranda 1440/768/390 0 FAIL dengan `--allow headline-lines` untuk satu judul diskusi nyata sepanjang tiga baris di 390; /masuk 0 FAIL 1 WARN `hero-void` yang diterima sebagai komposisi satu kolom. Screenshot produksi 1440 dan 390 diperiksa. Backup pra-deploy `~/backup-unggas-20261028-040027`.
25. Hapus nav bawah ponsel (28 Okt, permintaan pemilik). `NavBawah` dicabut dari layout dan berkasnya dihapus; footer turun dari `pb-24` ke `calc(1.5rem + env(safe-area-inset-bottom))` supaya kertas memakai tinggi penuh tanpa menabrak home indicator. Karena nav bawah adalah satu-satunya jalan ke Tulis di ponsel, `TombolTulis` tidak lagi disembunyikan di bawah 640px: di ponsel ia menjadi tombol plus 44x44 near-black di bilah atas, label "Tulis diskusi" muncul mulai 768px. Wordmark, lonceng, dan keluar tetap; pemilih komunitas tetap di baris judul beranda. Tidak ada rute, field, atau Server Action yang berubah. Gerbang: `tsc` bersih, 59 test hijau, build `ypSU5sbcr5CgT7_GQCNjf`, marker CSS `w-11`, `sm:w-auto`, dan `safe-area-inset-bottom` ditemukan sebelum restart. Inspect beranda 1440/768/390 0 FAIL; halaman berlogin diperiksa lewat sesi sementara `arga` (0 elemen "Navigasi bawah", 1 tombol Tulis), lalu sesi dihapus. Backup pra-deploy `~/backup-unggas-20261028-041002`.
26. Redesign UI v6, arah "tangga aksen" (28 Okt, permintaan pemilik). v5.2 masih terbaca sebagai kertas berbingkai: chrome dan inset memisahkan navigasi dari isi, tombol near-black menyeragamkan aksi, dan warna merek hampir hilang. Arah diambil dari `draw.mjs --app --kind community --keep palette,type` dengan seed 1252606000. Tanah `#f4f7f1`, kartu putih tanpa lembar induk, sidebar 252px menyatu dengan tanah, tanpa bilah atas desktop. Tombol primary kembali hijau daun penuh; nav aktif, papan komunitas, kepala auth, dan keadaan kosong memakai tint `accent-soft`. Kartu thread kembali: pembuka dan balasan duduk di kartu putih radius 16, rel kanan 280px. Menu ponsel pindah ke portal `body` setelah sempat hanya setinggi 47px karena `backdrop-blur` di `header`; lonceng ponsel memakai target 40px dengan ikon 19px agar tidak tertutup lencana. Judul thread memakai `text-balance`, judul papan berhenti di dua baris pada 390px. Rute, field, Server Action, palet, font, dan keputusan pemilik tidak berubah. Gerbang: `tsc` bersih, lint 0 error + 2 warning lama, 59 test hijau di server, build `cLUIk599zawNyLC5EpoXP`, marker CSS `#f4f7f1` dan `btn-primary` ditemukan sebelum restart. Inspeksi produksi: beranda dan masuk 0 FAIL 0 WARN, thread 0 FAIL 1 WARN `ragged-row` yang diterima sebagai kartu bertumpuk, dengan `--allow headline-lines`. Backup pra-deploy `~/backup-unggas-20261028-061454`.

## Angka dan target

- 1 bulan: minimal 50 akun, minimal 5 orang posting mingguan.
- 3 bulan: lebih dari 50 persen diskusi mingguan datang dari anggota selain pemilik.
- 6 bulan: komunitas kedua (Ayam) layak dibuka, evaluasi platform.

## Rencana lanjutan

- Notifikasi in-app saat diskusi dibalas (selesai 26 Okt, revisi keputusan pemilik). Tabel `notifications` lewat migrasi `20261026220000`, kolom `notify_replies` dihapus lagi. Self-reply dan penulis yang diblokir tidak dinotifikasi. 52 test hijau.
- UI v2 kartu organik, sudah live.
- UI v3 tipografi dan sistem tombol, sudah live. Font judul v3 sudah digantikan Fraunces di v3.1.
- UI v4 accent ladder, sudah live (28 Okt).
- UI v5 framed sheet, sudah live (28 Okt).
- UI v5.1 daftar ala Medium, sudah live (28 Okt).
- UI v5.2 tanpa nav bawah ponsel, sudah live (28 Okt).
- UI v6.0 accent ladder, sudah live (28 Okt).
- Nyalakan lagi verifikasi email dan lupa password (`EMAIL_AKTIF=true`) setelah ada anggota nyata. Sebelum itu, tentukan cara memberi email asli ke akun yang dibuat selama mode mati.
- Kalkulator pakan interaktif, dibatalkan pemilik, bisa dipertimbangkan lagi nanti.
- CloudFront CDN saat trafik naik.
- Login Google (OAuth) kalau hambatan pendaftaran terlihat.
