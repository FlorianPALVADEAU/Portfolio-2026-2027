type Options = {
  /** Attempts allowed per key inside one window. */
  limit: number;
  windowMs: number;
  /** Cap on tracked keys, so a flood of distinct addresses cannot grow memory without bound. */
  maxKeys?: number;
  now?: () => number;
};

/**
 * Sliding-window limiter held in memory. On serverless each instance counts on its own, so it
 * slows a single source down without being a global quota.
 */
export function createRateLimiter({ limit, windowMs, maxKeys = 1000, now = Date.now }: Options) {
  const hits = new Map<string, number[]>();

  const prune = (at: number) => {
    for (const [key, times] of hits) {
      const recent = times.filter((time) => at - time < windowMs);
      if (recent.length === 0) hits.delete(key);
      else hits.set(key, recent);
    }
  };

  /** Records an attempt and tells whether it is allowed. */
  return (key: string): boolean => {
    const at = now();
    if (hits.size >= maxKeys && !hits.has(key)) prune(at);
    const recent = (hits.get(key) ?? []).filter((time) => at - time < windowMs);
    if (recent.length >= limit) {
      hits.set(key, recent);
      return false;
    }
    hits.set(key, [...recent, at]);
    return true;
  };
}
