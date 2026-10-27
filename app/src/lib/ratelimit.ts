// Token-bucket sederhana in-memory per kunci (user id / IP).
// Cukup untuk satu proses Next.js; bukan untuk multi-instance.
const buckets = new Map<string, number[]>();

export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    buckets.set(key, recent);
    return false;
  }
  recent.push(now);
  buckets.set(key, recent);
  return true;
}

export function _resetBuckets(): void {
  buckets.clear();
}
