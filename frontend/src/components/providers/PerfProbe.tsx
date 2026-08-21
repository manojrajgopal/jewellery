'use client';

import { useEffect } from 'react';

import { probeFrameRate } from '@/lib/perf';

/**
 * Confirms the device tier against reality once the page has settled.
 *
 * The pre-paint script classifies from memory, cores and pointer type, which is
 * everything available synchronously and is a guess. It is wrong in both
 * directions often enough to matter: a mid-range phone with 6GB can be pinned by
 * a slow GPU, and a desktop reporting twelve cores can be a decade-old machine
 * driving a 4K panel. Measuring actual frame intervals is the only signal that
 * cannot be argued with.
 *
 * Renders nothing, holds no state, and only ever lowers the tier — a device that
 * has already dropped frames on this page will drop them again.
 */
export default function PerfProbe() {
  useEffect(() => {
    probeFrameRate();
  }, []);

  return null;
}
