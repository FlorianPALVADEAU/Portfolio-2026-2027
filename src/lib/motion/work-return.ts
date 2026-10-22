const LEFT_KEY = "works-left";
const ARMED_KEY = "works-return-armed";

/**
 * Kept in memory as well as in the session, because a browser can refuse storage while the page
 * is still the same app from one navigation to the next.
 */
const memory = new Map<string, string>();

function write(key: string, value: string) {
  memory.set(key, value);
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // The memory copy above still covers this visit.
  }
}

function read(key: string): string | null {
  try {
    return sessionStorage.getItem(key) ?? memory.get(key) ?? null;
  } catch {
    return memory.get(key) ?? null;
  }
}

function clear() {
  memory.clear();
  try {
    sessionStorage.removeItem(LEFT_KEY);
    sessionStorage.removeItem(ARMED_KEY);
  } catch {
    // Nothing was stored.
  }
}

/** Notes which project page a cover opened, so the list can play the way back into its card. */
export function rememberLeftWork(path: string) {
  write(LEFT_KEY, path);
}

/** Marks the next list visit as a return: back link or browser back, never a fresh visit. */
export function armWorkReturn() {
  write(ARMED_KEY, "1");
}

/** The project path a return comes from, once; `null` for any other visit to the list. */
export function takeWorkReturn(): string | null {
  const path = read(ARMED_KEY) ? read(LEFT_KEY) : null;
  clear();
  return path;
}
