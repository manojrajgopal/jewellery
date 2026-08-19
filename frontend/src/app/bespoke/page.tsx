import { Metadata } from 'next';
import BespokeClient from './client';

export const metadata: Metadata = {
  title: 'Bespoke Studio',
  description:
    'Design your own commission — metal, cut, weight, setting, shank and engraving — and watch the drawing and the estimate change with every choice.',
};

export default function BespokePage() {
  return <BespokeClient />;
}
