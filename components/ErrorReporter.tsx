"use client";

import { useEffect } from "react";
import { startErrorReporting } from "@/lib/errors";

/** Mounted once in the root layout: files unexpected browser errors (see lib/errors.ts). */
export function ErrorReporter() {
  useEffect(() => startErrorReporting(), []);
  return null;
}
