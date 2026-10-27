"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "./auth";
import { validateTagSelection } from "@/lib/tags";
import { rateLimit } from "@/lib/ratelimit";

export type ActionResult = { ok: true } | { ok: false; alasan: string };

const LIMIT_DISKUSI_BARU = 1 / (60 * 1000); // user baru: 1/menit
const MINGGU_MS = 7 * 24 * 60 * 60 * 1000;

export async function buatDiskusi(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  if (!user) return { ok: false, alasan: "Masuk dulu untuk membuat diskusi." };

  const judul = String(formData.get("judul") ?? "").trim();
  const isi = String(formData.get("isi") ?? "").trim();
  // Select wilayah yang kosong mengirim "" → Number("") = 0; buang nilai tak valid.
  const tagIds = formData
    .getAll("tag")
    .map(Number)
    .filter((n) => Number.isInteger(n) && n > 0);

  if (judul.length < 5 || judul.length > 200) return { ok: false, alasan: "Judul 5-200 karakter." };
  if (isi.length < 10 || isi.length > 20_000) return { ok: false, alasan: "Isi diskusi 10-20.000 karakter." };

  const tags = await prisma.tag.findMany();
  const seleksi = validateTagSelection(tagIds, tags, user.isAdmin);
  if (!seleksi.ok) return seleksi;

  const akunBaru = Date.now() - new Date((await prisma.user.findUniqueOrThrow({ where: { id: user.id }, select: { createdAt: true } })).createdAt).getTime() < MINGGU_MS;
  const limit = akunBaru ? 1 : 5;
  if (!rateLimit(`diskusi:${user.id}`, limit, 60_000)) {
    return { ok: false, alasan: akunBaru ? "Akun baru: maksimal 1 diskusi per menit." : "Maksimal 5 diskusi per menit." };
  }

  const discussion = await prisma.discussion.create({
    data: {
      userId: user.id,
      title: judul,
      tags: {
        create: [seleksi.topik, ...(seleksi.wilayah ? [seleksi.wilayah] : [])].map((tagId) => ({ tagId })),
      },
      posts: { create: { userId: user.id, number: 1, content: isi } },
    },
    select: { id: true },
  });

  revalidatePath("/");
  redirect(`/t/${discussion.id}`);
}

export async function balas(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  if (!user) return { ok: false, alasan: "Masuk dulu untuk membalas." };

  const discussionId = Number(formData.get("discussionId"));
  const content = String(formData.get("content") ?? "").trim();
  if (!Number.isFinite(discussionId)) return { ok: false, alasan: "Diskusi tidak dikenal." };
  if (content.length < 2 || content.length > 20_000) return { ok: false, alasan: "Balasan 2-20.000 karakter." };

  if (!rateLimit(`balas:${user.id}`, 10, 60_000)) {
    return { ok: false, alasan: "Terlalu cepat — tunggu sebentar." };
  }

  const last = await prisma.post.aggregate({
    where: { discussionId },
    _max: { number: true },
  });

  try {
    await prisma.$transaction([
      prisma.post.create({
        data: { discussionId, userId: user.id, number: (last._max.number ?? 0) + 1, content },
      }),
      prisma.discussion.update({ where: { id: discussionId }, data: { lastPostAt: new Date() } }),
    ]);
  } catch {
    return { ok: false, alasan: "Diskusi tidak ditemukan." };
  }

  // Notifikasi in-app ke penulis diskusi (bukan ke diri sendiri; penulis banned diabaikan).
  try {
    const d = await prisma.discussion.findUnique({
      where: { id: discussionId },
      select: { userId: true, user: { select: { isBanned: true } } },
    });
    const nomor = (last._max.number ?? 0) + 1;
    if (d && d.userId !== user.id && !d.user.isBanned) {
      await prisma.notification.create({
        data: { userId: d.userId, actorId: user.id, discussionId, postNumber: nomor },
      });
    }
  } catch {
    // balasan sudah tersimpan — notifikasi gagal diabaikan
  }

  revalidatePath(`/t/${discussionId}`);
  return { ok: true };
}
