import { Metadata } from 'next';
import CareClient from './client';

export const metadata: Metadata = {
  title: 'Care & Sizing',
  description:
    'The twenty-four minute care ritual, adapted to your stone. Plus ring sizing, chain lengths, and the dates worth remembering.',
};

export default function CarePage() {
  return <CareClient />;
}
