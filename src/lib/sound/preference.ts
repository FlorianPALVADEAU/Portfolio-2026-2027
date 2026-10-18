const SOUND_STORAGE_KEY = "sound";

const listeners = new Set<() => void>();
let enabled = false;
let loaded = false;

function load(): void {
  if (loaded) return;
  loaded = true;
  try {
    enabled = localStorage.getItem(SOUND_STORAGE_KEY) === "on";
  } catch {
    enabled = false;
  }
}

/** Sound is opt-in: the default, and the server snapshot, is always off. */
export function getSoundEnabled(): boolean {
  load();
  return enabled;
}

export function getServerSoundEnabled(): boolean {
  return false;
}

export function setSoundEnabled(next: boolean): void {
  load();
  enabled = next;
  try {
    localStorage.setItem(SOUND_STORAGE_KEY, next ? "on" : "off");
  } catch {
    // Storage can be blocked; the choice still applies for this visit.
  }
  for (const listener of listeners) listener();
}

export function subscribeSound(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
