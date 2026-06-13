'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import GlobeControls from '@/components/Globe/GlobeControls';
import CommandCenter from '@/components/CommandCenter/CommandCenter';
import CopilotPanel from '@/components/Copilot/CopilotPanel';

const GlobeViewer = dynamic(() => import('@/components/Globe/AfricaGlobe'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-[#030712]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-[#38bdf8] border-t-transparent rounded-full animate-spin"></div>
        <h2 className="text-[#38bdf8] font-heading tracking-widest uppercase">Initializing Digital Twin...</h2>
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="w-full h-screen relative bg-[#030712]">
      <div className="scanline pointer-events-none" />
      <Suspense fallback={null}>
        <GlobeViewer />
      </Suspense>
      <CommandCenter />
      <GlobeControls />
      <CopilotPanel />
    </main>
  );
}
