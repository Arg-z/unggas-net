export type TagInfo = { id: number; kind: string; isRestricted: boolean };

export type TagSelectionOk = { ok: true; topik: number; wilayah: number | null };
export type TagSelectionErr = { ok: false; alasan: string };

/**
 * Enforce server-side: diskusi membawa tepat 1 tag topik dan maksimal 1 tag
 * wilayah; tag restricted hanya untuk admin.
 */
export function validateTagSelection(
  tagIds: number[],
  tags: TagInfo[],
  isAdmin: boolean
): TagSelectionOk | TagSelectionErr {
  const map = new Map(tags.map((t) => [t.id, t]));
  const selected = tagIds.map((id) => map.get(id));
  if (selected.some((t) => !t)) return { ok: false, alasan: "Tag tidak dikenal" };

  const topik = selected.filter((t) => t!.kind === "topik");
  const wilayah = selected.filter((t) => t!.kind === "wilayah");
  if (topik.length !== 1) return { ok: false, alasan: "Pilih satu tag topik" };
  if (wilayah.length > 1) return { ok: false, alasan: "Maksimal satu tag wilayah" };

  const restricted = selected.find((t) => t!.isRestricted);
  if (restricted && !isAdmin) return { ok: false, alasan: "Tag ini belum dibuka" };

  return { ok: true, topik: topik[0]!.id, wilayah: wilayah[0]?.id ?? null };
}
