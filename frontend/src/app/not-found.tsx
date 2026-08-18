import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-canvas text-center px-4">
      {/* Diamond Sparkles Background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full shadow-[0_0_12px_2px_rgba(255,255,255,0.9)] animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-gold-300 rounded-full shadow-[0_0_12px_2px_rgba(240,212,138,0.9)] animate-pulse delay-75" />
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-white rounded-full shadow-[0_0_12px_2px_rgba(255,255,255,0.9)] animate-pulse delay-150" />
        <div className="absolute bottom-1/3 right-1/3 w-1.5 h-1.5 bg-gold-300 rounded-full shadow-[0_0_12px_2px_rgba(240,212,138,0.9)] animate-pulse delay-300" />
        <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_2px_rgba(255,255,255,0.8)] animate-pulse delay-500" />
      </div>

      <h1 className="font-display text-[12rem] leading-none text-gold-500/20 select-none">
        404
      </h1>
      
      <div className="relative z-10 -mt-20 flex flex-col items-center gap-6">
        <h2 className="font-display text-4xl md:text-5xl text-cream-50 font-medium">
          Page Not Found
        </h2>
        
        <p className="font-sans text-gold-300/80 text-lg md:text-xl max-w-md font-light">
          The jewel you seek is elsewhere.
        </p>
        
        <Link href="/" className="mt-8 group">
          <button className="px-8 py-3 bg-transparent border border-gold-500/50 text-gold-500 hover:bg-gold-500 hover:text-canvas transition-all duration-500 font-sans tracking-widest uppercase text-sm flex items-center gap-3">
            Return Home
            <span className="group-hover:translate-x-1 transition-transform duration-300">
              →
            </span>
          </button>
        </Link>
      </div>
    </div>
  );
}
