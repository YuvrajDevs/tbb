"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { startMusicWhenAllowed, stopMusic } from "@/lib/game/sound";

/**
 * Background music for the whole app (shelf, case cover, room lobby, desk). Mounted once in the root
 * layout, so it keeps playing across page changes. The print kit is silent.
 */
export function MusicHost() {
  const path = usePathname();
  const silent = path?.endsWith("/kit");
  useEffect(() => {
    if (silent) stopMusic();
    else startMusicWhenAllowed();
  }, [silent]);
  return null;
}
