/* Satu set ikon garis: stroke 1.5 + non-scaling-stroke supaya ketebalannya
   sama di 14px maupun 20px. Semua mewarisi currentColor. */
type Props = { className?: string };

const dasar = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  vectorEffect: "non-scaling-stroke" as const,
  "aria-hidden": true,
};

export function IkonCari({ className = "h-4 w-4" }: Props) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...dasar}>
      <circle cx="8.8" cy="8.8" r="5.3" />
      <path d="m12.7 12.7 3.6 3.6" />
    </svg>
  );
}

export function IkonSematkan({ className = "h-3.5 w-3.5" }: Props) {
  return (
    <svg viewBox="0 0 16 16" className={className} {...dasar}>
      <path d="M5.4 2.2h5.2" />
      <path d="M6.6 2.2v3.4L4.8 8.1h6.4L9.4 5.6V2.2" />
      <path d="M8 8.1v5.7" />
    </svg>
  );
}

export function IkonBalasan({ className = "h-4 w-4" }: Props) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...dasar}>
      <path d="M3.5 5.5A2.5 2.5 0 0 1 6 3h8a2.5 2.5 0 0 1 2.5 2.5v5A2.5 2.5 0 0 1 14 13H8.5l-3.2 2.5a.5.5 0 0 1-.8-.4V13A2.5 2.5 0 0 1 3.5 10.5v-5Z" />
    </svg>
  );
}

export function IkonNotifikasi({ className = "h-[18px] w-[18px]" }: Props) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...dasar}>
      <path d="M10 2.6a5 5 0 0 0-5 5v2.7l-1.2 2.4a.6.6 0 0 0 .54.87h11.32a.6.6 0 0 0 .54-.87L15 10.3V7.6a5 5 0 0 0-5-5Z" />
      <path d="M8.2 16a1.9 1.9 0 0 0 3.6 0" />
    </svg>
  );
}

export function IkonPlus({ className = "h-4 w-4" }: Props) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...dasar}>
      <path d="M10 4v12M4 10h12" />
    </svg>
  );
}

export function IkonPanah({ className = "h-4 w-4" }: Props) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...dasar}>
      <path d="M16 10H4M9 5l-5 5 5 5" />
    </svg>
  );
}

export function IkonIndeks({ className = "h-4 w-4" }: Props) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...dasar}>
      <path d="M3.5 5h13M3.5 10h13M3.5 15h8" />
    </svg>
  );
}

export function IkonTulis({ className = "h-4 w-4" }: Props) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...dasar}>
      <path d="M13.4 3.6a1.7 1.7 0 0 1 2.4 2.4l-8 8-3.3.9.9-3.3 8-8Z" />
    </svg>
  );
}

export function IkonAdmin({ className = "h-4 w-4" }: Props) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...dasar}>
      <path d="M10 2.8 4 5v4.6c0 3.4 2.4 6.2 6 7.6 3.6-1.4 6-4.2 6-7.6V5l-6-2.2Z" />
    </svg>
  );
}

export function IkonBeranda({ className = "h-4 w-4" }: Props) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...dasar}>
      <path d="M3.5 8.6 10 3.2l6.5 5.4v7.2a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1V8.6Z" />
      <path d="M8 16.8v-4.2h4v4.2" />
    </svg>
  );
}

export function IkonAkun({ className = "h-4 w-4" }: Props) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...dasar}>
      <circle cx="10" cy="7" r="3.2" />
      <path d="M4 16.4c.6-2.8 3-4.4 6-4.4s5.4 1.6 6 4.4" />
    </svg>
  );
}

export function IkonKeluar({ className = "h-4 w-4" }: Props) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...dasar}>
      <path d="M12.5 6.5V4.2A1.2 1.2 0 0 0 11.3 3H4.2A1.2 1.2 0 0 0 3 4.2v11.6A1.2 1.2 0 0 0 4.2 17h7.1a1.2 1.2 0 0 0 1.2-1.2v-2.3" />
      <path d="M8.5 10h8M14 7.5l2.5 2.5L14 12.5" />
    </svg>
  );
}

export function IkonMenu({ className = "h-5 w-5" }: Props) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...dasar}>
      <path d="M3.5 5.5h13M3.5 10h13M3.5 14.5h13" />
    </svg>
  );
}

export function IkonTutup({ className = "h-5 w-5" }: Props) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...dasar}>
      <path d="m5 5 10 10M15 5 5 15" />
    </svg>
  );
}

export function IkonMatahari({ className = "h-4 w-4" }: Props) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...dasar}>
      <circle cx="10" cy="10" r="3.6" />
      <path d="M10 2.2v1.8M10 16v1.8M2.2 10H4M16 10h1.8M4.5 4.5l1.3 1.3M14.2 14.2l1.3 1.3M15.5 4.5l-1.3 1.3M5.8 14.2l-1.3 1.3" />
    </svg>
  );
}

export function IkonBulan({ className = "h-4 w-4" }: Props) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...dasar}>
      <path d="M16.2 12.4A6.6 6.6 0 0 1 7.6 3.8a6.8 6.8 0 1 0 8.6 8.6Z" />
    </svg>
  );
}
