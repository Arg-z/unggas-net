---
version: v3.2
name: Unggas.net
description: Forum komunitas peternak unggas berbahasa Indonesia — hijau kebun di atas kertas putih hangat, tipografi Fraunces (serif, display + prosa) + Plus Jakarta Sans, tombol besar yang jelas ditekan dari ponsel. Referensi UI: medium.com (satu ide warna, satu aksi per layar, permukaan baca serif, suara editorial di copy kecil).
colors:
  canvas: "#f6f8f5"
  card: "#ffffff"
  raised: "#fbfefb"
  panel: "#eef4ea"
  paper: "#f3f6f2"
  paper-deep: "#e7ede5"
  unread: "#f2f9f3"
  line: "#dfe6dc"
  line-soft: "#eef2ec"
  line-strong: "#cbd8c7"
  line-control: "#7d9178"
  ink: "#1e2939"
  ink-strong: "#101828"
  ink-soft: "#4a5565"
  ink-faint: "#61697a"
  leaf: "#2e7d32"
  leaf-deep: "#236327"
  leaf-press: "#1d5521"
  leaf-tint: "#e8f5e9"
  leaf-tint-deep: "#c8e6c9"
  leaf-ink: "#1b5e20"
  amber-tint: "#fef3c7"
  amber-line: "#fde68a"
  amber-ink: "#92400e"
  danger: "#bf000f"
  danger-tint: "#fdecec"
  danger-line: "#f4c7c9"
  # Tint avatar (6 seri deterministik). Teks 6.37-7.00:1 di bg-nya; border ~1.8-1.9:1 di putih.
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
    peran: "h1 halaman, judul thread, wordmark logo, copy editorial (404, empty state)"
    bobot: 600
    tracking: "-0.02em"
  prose:
    fontFamily: "Fraunces text optical size, kelas .prosa"
    peran: "isi post pembuka & balasan di halaman thread — permukaan baca serif ala Medium"
    ukuran: "17px, leading 1.75"
  body:
    fontFamily: "Plus Jakarta Sans (next/font, self-hosted; foundry Tokotype, Indonesia)"
    peran: "semua teks UI lain — daftar, meta, tombol, form, sidebar"
  skala:
    h1-beranda: "26px mobile / 32px desktop, display 600"
    h1-thread: "26px mobile / 32px desktop, display 600"
    h1-404: "40–56px display 600 (halaman editorial)"
    h1-sekunder: "24px mobile / 28px desktop, display 600 (notifikasi, form, admin)"
    judul-kartu: "18px, body 700"
    isi-post: "17px/1.75 serif (.prosa)"
    meta: "13px ink-faint"
    label-form: "15px, 600, ink-strong"
rounded:
  card: 20px
  control: 12px   # tombol, input, select
  chip-sm: 10px   # tombol ukuran sm
  pill: 9999px    # tag, badge
spacing:
  container: "max-w-6xl beranda & chrome, max-w-4xl admin, max-w-3xl thread, max-w-2xl form & notifikasi, max-w-md auth"
  kartu-padding: "20px mobile / 28px desktop"
  gap-kartu: 12px
  gap-section: 24px
---

## Overview

Unggas.net UI v3.1 "kertas kebun": kanvas hangat `#f6f8f5`, kartu putih radius 20px berbatas
`#dfe6dc`, dan hijau kebun `#2e7d32` hanya untuk aksi utama + identitas komunitas. Perubahan
dari v2: pasangan font sungguhan (Fraunces untuk judul & prosa, Plus Jakarta Sans untuk
body — keduanya self-hosted via `next/font`, tanpa request runtime), sistem tombol
terpusat (`.btn`), token warna semantik di `@theme` Tailwind v4 (habis hex liar di
komponen), dan target sentuh lebih besar. Tidak ada dark mode — keputusan pemilik.

## Warna — pasangan terukur WCAG AA

- putih di atas `leaf` **5.13:1** (label tombol primary)
- `ink-faint` di putih **5.51:1**, di canvas **5.16:1**, di panel **4.92:1** (meta; dinaikkan dari #6a7282 yang cuma 4.53:1 di canvas — terlalu tipis)
- `ink-soft` di `canvas` **7.08:1**
- `leaf-ink` di `panel` **7.03:1**
- `amber-ink` di `amber-tint` **6.37:1**
- `line-control` di putih **3.39:1** (batas kontrol, ambang non-teks 3:1 — WCAG 1.4.11)

Peran: `canvas` latar halaman & krom; `card` permukaan konten; `panel` banner komunitas &
kartu Tentang; `raised` kartu disematkan; `paper` pill wilayah. Hijau (`leaf*`) hanya untuk
tombol primary, link, tab aktif, badge penulis/admin, dan ikon topik. Amber khusus
`Disematkan`. Merah `danger` khusus galat & status blokir. Jangan menambah warna baru tanpa
mengukurnya dulu dan mencatatnya di sini.

## Tipografi

- **Fraunces** untuk identitas & permukaan baca: h1, judul thread, wordmark, copy editorial
  (404, empty state), dan isi post via `.prosa` (17px/1.75). Optical sizing (`opsz`) bikin
  huruf seriptajam di ukuran besar dan tenang di ukuran kecil.
- **Plus Jakarta Sans** untuk semua UI: daftar, meta, tombol, form, sidebar. Digit jumlah
  memakai `.tabular` (`font-variant-numeric: tabular-nums`).
- Halaman thread dibatasi `max-w-3xl` agar baris prosa ±70 karakter seperti Medium.
- Input font 16px — mencegah iOS auto-zoom saat fokus.
- Label section sidebar sentence case 13px — tidak ada uppercase tracking.

## Komponen inti (kelas di `globals.css`)

- **`.btn`** — tinggi default 44px (nyaman di jempol), radius 12px, label 15px/600,
  kata kerja jelas. Varian: `.btn-primary` (hijau, satu per pandangan, hover `leaf-deep`,
  pressed `leaf-press`), `.btn-secondary` (putih + border `line-strong`), `.btn-tint`
  (hijau tint, aksi admin sekunder), `.btn-ghost` (teks). Ukuran: `.btn-sm` 36px untuk
  header/baris admin, `.btn-lg` 48px untuk CTA banner. Disabled: opacity 55%.
- **`.card`** — putih, border `line`, radius 20px, tanpa bayangan. Kedalaman dari langkah
  warna, bukan shadow.
- **`.input`** — putih, border `line-control` (3.39:1 — `line-strong` cuma 1.48:1, gagal 1.4.11), radius 12px, min-height 46px; fokus: border
  `leaf` + ring `rgb(46 125 50 / .16)` 3px.
- **`.alert-error` / `.alert-ok`** — pesan galat/sukses form, radius 12px, pasangan
  danger/leaf yang sudah terukur.
- **`.link-hijau`** — link teks, hover underline offset 3.
- **TagPill** — topik: tint hijau, **tanpa dot** (teks pill sudah menyebut topiknya; dot dekoratif
dibuang 27 Okt karena menandai state yang tidak ada). Wilayah: `paper` + ikon pin — pin itu
menandai jenis tag yang berbeda, jadi ia informatif. Radius full, tinggi sentuh ≥28px.
- **Avatar** — inisial, 6 tint hangat deterministik (hijau, amber, biru, oranye, teal, rose)
  lewat token `av-*` (bukan hex di komponen). Border 1px `av-*-line` diukur **1.80-1.93:1** di putih
  supaya tepinya terbaca — nilai lama 1.12-1.41 praktis tak terlihat. Avatar `aria-hidden` karena
  inisial duplikat dari nama yang sudah terbaca.
- **Cincin fokus global** `:focus-visible` 2px `leaf` offset 2 — jangan dihapus.
- **Ikon SVG** — satu ketebalan: `strokeWidth="1.5"` + `vectorEffect="non-scaling-stroke"`.
  Tanpa `non-scaling-stroke`, ikon 14px dan 20px merender 1.04px vs 1.6px dari atribut yang sama;
  dengan itu, semuanya tetap 1.5px di ukuran apa pun.
- **`.lewati-nav`** — skip link ke `#konten`, tersembunyi sampai difokus keyboard (WCAG 2.4.1).
  Setiap `<main>` wajib punya `id="konten"` + `tabIndex={-1}`.
- **`aria-current="page"`** pada tautan komunitas aktif di sidebar & bar mobile.
- **`prefers-reduced-motion`** dimatikan transisinya (0.01ms), bukan sekadar dipercepat.

## Layout

- Beranda: banner komunitas panel tonal (ikon topik dalam disc putih, judul display,
  "N diskusi" tabular, CTA `btn-lg`) → bar komunitas pill mobile → grid `250px_1fr`
  sidebar/daftar (desktop) → kartu diskusi.
- Thread: post pembuka kartu ber-border `leaf-tint-deep` terpisah dari daftar balasan;
  balasan kartu putih standar; form balasan `btn` full-width di mobile.
- Wilayah tidak pernah jadi panel filter di beranda (keputusan pemilik 27 Okt 2026) — hanya
  pill berikon pin pada kartu.

## Perubahan v3.2 — hasil audit 27 Okt 2026

- **Header**: aksi akun "Daftar" turun jadi `.btn-secondary`. Sebelumnya hijau primary di
  semua halaman, jadi tiap pandangan punya dua tombol primary (beranda: Daftar + Mulai
  Diskusi; halaman auth: Daftar header + tombol submit) — melanggar aturan satu primary.
- **Pintasan header** (`NavPintasan`) menyimpan state aktif lewat `aria-current="page"` +
  tint `leaf-tint`, sejajar dengan sidebar dan bar pill. Sebelumnya header bisu soal posisi.
- **h1 halaman sekunder** diseragamkan 24/28px display **600**. Sebelumnya campur 22–26px
  dengan bobot 700 (beranda & thread sudah benar 600).
- **`.link-hijau`** dapat `inline-flex` + `min-height: 24px` supaya tautan di dalam prosa
  ("Lupa password?", "Daftar") memenuhi target sentuh WCAG 2.5.8 — sebelumnya 18–21px.
- **Badge "Disematkan"** jadi satu komponen (`BadgeSematkan`); halaman thread & admin
  sebelumnya menampilkannya tanpa ikon pin, berbeda dari beranda.
- **Radius** dirapikan ke skala (20 kartu / 12 kontrol / 10 chip). Ditemukan 8px dan 16px
  liar di nav header, tab admin, chip "akunmu sendiri", dan empty state admin.
- **Padding kartu auth** 20/28px (dulu 24/32px).
- **`<title>`** halaman auth/verifikasi tidak lagi mengulang sufiks situs — template layout
  sudah menambahkannya, hasilnya dulu "Masuk — Forum Peternak Unggas — Forum Peternak Unggas".
- **Header 320px**: padding `px-3`, wordmark 18px, dan padding tombol akun dirapatkan agar
  tidak ada overflow horizontal 4px di layar 320px.

## Do's and Don'ts

- **Do** tambah token baru di `@theme` dulu sebelum memakai warna/kelas baru.
- **Do** jaga target sentuh ≥44px untuk aksi utama, ≥36px untuk kontrol padat.
- **Do** satu tombol primary per pandangan; sisanya secondary/tint/ghost.
- **Do** taruh aturan global di dalam `@layer components`. Aturan unlayered mengalahkan
  `.btn`/`.btn-sm` tanpa peduli spesifisitas (pernah membuat CTA header jadi 32px).
- **Do** pakai `line-control` untuk batas kontrol (input, tombol sekunder); `line-strong` hanya untuk batas dekoratif — 1.48:1 tidak cukup untuk penanda kontrol.
- **Don't** memakai shadow, gradien, glass/backdrop-blur, atau emoji sebagai ikon.
- **Don't** pakai `gray-*` Tailwind — pakai tangga `ink*` yang sudah terukur.
- **Don't** memakai dot/indikator yang tidak menandai state nyata. Dot hanya untuk aktif/live/galat.
- **Don't** pakai hijau untuk teks biasa atau latar besar di luar panel yang disebut.
- **Don't** ganti font tanpa alasan brand; Fraunces = identitas + prosa, PJS = UI.
