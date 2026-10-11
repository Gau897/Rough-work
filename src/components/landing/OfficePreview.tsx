import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, Wifi } from 'lucide-react';

export const OfficePreview: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative w-full rounded-2xl bg-white border border-border shadow-[0_12px_40px_rgba(31,58,95,0.08)] overflow-hidden"
    >
      {/* Top Application Header Bar */}
      <div className="h-11 bg-surface-bg border-b border-border px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-3 text-xs font-medium text-navy">
            Engineering Pod — Floor 1
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-success">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-text-primary">Connected</span>
          <Wifi size={13} className="text-text-muted ml-1" />
        </div>
      </div>

      {/* Virtual Office Floor Viewport */}
      <div className="relative aspect-[4/3] sm:aspect-[16/11] bg-[#F8FAFC] overflow-hidden p-6 select-none">
        {/* Subtle Floor Grid */}
        <div
          className="absolute inset-0 opacity-[0.55]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #E2E8F0 1px, transparent 1px),
              linear-gradient(to bottom, #E2E8F0 1px, transparent 1px)
            `,
            backgroundSize: '36px 36px',
          }}
        />

        {/* Office Boundary Room 1 (Main Hub) */}
        <div className="absolute inset-4 rounded-xl border-2 border-border/80 pointer-events-none" />

        {/* Meeting Zone Partition (Top-Right) */}
        <div className="absolute top-8 right-8 w-44 sm:w-56 h-36 rounded-lg bg-primary-light/30 border border-primary/20 flex flex-col justify-between p-2.5">
          <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
            Discussion Area
          </span>
          {/* Meeting Table */}
          <div className="self-center w-28 sm:w-36 h-14 rounded-lg bg-[#E2E8F0] border border-[#CBD5E1] flex items-center justify-center">
            <span className="text-[10px] text-text-muted font-medium">Conference</span>
          </div>
          <div />
        </div>

        {/* Desks / Workstations (Left side) */}
        <div className="absolute top-16 left-12 w-28 h-14 rounded-lg bg-[#F1F5F9] border border-[#CBD5E1] shadow-xs flex items-center justify-center">
          <span className="text-[10px] text-text-muted">Pod A</span>
        </div>
        <div className="absolute top-36 left-12 w-28 h-14 rounded-lg bg-[#F1F5F9] border border-[#CBD5E1] shadow-xs flex items-center justify-center">
          <span className="text-[10px] text-text-muted">Pod B</span>
        </div>
        <div className="absolute bottom-16 left-12 w-28 h-14 rounded-lg bg-[#F1F5F9] border border-[#CBD5E1] shadow-xs flex items-center justify-center">
          <span className="text-[10px] text-text-muted">Pod C</span>
        </div>

        {/* Coffee Corner (Bottom-Right) */}
        <div className="absolute bottom-8 right-8 flex items-center gap-2 bg-amber-50/70 border border-amber-200/60 rounded-lg px-3 py-1.5">
          <span className="text-sm">☕</span>
          <span className="text-[11px] font-medium text-amber-900">Cafeteria</span>
        </div>

        {/* Plant Decor */}
        <div className="absolute top-10 left-48 text-base">🪴</div>
        <div className="absolute bottom-12 left-48 text-base">🪴</div>

        {/* --- Avatars in the Virtual Office --- */}

        {/* Avatar 1: Asha (Local User - Center-Left) with Proximity Radius */}
        <div className="absolute top-44 left-52 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
          {/* Proximity Halo (100px radius visual) */}
          <div className="absolute w-44 h-44 rounded-full border border-primary/40 bg-primary/5 pointer-events-none -translate-y-1/2 translate-y-0" />
          
          <div className="relative w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shadow-md ring-2 ring-white">
            A
          </div>
          <span className="mt-1 text-[11px] font-semibold text-navy bg-white/90 px-1.5 py-0.5 rounded shadow-xs">
            Asha (You)
          </span>
        </div>

        {/* Avatar 2: Ravi (Within range, Speaking with Orange Ripple) */}
        <div className="absolute top-38 left-72 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
          {/* Orange Speaking Pulse Ring */}
          <div className="absolute w-12 h-12 rounded-full border-2 border-speaking animate-ping opacity-70 pointer-events-none" />
          <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-md ring-2 ring-white">
            R
          </div>
          <span className="mt-1 text-[11px] font-semibold text-navy bg-white/90 px-1.5 py-0.5 rounded shadow-xs flex items-center gap-1">
            <Volume2 size={10} className="text-speaking" /> Ravi
          </span>
        </div>

        {/* Avatar 3: Meera (In Discussion Area) */}
        <div className="absolute top-22 right-24 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
          <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold shadow-md ring-2 ring-white">
            M
          </div>
          <span className="mt-1 text-[11px] font-medium text-navy bg-white/90 px-1.5 py-0.5 rounded shadow-xs">
            Meera
          </span>
        </div>

        {/* Avatar 4: Alex (At Pod C) */}
        <div className="absolute bottom-14 left-24 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
          <div className="w-9 h-9 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold shadow-md ring-2 ring-white">
            Al
          </div>
          <span className="mt-1 text-[11px] font-medium text-navy bg-white/90 px-1.5 py-0.5 rounded shadow-xs">
            Alex
          </span>
        </div>

        {/* Avatar 5: Leo (At Coffee corner) */}
        <div className="absolute bottom-16 right-36 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
          <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold shadow-md ring-2 ring-white">
            L
          </div>
          <span className="mt-1 text-[11px] font-medium text-navy bg-white/90 px-1.5 py-0.5 rounded shadow-xs">
            Leo
          </span>
        </div>

        {/* Floating Nearby Teammates HUD Panel (Bottom Center) */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xs border border-border rounded-lg shadow-sm px-3.5 py-2 flex items-center gap-4 z-20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className="text-xs font-semibold text-navy">In earshot:</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-text-primary">Ravi</span>
            <span className="text-[10px] text-primary font-semibold bg-primary-light px-1.5 py-0.2 rounded">
              85% clarity
            </span>
          </div>
        </div>

        {/* Floating Action Tip */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-navy/90 text-white text-[11px] font-medium px-3 py-1 rounded-full shadow-sm z-20 pointer-events-none">
          Move closer to start a conversation
        </div>
      </div>
    </motion.div>
  );
};
