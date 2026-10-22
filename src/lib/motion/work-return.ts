const LEFT_KEY = "works-left";
const ARMED_KEY = "works-return-armed";

function write(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // Private mode: the visitor simply lands without the return animation.
  }
}

function read(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function clear() {
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
