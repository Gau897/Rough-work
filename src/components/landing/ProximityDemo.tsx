import React, { useRef } from 'react';
import { RotateCcw, Volume2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Info } from 'lucide-react';
import { Container } from '../layout/Container';
import { Card } from '../ui/Card';
import { SectionHeading } from '../ui/SectionHeading';
import { useProximityDemo } from '../../hooks/useProximityDemo';

export const ProximityDemo: React.FC = () => {
  const {
    userPos,
    roomWidth,
    roomHeight,
    hearingRadius,
    computedTeammates,
    moveUser,
    setUserCoordinates,
    resetDemo,
    isFocused,
    setIsFocused,
  } = useProximityDemo();

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  // Handle pointer down on the arena to drag or click-to-move
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsFocused(true);
    isDraggingRef.current = true;
    updatePointerCoords(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    updatePointerCoords(e);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const updatePointerCoords = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = roomWidth / rect.width;
    const scaleY = roomHeight / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;
    setUserCoordinates(clickX, clickY);
  };

  return (
    <section id="demo" className="py-20 md:py-28 bg-white border-b border-border scroll-mt-12">
      <Container>
        <SectionHeading
          eyebrow="Interactive Simulation"
          title="Feel the difference distance makes."
          subtitle="Move the avatar closer to see how the listening experience changes."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
          {/* Left Column: Interactive Mini Office Arena (8 cols) */}
          <div className="lg:col-span-8 flex flex-col items-center">
            <div
              tabIndex={0}
              role="region"
              aria-label="Interactive proximity map"
              ref={containerRef}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className={`relative w-full aspect-[580/380] max-w-[580px] bg-[#F8FAFC] rounded-2xl border-2 transition-all duration-150 overflow-hidden shadow-inner cursor-crosshair select-none ${
                isFocused ? 'border-primary ring-4 ring-primary/10' : 'border-border'
              }`}
            >
              {/* Floor grid */}
              <div
                className="absolute inset-0 opacity-[0.4]"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, #CBD5E1 1px, transparent 1px),
                    linear-gradient(to bottom, #CBD5E1 1px, transparent 1px)
                  `,
                  backgroundSize: '29px 29px',
                }}
              />

              {/* Decorative Office Furniture Elements */}
              <div className="absolute top-6 left-6 w-20 h-10 rounded-md bg-[#E2E8F0] border border-[#CBD5E1] flex items-center justify-center text-[9px] text-text-muted">
                Desk A
              </div>
              <div className="absolute bottom-6 left-6 w-20 h-10 rounded-md bg-[#E2E8F0] border border-[#CBD5E1] flex items-center justify-center text-[9px] text-text-muted">
                Desk B
              </div>
              <div className="absolute top-1/2 right-8 -translate-y-1/2 w-24 h-32 rounded-lg bg-primary-light/40 border border-primary/20 flex flex-col items-center justify-center p-2 text-[10px] text-navy font-medium">
                <span>Meeting Pod</span>
                <span className="text-[14px] mt-1">☕</span>
              </div>

              {/* Teammate 1: Ravi */}
              {computedTeammates.map((t) => {
                const percentX = (t.x / roomWidth) * 100;
                const percentY = (t.y / roomHeight) * 100;
                return (
                  <div
                    key={t.id}
                    style={{ left: `${percentX}%`, top: `${percentY}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-10"
                  >
                    {/* Speaking pulse ring on Ravi */}
                    {t.status === 'speaking' && (
                      <div className="absolute w-12 h-12 rounded-full border-2 border-speaking animate-ping opacity-60" />
                    )}
                    <div
                      style={{ backgroundColor: t.avatarColor }}
                      className="w-9 h-9 rounded-full text-white font-bold text-xs flex items-center justify-center shadow-md ring-2 ring-white"
                    >
                      {t.name[0]}
                    </div>
                    <span className="mt-1 text-[11px] font-semibold text-navy bg-white/90 px-1.5 py-0.5 rounded shadow-xs">
                      {t.name}
                    </span>
                  </div>
                );
              })}

              {/* User Avatar with Hearing Radius Circle */}
              <div
                style={{
                  left: `${(userPos.x / roomWidth) * 100}%`,
                  top: `${(userPos.y / roomHeight) * 100}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-20 transition-[left,top] duration-75 ease-out"
              >
                {/* Proximity Halo (Radius Circle) */}
                <div
                  style={{
                    width: `${(hearingRadius * 2 / roomWidth) * 100}%`,
                    height: `${(hearingRadius * 2 / roomHeight) * 100}%`,
                  }}
                  className="absolute aspect-square rounded-full border border-primary bg-primary/10 -translate-x-0 -translate-y-0 pointer-events-none"
                />

                <div className="w-10 h-10 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center shadow-lg ring-3 ring-white">
                  You
                </div>
                <span className="mt-1 text-[11px] font-bold text-primary bg-white px-2 py-0.5 rounded-full shadow-xs">
                  Your Avatar
                </span>
              </div>
            </div>

            {/* Touch / On-Screen Movement Controls & Reset */}
            <div className="mt-4 w-full flex items-center justify-between gap-4">
              {/* Reset Button */}
              <button
                type="button"
                onClick={resetDemo}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-navy px-3 py-2 rounded-lg bg-surface-bg border border-border hover:bg-white transition-colors"
              >
                <RotateCcw size={14} />
                <span>Reset position</span>
              </button>

              {/* On-screen Directional Touch Controls */}
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-medium text-text-muted mr-2 hidden sm:inline">
                  Touch / Click Controls:
                </span>
                <button
                  type="button"
                  onClick={() => moveUser(-16, 0)}
                  className="w-8 h-8 rounded bg-surface-bg border border-border flex items-center justify-center text-navy hover:bg-white active:scale-95 transition-transform"
                  aria-label="Move left"
                >
                  <ArrowLeft size={14} />
                </button>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => moveUser(0, -16)}
                    className="w-8 h-8 rounded bg-surface-bg border border-border flex items-center justify-center text-navy hover:bg-white active:scale-95 transition-transform"
                    aria-label="Move up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveUser(0, 16)}
                    className="w-8 h-8 rounded bg-surface-bg border border-border flex items-center justify-center text-navy hover:bg-white active:scale-95 transition-transform"
                    aria-label="Move down"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => moveUser(16, 0)}
                  className="w-8 h-8 rounded bg-surface-bg border border-border flex items-center justify-center text-navy hover:bg-white active:scale-95 transition-transform"
                  aria-label="Move right"
                >
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            <p className="mt-2 text-xs text-text-muted text-center">
              Use <kbd className="px-1.5 py-0.5 bg-surface-bg border border-border rounded text-[10px] font-mono">W</kbd>{' '}
              <kbd className="px-1.5 py-0.5 bg-surface-bg border border-border rounded text-[10px] font-mono">A</kbd>{' '}
              <kbd className="px-1.5 py-0.5 bg-surface-bg border border-border rounded text-[10px] font-mono">S</kbd>{' '}
              <kbd className="px-1.5 py-0.5 bg-surface-bg border border-border rounded text-[10px] font-mono">D</kbd>{' '}
              or drag avatar directly to explore distance audio falloff.
            </p>
          </div>

          {/* Right Column: Dynamic Listening Telemetry (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4 w-full">
            <Card className="p-5">
              <h4 className="text-sm font-bold text-navy uppercase tracking-wider mb-4 flex items-center justify-between">
                <span>Listening Levels</span>
                <Volume2 size={16} className="text-primary" />
              </h4>

              <div className="space-y-5">
                {computedTeammates.map((t) => (
                  <div key={t.id} className="p-3.5 rounded-xl bg-surface-bg border border-border/80">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          style={{ backgroundColor: t.avatarColor }}
                          className="w-2.5 h-2.5 rounded-full"
                        />
                        <span className="text-sm font-bold text-navy">{t.name}</span>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                          t.statusLabel === 'Nearby'
                            ? 'bg-success-light text-success'
                            : t.statusLabel === 'In range'
                            ? 'bg-primary-light text-primary'
                            : 'bg-gray-200 text-text-muted'
                        }`}
                      >
                        {t.statusLabel}
                      </span>
                    </div>

                    {/* Distance & Volume bar */}
                    <div className="flex items-center justify-between text-xs text-text-muted mb-1.5">
                      <span>Distance: {t.distance} px</span>
                      <span className="font-semibold text-navy">
                        {t.volumePercent}% volume
                      </span>
                    </div>

                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${t.volumePercent}%` }}
                        className={`h-full rounded-full transition-all duration-150 ${
                          t.volumePercent > 60
                            ? 'bg-success'
                            : t.volumePercent > 0
                            ? 'bg-primary'
                            : 'bg-transparent'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Simulation Note */}
              <div className="mt-5 pt-4 border-t border-border flex items-start gap-2 text-xs text-text-muted">
                <Info size={14} className="shrink-0 text-primary mt-0.5" />
                <span>
                  Interactive frontend simulation. No microphone permission or audio stream is requested on this landing page.
                </span>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
};
