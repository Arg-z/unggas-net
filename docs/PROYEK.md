# Proyek unggas.net: forum komunitas peternak unggas

Status per 28 Oktober 2026: **UI v4 (accent ladder) live di https://unggas.net, dengan login sementara tanpa email**: sidebar tanpa grup Komunitas, tanpa baris tab, tanpa jumlah+urutan, halaman masuk/daftar satu kolom. Pendaftaran dan masuk kini hanya username dan password; alur verifikasi, lupa password, dan reset lewat email dimatikan lewat `EMAIL_AKTIF=false`, jadi SES tidak dipanggil. Build `vZ-eLgI8x5pYluKsyp2hp`, `tsc` bersih, 59 test hijau di 9 berkas, inspeksi tampilan 0 FAIL.

Dokumen ini adalah serah terima. Bagian "Syarat skill" dan "Jebakan" ditulis untuk agen berikutnya, bukan untuk manusia yang sudah hafal proyeknya.

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
- Stack: Next.js 16 (App Router, TypeScript, Tailwind v4), Prisma 6, PostgreSQL 16, PM2
- Repo GitHub: `Arg-z/unggas-net` (private, https://github.com/Arg-z/unggas-net). Salinan kerja di server: `~/unggas-net` (app/ + docs/PROYEK.md + app/.taste-skill/direction.json), disinkron dari produksi 28 Okt. Setiap perubahan produksi: commit + push dari situ.
- Aplikasi di server: `/var/www/unggas-app`, bukan repo git. Pembanding sebelum deploy adalah salinan kerja `~/unggas-net`. Repo lama `~/unggas-forum` di macbook masih v3.1 (plus docs/ops/theme/archive dan riwayat commit lama) dan belum direkonsiliasi; jangan dijadikan dasar deploy sampai disatukan.
- Data desain: `src/app/globals.css` blok `@theme` adalah sumber kebenaran visual sejak v4. `theme/DESIGN.md` (v3.2) sudah usang dan masih mencatat palet serta radius v3, jangan dipakai sebagai acuan. Lembar arah v4 tersimpan di `.taste-skill/direction.json`.
- Pernah terjadi drift: 26 Okt kode di server lebih baru daripada repo karena diedit langsung di server. Sudah diselamatkan lewat commit `c87850e`. Selalu diff dulu sebelum deploy.

## Struktur komunitas dan aturan UI

- Topik aktif: Puyuh, Lobby. Sejak 28 Okt tidak lagi tampil di bilah samping; pemilih komunitas ada di ujung kanan bilah atas (desktop) dan di baris judul beranda (mobile).
- Topik disiapkan, tersembunyi lewat `is_restricted`: Ayam, Bebek dan Entok, Jual-Beli. Preview "Segera Dibuka" sudah dihapus dari beranda (keputusan pemilik 27 Okt). Buka penuh dengan `UPDATE tags SET is_restricted=false WHERE slug='ayam';` saat anggotanya siap.
- Wilayah, 10 tag: Sumatera Utara, Sumatera Selatan, Jawa Barat, Jawa Tengah, Jawa Timur, Bali dan Nusa Tenggara, Kalimantan, Sulawesi, Maluku dan Papua, Luar Negeri.
- Keputusan UI 27 Okt yang masih berlaku: jangan tampilkan daftar atau panel filter wilayah di beranda maupun di bilah samping. Wilayah dipilih opsional saat membuat diskusi di `/baru` dan tampil sebagai label kecil berikon pin pada baris diskusi, tetap bisa diklik ke `/?tag=<slug>`.

## Arsitektur UI v4 (27 Okt 2026)

### Alasan penggantian

v3.1 terbaca sebagai template hasil generate. Primary hijau di setiap aksi, tint hijau di setiap label dan banner, ikon di dalam cakram putih, kartu 20px seragam dengan label "0 balasan" di setiap baris, dan tidak ada satu pun struktur kolom di seluruh aplikasi.

Arah diambil dari `draw.mjs --app --kind community --keep palette,type` dengan seed 2105562756. Nama arahnya **accent ladder**. Palet daun dan pasangan Fraunces plus Plus Jakarta Sans dipertahankan karena itu keputusan pemilik, jadi yang berubah adalah komposisinya, bukan warnanya.

### Aturan arah

Hue hanya di tanda kecil. Hijau daun `#2e7d32` dipakai untuk indikator tab 2px, ikon nav aktif, dot belum dibaca, dan fokus. Aksi utama near black `#0f1714`, bukan hijau. Tint hijau (50 sampai 200) yang mengerjakan area: baris nav aktif, label topik, alert OK.

Bentuk yang dilarang dan sudah dihapus: primary hijau terisi, tint hijau di setiap label, ikon di dalam kotak berwarna, batang aksen kiri pada baris nav aktif, gradien pada chip, radius 20px, bayangan saat diam, angka karangan.

### Shell

Bilah samping 230px dan bilah atas 64px duduk di satu tanah, dipisah garis 1px saja. Switcher komunitas di ujung kanan bilah atas, di balik garis pemisah setinggi bilah. Gutter konten 29px dari garis bilah samping dan dari tepi jendela. Bilah atas mengangkut isi nyata: kotak cari, bel notifikasi, satu tombol primary, dan switcher.

Ponsel memakai bilah bawah 4 tujuan: Beranda, satu komunitas teratas, Tulis, Notifikasi. Pemilih komunitas pindah ke baris judul beranda karena bilah atas baru memuatnya mulai 1024px.

### Halaman

Beranda memakai pola daftar. Baris judul 22px, tab keadaan (Semua, Disematkan, Belum dijawab) di atas garis penuh 1px dengan indikator 2px selebar label, toolbar berisi pencarian dan kontrol urutan, lalu tabel di atas tanah halaman tanpa kartu: label kolom 12px abu huruf kalimat, baris sekitar 72px dengan judul, cuplikan satu baris, label topik, avatar, dan angka balasan rata kanan, kolom aktivitas sendiri.

Thread memakai pola detail. Satu panel pembuka dengan judul 20 sampai 22px, meta 13px, satu aksi bergaris 36px, lalu balasan sebagai baris bergaris rambut (bukan tumpukan kartu). Kolom kanan 252px berisi fakta diskusi dan tiga diskusi lain di komunitas yang sama.

Radius bimodal: 4 sampai 8px untuk kontrol dan label. Panel tanpa bayangan saat diam. Angka rata kanan dengan digit tabular.

### Token dan kelas komponen

Nilai di `src/app/globals.css`:

- Permukaan: `ground` `#f8faf7`, `surface` `#ffffff`, `raised` `#fbfdfb`, `sunken` `#f1f5f0`
- Garis: `border` `#e3e9e1`, `rule` `#edf1ec`, `control` `#7d8d79`
- Teks: `ink` `#1b2621`, `ink-strong` `#0f1714`, `ink-soft` `#47524c`, `ink-faint` `#5f6672`
- Aksen: `accent` `#2e7d32`, `accent-deep` `#236327`, `accent-ink` `#1b5e20`, `accent-soft` `#e8f5e9`, `accent-track` `#c8e6c9`
- Status: `warn-soft/line/ink`, `danger`, `danger-soft`, `danger-line`
- Avatar: 6 triple `av-*` (hijau, amber, biru, oranye, teal, rose)

Kelas: `.btn` (36px, radius 6) dengan varian `-primary` (near black), `-outline`, `-quiet`, `-sm`; `.panel`; `.input`, `.label`, `.hint`, `.alert-error`, `.alert-ok`; di luar layer `.prosa` (Fraunces 17px/1.72), `.tabular`, `.link`, `.scroll-x`, `.lewati-nav`.

Kelas lama sudah dihapus dari CSS. Jangan dipakai lagi: `bg-canvas`, `border-line`, `border-line-soft`, `border-line-strong`, `bg-leaf`, `leaf-tint*`, `leaf-ink`, `text-leaf`, `bg-paper`, `bg-panel`, `bg-unread`, `danger-tint`, `.card`, `.btn-secondary`, `.btn-tint`, `.btn-ghost`, `.btn-lg`, `.link-hijau`, `.no-scrollbar`, `divide-line-soft`.

### Berkas baru, berubah, dihapus

Baru: `components/Wordmark.tsx`, `NavSamping.tsx`, `NavBawah.tsx`, `BilahCari.tsx`, `PemilihKomunitas.tsx`, `PanelKomunitas.tsx`.

Dihapus: `components/NavPintasan.tsx`.

Ditulis ulang: `app/layout.tsx`, `app/page.tsx`, `app/t/[id]/page.tsx`, `app/notifikasi/page.tsx`, `app/baru/page.tsx`, `app/baru/BuatDiskusiForm.tsx`, `app/BalasForm.tsx`, `app/admin/page.tsx`, `app/not-found.tsx`, semua halaman `(auth)/*` dan `verifikasi/[token]`, `app/actions/AuthForm.tsx`, `app/actions/EmailForm.tsx`, `components/TagPill.tsx`, `BadgeSematkan.tsx`, `NotifikasiBadge.tsx`, `Pemilih.tsx`.

Ditambah isi: `components/Ikon.tsx` (`IkonBeranda`, `IkonAkun`, `IkonSematkan` digambar ulang), `lib/forum.ts` (tipe `Saringan` dan `Urutan`, `parseSaringan`, `parseUrutan`, `listDiscussions` menerima `saring`, `urut`, `q`).

Konfigurasi: `vitest.config.ts` diganti `vitest.config.mts` karena Vitest 5 memuat `.ts` sebagai CommonJS dan menolak sintaks ESM.

### Perilaku baru yang nyata

- `/?saring=disematkan` dan `/?saring=belum-dijawab` benar-benar menyaring. Sematan selalu di atas, apa pun urutannya.
- `/?urut=terbaru|terlama|dibalas` mengubah query Prisma, bukan urutan di klien.
- `/?q=` mencari di judul dan isi balasan.
- Pencarian di bilah atas membawa `tag`, `saring`, dan `urut` yang sedang aktif.
- Tag tak dikenal tetap 404, tidak lagi jatuh diam-diam ke daftar penuh.
- Thread punya kolom kanan dan tautan balasan `#post-N` yang bisa dibagikan.
- 404 menampilkan lima diskusi terbaru sebagai jalan keluar.

### Verifikasi yang sudah dijalankan

- `npx tsc --noEmit` bersih.
- `NODE_OPTIONS=--max-old-space-size=1280 npx next build` sukses, `.next/BUILD_ID` terbentuk (build terakhir `iiPjqFNTqz6PU9uwbl7NJ`).
- `npx vitest run` 52 test di 8 berkas, semua hijau.
- Rute di server pratinjau: `/`, `/t/20`, `/masuk`, `/daftar`, `/lupa-password`, `/cek-email` mengembalikan 200. `/admin`, `/notifikasi`, `/baru` mengembalikan 307 ke `/masuk` untuk tamu, 200 setelah login. `/t/999999` dan `/?tag=tidak-ada` mengembalikan 404.
- `inspect.mjs --app` di 1440, 768, dan 390 pada build terakhir: beranda, thread, dan `/masuk` semuanya 0 FAIL 0 WARN. Dua peringatan putaran sebelumnya sudah beres: label bilah bawah tidak lagi menempel ke tepi setelah padding `<ul>` dinaikkan, dan layar auth tidak lagi kosong karena kolom `PanelKomunitas` diisi data forum yang sebenarnya.
- Tangkapan layar final ada di `.taste-skill/after-home/`, `after-thread/`, `after-masuk/`. Pembanding sebelum redesign ada di `.taste-skill/before/`.

### Yang belum selesai

- Verifikasi email, lupa password, dan reset password sengaja mati sejak 28 Okt lewat `EMAIL_AKTIF=false`.
- Akun yang dibuat selama mode mati memakai email placeholder dan belum punya alamat email asli.
- Dua warning ESLint yang belum disentuh: `LIMIT_DISKUSI_BARU` di `app/actions/forum.ts` tidak terpakai, dan parameter `_user` di `getTags` (`lib/forum.ts`). Keduanya bukan error.

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

Token desain diambil dengan perintah ini.

```bash
python3 ~/.claude/skills/ui-ux-pro-max/scripts/search.py "forum komunitas diskusi" --design-system
```

Jangan pernah menambahkan `-I` ke `search.py`. Flag itu memutus import `core` lokal.

Pemeriksa prosa. Gerbang lulus 90 dan tidak ada temuan di atas minor:

```bash
python3 ~/.claude/skills/anti-ai-slop/scripts/sanitize.py unggas-net-PROYEK.md --fix
python3 ~/.claude/skills/anti-ai-slop/scripts/slopcheck.py unggas-net-PROYEK.md
```

### Gerbang lulus sebelum menyerahkan pekerjaan

1. `npx tsc --noEmit` keluar 0.
2. `NODE_OPTIONS=--max-old-space-size=1280 npx next build` sukses dan `.next/BUILD_ID` ada.
3. `npx vitest run` 59 test hijau di 9 berkas.
4. `inspect.mjs --app` di 1440, 768, 390 tanpa FAIL. WARN boleh, tapi harus bisa dijelaskan.
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
- Jangan mengubah rute, nama field form, atau Server Action. Yang berubah di v4 hanya tampilan dan query daftar.

## Jebakan yang sudah ditemui

Empat hal ini sudah memakan waktu di sesi sebelumnya. Tulis di sini supaya tidak terulang.

1. `next start` menyajikan build yang ada saat proses dijalankan. Kalau build ulang lalu tidak restart, `inspect.mjs` akan mengukur versi lama dan melaporkan FAIL yang sebenarnya sudah beres. Selalu restart server pratinjau setelah build, lalu cek `cat .next/BUILD_ID` cocok dengan build terakhir.
2. `pkill -f "next start -p 3100"` bisa ikut mematikan shell yang menjalankannya, karena pola itu muncul di baris perintah shell itu sendiri. Gejalanya exit code 144. Pakai pola yang tidak cocok dengan perintah sendiri, atau simpan PID.
3. Vitest 5 menolak `vitest.config.ts` berisi ESM di paket tanpa `"type": "module"`. Nama berkasnya harus `.mts`. Konfigurasi memakai `import.meta.dirname`, bukan `__dirname`.
4. Turbopack bisa menyajikan CSS basi meski build exit 0. Kalau `globals.css` berubah, cek dulu penandanya ada di `.next/static/chunks/*.css`. Kalau tidak ada, `rm -rf .next` lalu build ulang. Tanpa cek ini, restart akan menjalankan CSS lama bersama markup baru.

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
rsync -az --delete --exclude node_modules --exclude .next --exclude .git --exclude .env \
  ~/unggas-forum/app/ aws:/var/www/unggas-app/
ssh aws 'set -e; set -o pipefail; cd /var/www/unggas-app \
  && npm ci --no-audit --no-fund \
  && npx prisma generate \
  && npx prisma migrate deploy \
  && NODE_OPTIONS="--max-old-space-size=1280" npm run build \
  && test -f .next/BUILD_ID \
  && pm2 restart unggas-app'
```

Jangan pernah restart PM2 kalau build belum sukses. `test -f .next/BUILD_ID` adalah penggereknya. Restart saat build gagal membuat aplikasi crash-loop "Could not find a production build" sampai dibuild ulang, dan itu pernah terjadi 58 restart pada 26 Okt. `set -o pipefail` wajib karena perintahnya di-pipe, tanpa itu kegagalan build tertelan oleh `tail`.

`prisma generate` wajib karena klien Prisma tidak ikut dibangun Next.js. `migrate deploy` hanya menjalankan migrasi yang belum jalan, aman diulang, tapi wajib setiap kali `prisma/schema.prisma` berubah.

**Simpan perubahan produksi ke GitHub** (setiap kali kode di server berubah):
```bash
ssh aws 'cd ~/unggas-net \
  && rsync -a --exclude node_modules --exclude .next --exclude .env --exclude ".taste-skill/**" --exclude .git /var/www/unggas-app/ app/ \
  && cp ~/unggas-net-PROYEK.md docs/PROYEK.md \
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
15. Redesign UI v4, arah "accent ladder" (27 Okt, belum di-deploy). v3.1 masih terbaca sebagai template: primary hijau di setiap aksi, tint hijau di setiap label, ikon di cakram putih, kartu 20px seragam, dan tidak ada struktur kolom di mana pun. v4 mengambil arah `accent-ladder` dari `draw.mjs --app --keep palette,type` lalu menyusun ulang seluruh frame: bilah samping 230px dan bilah atas 64px di satu tanah, switcher komunitas di ujung bilah atas, gutter 29px, daftar sebagai tabel tanpa kartu, thread sebagai pola detail dengan kolom kanan. Hijau tinggal di tanda kecil, primary jadi near black. Palet daun dan pasangan Fraunces plus Plus Jakarta Sans dipertahankan. Rincian lengkap ada di bagian "Arsitektur UI v4" di atas.
16. Hapus grup Komunitas di bilah samping (28 Okt, permintaan pemilik). NavSamping tinggal memuat grup Forum (Semua diskusi, Tulis diskusi, Notifikasi, Panel admin); prop `topik` dan tipe `TopikNav` dihapus dari NavSamping, layout tidak lagi meneruskannya. Pemilih komunitas tinggal di bilah atas (desktop) dan baris judul beranda (mobile); PanelKomunitas di halaman masuk/daftar dan kolom kanan thread tidak berubah. Gerbang: tsc bersih, 52 test hijau, inspect.mjs 0 FAIL 0 WARN di 1440/768/390 untuk beranda, thread, dan masuk. Build `o1ul4GJKx9dHdNP6XeL81`, backup pra-deploy `~/backup-unggas-20261028-004931`.
17. Hapus baris tab keadaan daftar (28 Okt, permintaan pemilik): tab Semua, Disematkan, dan Belum dijawab di beranda dihilang seluruhnya karena tinggal satu tab tidak bermakna. Konstanta `TAB` dan blok tab dihapus dari `page.tsx`; logika `?saring=` di `lib/forum.ts` dan status kosong untuk `saring` tetap dipertahankan supaya tautan lama tetap berfungsi, penanda pin `sr-only` pada baris tersemat tetap ada, dan sematan tetap tampil di atas. Toolbar jumlah dan urutan langsung menyusul judul. Gerbang: tsc bersih, 52 test hijau, inspect.mjs 0 FAIL 0 WARN di 1440/768/390. Build `eofTQKlJ6mU0WYesr1Zko`, backup pra-deploy `~/backup-unggas-20261028-005533`.
18. Hapus jumlah diskusi dan dropdown urutan di beranda (28 Okt, permintaan pemilik). Blok kanan toolbar ("N diskusi" + Pemilih `urut`) dihilang dari `page.tsx` beserta konstanta `URUTAN`, import `Pemilih`, dan variabel `total`; pembungkus toolbar jadi `md:hidden` karena isinya tinggal kotak cari ponsel. `parseUrutan` dan `?urut=` tetap berfungsi untuk tautan langsung, begitu juga `?q=`. Gerbang: tsc bersih, 52 test hijau, inspect.mjs 0 FAIL 0 WARN di 1440/768/390. Build `o9elqJRoRn3S2W_1I9eSC`, backup pra-deploy `~/backup-unggas-20261028-010722`.
19. Hapus seksi Komunitas di kolom kanan halaman masuk/daftar (28 Okt, permintaan pemilik): daftar topik berjumlah dan baris "N diskusi sejauh ini" dihilang dari `PanelKomunitas.tsx`; `getTags`, `topik`, `total`, dan import `TopicIcon` ikut dibuang, sisa satu query `terbaru`. Panel kini hanya memuat "Sedang dibahas". Akibatnya inspeksi /masuk 1440 menemukan WARN `hero-void` (33% layar kosong di bawah kartu, sebelumnya 0 WARN), dibereskan dengan menengahkan blok auth secara vertikal: `lg:min-h-[calc(100svh-12rem)] lg:content-center` pada `main` /masuk dan /daftar. Re-inspeksi /masuk dan /daftar: 0 FAIL 0 WARN di 1440/768/390. Gerbang lain: tsc bersih, 52 test hijau. Build `9DoyyemJjsNpkqJB9QbP4`, backup pra-deploy `~/backup-unggas-20261028-013939`.
20. Hapus seluruh kolom kanan halaman masuk/daftar (28 Okt, permintaan pemilik): `<PanelKomunitas />` dicabut dari kedua halaman, layout main jadi satu kolom `mx-auto max-w-[392px]` dengan penengahan vertikal dari item 19, dan berkas `components/PanelKomunitas.tsx` dihapus karena tak terpakai. Inspeksi /masuk dan /daftar 1440 memberi WARN `hero-void` (blok kosong 600×600, 28% layar) dan sengaja diterima: halaman auth adalah satu form di tengah, kekosongan simetris di sekelilingnya adalah komposisinya, sama seperti pola lupa-password dan cek-email. Gerbang lain: tsc bersih, 52 test hijau, 0 FAIL. Build `VQhMKwJx5aNaBJrYTINCI`, backup pra-deploy `~/backup-unggas-20261028-015708`.
21. Repo GitHub `Arg-z/unggas-net` dibuat dari server (28 Okt, private): `gh` CLI 2.103.3 terpasang, login perangkat dengan akun `Arg-z`. Salinan kerja `~/unggas-net` di-commit dan didorong (`2d5312d`); `.env`, `node_modules`, dan `.next` dikecualikan dan diverifikasi bebas nilai rahasia. Tujuannya mematahkan pola drift: produksi kini punya pembanding permanen dan cadangan di luar server. Riwayat commit lama di repo macbook belum ikut.
22. Login tanpa email sementara (28 Okt, permintaan pemilik). Web belum punya user dan alur auth sudah menempel ke SES, jadi verifikasi dan reset lewat email dimatikan dulu. Sakelar `EMAIL_AKTIF` di `src/lib/fitur.ts` menjaga semua jalur; `.env` produksi diisi `EMAIL_AKTIF=false`. Daftar kini cukup username dan password, email diisi `<username>@unggas.local`, akun langsung aktif, sesi langsung dibuat. Masuk memakai username saja dan tidak peduli huruf besar/kecil. Empat Server Action email menolak dengan pesan jelas, halaman lupa password menampilkan pemberitahuan, dan tiga rute email mengalihkan ke `/masuk`. Test bertambah: `validateSignupTanpaEmail`, sakelar, pendaftaran tanpa email, dan masuk sukses (59 test, 9 berkas). Build `vZ-eLgI8x5pYluKsyp2hp`, backup pra-deploy `~/backup-unggas-20261028-030516`. Uji asap di produksi: daftar sebagai `uji_emailless_a1b2c3`, langsung masuk, keluar, lalu masuk lagi dengan username huruf besar; akun uji dihapus sesudahnya.

## Email (aktif 26 Okt 2026, dimatikan sementara 28 Okt 2026)

**Status sekarang: mati.** `EMAIL_AKTIF=false` di `/var/www/unggas-app/.env`. Selama mati, tidak ada satu pun jalur yang memanggil SES.

Yang berlaku saat `EMAIL_AKTIF` bernilai selain `"true"`:

- Daftar di `/daftar` hanya meminta username dan password. Tidak ada field email. Akun langsung dibuat dengan `emailVerifiedAt = now()`, sesi langsung dibuat, lalu pengguna diarahkan ke beranda.
- Email placeholder diisi `<username>@unggas.local` karena kolom `email` di database masih `@unique` dan belum ada migrasi. Jangan menganggap alamat itu bisa dikirimi email.
- Masuk di `/masuk` memakai username saja, tanpa peduli huruf besar/kecil. Pemeriksaan "akun belum diverifikasi" dilewati.
- `/lupa-password` menampilkan pemberitahuan bahwa reset lewat email dimatikan, tanpa form. `/cek-email`, `/verifikasi/[token]`, dan `/reset-password/[token]` mengalihkan ke `/masuk`.
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

## Angka dan target

- 1 bulan: minimal 50 akun, minimal 5 orang posting mingguan.
- 3 bulan: lebih dari 50 persen diskusi mingguan datang dari anggota selain pemilik.
- 6 bulan: komunitas kedua (Ayam) layak dibuka, evaluasi platform.

## Rencana lanjutan

- Notifikasi in-app saat diskusi dibalas (selesai 26 Okt, revisi keputusan pemilik). Tabel `notifications` lewat migrasi `20261026220000`, kolom `notify_replies` dihapus lagi. Self-reply dan penulis yang diblokir tidak dinotifikasi. 52 test hijau.
- UI v2 kartu organik, sudah live.
- UI v3 tipografi dan sistem tombol, sudah live. Font judul v3 sudah digantikan Fraunces di v3.1.
- UI v4 accent ladder, sudah live (28 Okt).
- Nyalakan lagi verifikasi email dan lupa password (`EMAIL_AKTIF=true`) setelah ada anggota nyata. Sebelum itu, tentukan cara memberi email asli ke akun yang dibuat selama mode mati.
- Kalkulator pakan interaktif, dibatalkan pemilik, bisa dipertimbangkan lagi nanti.
- CloudFront CDN saat trafik naik.
- Login Google (OAuth) kalau hambatan pendaftaran terlihat.
