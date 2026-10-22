const SOUND_STORAGE_KEY = "sound";

const listeners = new Set<() => void>();
let enabled = false;
let loaded = false;
let suspensions = 0;

function load(): void {
  if (loaded) return;
  loaded = true;
  try {
    enabled = localStorage.getItem(SOUND_STORAGE_KEY) === "on";
  } catch {
    enabled = false;
  }
}

/** Sound is opt-in: the default, and the server snapshot, is always off. Off too while suspended. */
export function getSoundEnabled(): boolean {
  load();
  return enabled && suspensions === 0;
}

function notify(): void {
  for (const listener of listeners) listener();
}

/**
 * Silences the music and the effects for as long as something else holds the speakers, a video
 * with its own sound for one. The choice of the visitor is untouched: releasing gives the sound
 * back as it was. Returns the release, which may be called more than once.
 */
export function suspendSound(): () => void {
  suspensions += 1;
  notify();
  let released = false;
  return () => {
    if (released) return;
    released = true;
    suspensions -= 1;
    notify();
  };
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
  notify();
}

export function subscribeSound(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
