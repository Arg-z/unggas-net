---
version: v5.0
name: Unggas.net
description: Forum komunitas peternak unggas berbahasa Indonesia. Kertas putih berbingkai hijau-kelabu, judul dan prosa Fraunces, UI Plus Jakarta Sans. Arah framed-sheet untuk layar aplikasi yang dibaca dan dikerjakan lama.
colors:
  # Bingkai & kertas
  ground: "#edf2ea"
  surface: "#ffffff"
  raised: "#fbfdfb"
  wash: "#f3f8f1"
  sunken: "#e8eee5"
  # Garis
  border: "#dfe6dc"
  rule: "#eef2ec"
  control: "#7d8d79"
  # Teks
  ink: "#1b2621"
  ink-strong: "#0f1714"
  ink-soft: "#47524c"
  ink-faint: "#5f6672"
  # Aksen
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
    h1-thread: "26px mobile / 30px desktop, display 600"
    h1-sekunder: "26px, display 600 (notifikasi, tulis, admin, auth)"
    judul-papan: "20px mobile / 22px desktop, display 600"
    judul-baris: "15px, body 600"
    isi-post: "17.5px / 1.72 serif (.prosa)"
    meta: "13px ink-faint"
    label-form: "13px, 600, ink-strong"

rounded:
  sheet: 16px
  panel: 12px
  control: 8px
  chip: 4px

spacing:
  sheet-inset: "8px kanan & bawah di layar >=1024px"
  sidebar: "228px"
  topbar: "48px"
  nav-bawah: "54px"
  konten-beranda: "max 1120px, daftar memakai lebar penuh"
  konten-thread: "max 1080px (utama 788 + rel 260)"
  konten-auth: "max 420px, satu kolom di tengah"
  konten-tulis: "max 1028px (form + panduan 280)"
  konten-notifikasi: "max 820px"
  padding-kertas: "16/24/28px"
---

## Gambaran

Unggas.net UI v5 "kertas berbingkai". Chrome hijau-kelabu (`ground`) mengelilingi
sidebar dan bilah atas; kertas putih masuk 8px dari tepi kanan dan bawah, radius
16px, garis 1px, tanpa bayangan. Pengguna tidak perlu mempelajari navigasi baru:
rute, label, dan alur tetap sama seperti v4. Yang berubah adalah bingkai, kepadatan,
dan satu penanda identitas, yaitu papan komunitas untuk diskusi tersemat.

Keputusan pemilik yang dipegang versi ini: sidebar hanya memuat satu grup Forum,
tanpa indeks komunitas; beranda tanpa tab status, tanpa jumlah diskusi, tanpa
pemilih urutan, dan tanpa rel kanan; halaman auth tanpa daftar komunitas dan tanpa
kolom kedua.

Warna merek menyusut. Hijau daun `#2e7d32` hanya muncul di logo, garis 2px tab
aktif, garis atas papan, dot notifikasi belum dibaca, dan badge penulis/admin.
Aksi terisi memakai `ink-strong` near-black. Ini menjaga hijau sebagai penanda,
bukan cat. Tidak ada dark mode, keputusan pemilik.

## Warna: pasangan terukur

- putih di atas `ink-strong` 18.2:1 (label `.btn-primary`)
- `ink-faint` di `ground` 5.1:1; di `surface` 5.8:1 (meta, waktu, label kolom)
- `ink-soft` di `ground` 7.2:1 (teks sekunder)
- `accent-ink` di `accent-soft` 7.0:1 (tag topik, badge admin)
- `control` di putih 3.52:1 (batas kontrol; WCAG 1.4.11 non-teks)
- `warn-ink` di `warn-soft` 6.37:1 (badge Disematkan)

Peran permukaan: `ground` bingkai; `surface` kertas dan kartu; `wash` panel tonal,
papan komunitas, baris belum dibaca; `sunken` hover navigasi di bingkai; `raised`
blok jarang dipakai. Jangan menambah warna tanpa mengukur dan mencatatnya di sini.

## Tipografi

- Fraunces untuk identitas dan bacaan: h1, judul thread, judul papan, wordmark,
  isi post (`.prosa`, 17.5px/1.72), copy 404. Bobot 600, tracking rapat.
- Plus Jakarta Sans untuk seluruh UI. Angka memakai `.tabular`.
- Baris prosa dibatasi `max-w-[68ch]`; halaman thread tidak memakai kartu di dalam
  kertas. Kepala thread adalah garis bawah, bukan kotak.
- Input 16px untuk mencegah zoom iOS. Label 13px/600, hint 12px.
- Tidak ada uppercase bertracking pada header tabel atau label sidebar.

## Komponen inti

- `.btn` 36px, radius 8, 14px/600. `.btn-sm` 30px, `.btn-lg` 44px.
  `.btn-primary` near-black, `.btn-outline` putih + `control`, `.btn-quiet` transparan.
  Satu aksi terisi per pandangan.
- `.panel` putih, 1px `border`, radius 12. `.well` `wash`, 1px, radius 12.
  Tanpa bayangan; kedalaman dari langkah warna dan garis.
- `.input` 40px, radius 8, batas `control`, fokus `accent` + ring 3px 15%.
- `.eyebrow` 12px/600 `accent-ink` untuk penanda papan dan panel ajakan.
- TagPill topik: tint aksen, radius 4. Wilayah: putih + pin, pin informatif.
- Avatar inisial, 6 tint deterministik; border 1px agar tepi terbaca di putih.
- `.link` target sentuh 24px, underline saat hover.
- Fokus global 2px `accent` offset 2. `.lewati-nav` untuk WCAG 2.4.1.
- Ikon satu ketebalan 1.5px + `non-scaling-stroke`.

## Tata letak

- Bingkai: sidebar 228px (>=1024px), bilah atas 48px, kertas inset 8px. Di bawah
  1024px bingkai hilang; kertas menjadi layar penuh dan nav bawah 54px.
- Beranda: judul, pemilih komunitas dan kotak cari di ponsel, papan komunitas
  untuk sematan, lalu daftar diskusi selebar kertas. Tanpa tab, jumlah, urutan,
  atau rel kanan. Pemilih komunitas di bilah atas hanya tampil >=1024px.
- Thread: kepala tanpa kartu, prosa 68ch, balasan sebagai baris bergaris, rel
  kanan berisi fakta diskusi (termasuk penulis) dan diskusi lain di komunitas
  yang sama, tampil >=1280px.
- Auth: satu kolom 420px di tengah. Di >=768px form duduk di tengah tinggi layar.
  Shell menyembunyikan tautan Masuk/Daftar saat sudah berada di halaman auth.
- Tulis: form + rel panduan 280px di >=1280px; panduan berisi hal yang membuat
  pertanyaan mudah dijawab, ditulis sebelum mengetik. Tombol Tulis di bilah atas
  disembunyikan di halaman ini agar hanya ada satu aksi terisi.
- Notifikasi: satu kolom 820px, daftar bergaris, baris belum dibaca bertint `wash`.
- Admin: satu kolom 1120px, tab 36px bergaris 2px, tindakan per baris.
- 404: dua kolom, salinan dan aksi di kiri, diskusi terbaru di kanan.
- Wilayah tidak pernah menjadi panel filter di beranda (keputusan pemilik).

## Do's and Don'ts

- Lakukan: tambah token di `@theme` sebelum memakai warna/kelas baru.
- Lakukan: jaga target sentuh >=44px untuk aksi utama, >=36px untuk kontrol padat.
- Lakukan: satu tombol primary per pandangan.
- Lakukan: pakai `control` untuk batas kontrol, `border` untuk tepi panel, `rule`
  untuk pemisah baris.
- Jangan: memakai shadow, gradien, glass, atau emoji sebagai ikon.
- Jangan: memakai `gray-*` Tailwind, pakai tangga `ink*`.
- Jangan: memakai hijau untuk teks biasa atau latar besar.
- Jangan: menambah dot yang tidak menandai state nyata.
- Jangan: mengganti Fraunces/PJS tanpa alasan brand.

## Riwayat

- v5.0 (27 Okt 2026): framed-sheet. Bingkai + kertas inset, sidebar satu grup
  Forum, pemilih komunitas di bilah atas, papan komunitas, thread tanpa kartu
  dengan rel fakta + Penulis, auth satu kolom, form tulis dengan rel panduan,
  notifikasi/admin/404 diselaraskan. Token `ground/wash/sunken` menggantikan
  `canvas/panel/paper`; tombol primary near-black. Setelah revisi pemilik, tab,
  jumlah, urutan, indeks komunitas sidebar, dan kolom kedua auth tidak dipakai.
- v3.2 (27 Okt 2026): audit header, h1 sekunder, target sentuh link, badge
  sematkan tunggal, radius, padding auth, title ganda.
- v3.1 (27 Okt 2026): sistem tombol `.btn`, token `@theme`, Fraunces + PJS.
