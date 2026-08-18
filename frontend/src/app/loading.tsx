export default function Loading() {
  return (
    <div className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-canvas">
      <div className="flex flex-col items-center gap-7">
        {/* Rotating facet mark */}
        <div className="relative flex h-16 w-16 items-center justify-center">
          <span className="absolute h-full w-full animate-spin-slow rounded-[20%] border border-gold-500/25" />
          <span className="absolute h-10 w-10 rotate-45 animate-orbit rounded-[18%] border border-gold-500/40" />
          <span className="h-2 w-2 rotate-45 animate-sparkle bg-accent shadow-[0_0_14px_3px_rgb(var(--gold-500)/0.6)]" />
        </div>

        <h1 className="font-accent text-3xl uppercase tracking-luxest text-gradient-static pl-[0.42em] md:text-4xl">
          Aurum
        </h1>

        <div className="relative h-px w-36 overflow-hidden bg-line">
          <span className="absolute inset-y-0 -left-full w-full animate-shimmer bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
        </div>

        <span className="font-sans text-[10px] uppercase tracking-luxer text-faint">
          Preparing the vault
        </span>
      </div>
    </div>
  );
}
