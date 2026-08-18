import { Metadata } from 'next';
import CraftsmanshipClient from './client';

export const metadata: Metadata = {
  title: 'Craftsmanship | AURUM',
  description: 'Where ancient wisdom meets modern mastery',
};

export default function CraftsmanshipPage() {
  return <CraftsmanshipClient />;
}
