import { PrismaClient } from "@prisma/client";
import { slugify } from "../src/lib/slug";

const prisma = new PrismaClient();

const TAG_TOPIK = [
  { name: "Puyuh", description: "Semua tentang budidaya puyuh: telur, daging, kandang, pakan, penyakit." },
  { name: "Lobby", description: "Perkenalan anggota baru, ngobrol santai, dan topik umum seputar peternakan." },
  { name: "Ayam", description: "Ayam kampung, broiler, dan layer. Dibuka saat anggotanya siap.", restricted: true },
  { name: "Bebek & Entok", description: "Bebek dan entok. Dibuka saat anggotanya siap.", restricted: true },
  { name: "Jual-Beli", description: "Jual-beli ternak, telur, pakan, dan peralatan. Dibuka saat anggotanya siap.", restricted: true },
];

const TAG_WILAYAH = [
  "Sumatera Utara",
  "Sumatera Selatan",
  "Jawa Barat",
  "Jawa Tengah",
  "Jawa Timur",
  "Bali & Nusa Tenggara",
  "Kalimantan",
  "Sulawesi",
  "Maluku & Papua",
  "Luar Negeri",
];

async function main() {
  for (const t of TAG_TOPIK) {
    const data = {
      name: t.name,
      slug: slugify(t.name),
      kind: "topik",
      description: t.description,
      isRestricted: t.restricted ?? false,
    };
    await prisma.tag.upsert({ where: { slug: data.slug }, create: data, update: data });
  }
  for (const name of TAG_WILAYAH) {
    const data = { name, slug: slugify(name), kind: "wilayah", isRestricted: false };
    await prisma.tag.upsert({ where: { slug: data.slug }, create: data, update: data });
  }
  const total = await prisma.tag.count();
  console.log(`seed selesai: ${total} tag`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
