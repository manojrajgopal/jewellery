import Link from 'next/link';
import DiamondSparkles from '@/components/motion/DiamondSparkles';
import AuroraBackground from '@/components/motion/AuroraBackground';
import CTAButton from '@/components/ui/CTAButton';

export default function NotFound() {
  return (
    <div className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-canvas px-4 text-center">
      <AuroraBackground intensity="medium" grid parallax={false} />
      <DiamondSparkles density={34} shape="star" className="z-[2]" />

      <h1 className="select-none font-display text-[9rem] leading-none text-accent/15 md:text-[14rem]">
        404
      </h1>

      <div className="relative z-10 -mt-16 flex flex-col items-center gap-6 md:-mt-24">
        <h2 className="font-display text-4xl text-primary md:text-5xl">Page Not Found</h2>

        <p className="max-w-md font-sans text-lg font-light text-muted md:text-xl">
          The jewel you seek is elsewhere. Let us guide you back to the vault.
        </p>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
          <CTAButton variant="primary" size="lg" href="/" showArrow>
            Return Home
          </CTAButton>
          <CTAButton variant="secondary" size="lg" href="/collections">
            Browse Collections
          </CTAButton>
        </div>

        <Link
          href="/contact"
          className="link-underline mt-4 font-accent text-[10px] uppercase tracking-luxe text-faint transition-colors hover:text-accent"
        >
          Or speak to a jeweller
        </Link>
      </div>
    </div>
  );
}
