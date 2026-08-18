import type { Metadata } from 'next';
import CollectionsClient from './CollectionsClient';

export const metadata: Metadata = {
  title: 'Collections | AURUM',
  description: 'Explore our world-class luxury jewellery collections crafted by generations of master artisans.',
};

export default function CollectionsPage() {
  return <CollectionsClient />;
}
