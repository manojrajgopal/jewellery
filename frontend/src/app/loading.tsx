export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-canvas">
      <div className="flex flex-col items-center gap-6">
        <h1 className="font-accent text-4xl md:text-6xl tracking-widest text-gold-500 animate-pulse opacity-80">
          AURUM
        </h1>
        <div className="w-32 h-[1px] bg-gold-500/20 overflow-hidden relative">
          <div className="absolute top-0 bottom-0 left-[-100%] w-[100%] bg-gradient-to-r from-transparent via-gold-500 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
