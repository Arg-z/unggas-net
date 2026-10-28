"use client";

import { useActionState } from "react";
import { buatDiskusi, type ActionResult } from "@/app/actions/forum";

export function BuatDiskusiForm() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(buatDiskusi, null);
  return (
    <form action={action} className="flex flex-col gap-5">
      <label className="block">
        <span className="label">Judul diskusi</span>
        <input
          name="judul"
          required
          minLength={5}
          maxLength={200}
          className="input mt-2"
          placeholder="Kandang puyuh panas saat siang?"
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
