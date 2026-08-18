import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'Our Heritage | AURUM',
  description: 'Discover the legacy of four generations of master artisans crafting exceptional luxury jewellery.',
};

export default function AboutPage() {
  return <AboutClient />;
}
