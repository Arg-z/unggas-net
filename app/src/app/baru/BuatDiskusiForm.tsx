"use client";

import { useActionState } from "react";
import { buatDiskusi, type ActionResult } from "@/app/actions/forum";

type Tag = { id: number; name: string };

export function BuatDiskusiForm({ topik, wilayah }: { topik: Tag[]; wilayah: Tag[] }) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(buatDiskusi, null);
  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="label">
            Topik <span className="text-accent">*</span>
          </span>
          <select name="tag" required defaultValue="" className="input mt-2">
            <option value="" disabled>
              Pilih topik...
            </option>
            {topik.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="label">
            Wilayah <span className="text-[12px] font-normal text-ink-faint">(opsional)</span>
          </span>
          <select name="tag" defaultValue="" className="input mt-2">
            <option value="">Tanpa wilayah khusus</option>
            {wilayah.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="label">Judul diskusi</span>
        <input
          name="judul"
          required
          minLength={5}
          maxLength={200}
          className="input mt-2"
          placeholder="Kandang puyuh panas saat siang, ventilasi seperti apa yang pas?"
        />
        <span className="hint mt-1.5 block">5–200 karakter. Tulis inti pertanyaannya saja.</span>
      </label>

      <label className="block">
        <span className="label">Isi diskusi</span>
        <textarea
          name="isi"
          required
          minLength={10}
          maxLength={20000}
          rows={9}
          className="input mt-2"
          placeholder="Umur ternak, kapasitas kandang, komposisi pakan, gejala yang terlihat, dan apa yang sudah dicoba."
        />
        <span className="hint mt-1.5 block">
          Makin lengkap konteksnya, makin tepat jawaban yang kamu terima.
        </span>
      </label>

      {state && !state.ok && (
        <p role="alert" className="alert-error">
          {state.alasan}
        </p>
      )}

      <div className="flex items-center justify-end gap-2 border-t border-rule pt-5">
        <button type="submit" disabled={pending} className="btn btn-primary w-full sm:w-auto">
          {pending ? "Menerbitkan..." : "Terbitkan diskusi"}
        </button>
      </div>
    </form>
  );
}
