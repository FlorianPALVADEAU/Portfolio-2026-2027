"use client";

import { useSyncExternalStore } from "react";
import { Button } from "@/components/atoms/button";
import {
  getServerSoundEnabled,
  getSoundEnabled,
  setSoundEnabled,
  subscribeSound,
} from "@/lib/sound";

type SoundToggleProps = {
  onLabel: string;
  offLabel: string;
};

export function SoundToggle({ onLabel, offLabel }: SoundToggleProps) {
  const enabled = useSyncExternalStore(subscribeSound, getSoundEnabled, getServerSoundEnabled);

  return (
    <Button
      variant="ghost"
      size="sm"
      className="min-h-11"
      onClick={() => setSoundEnabled(!enabled)}
    >
      {enabled ? onLabel : offLabel}
    </Button>
  );
}
