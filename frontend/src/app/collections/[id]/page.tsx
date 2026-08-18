import type { Metadata } from 'next';
import { collections } from '@/data/collections';
import CollectionClient from './CollectionClient';

export async function generateStaticParams() {
  return collections.map((collection) => ({
    id: collection.id,
  }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const collection = collections.find((c) => c.id === params.id);
  
  if (!collection) {
    return { title: 'Collection Not Found | AURUM' };
  }

  return {
    title: `${collection.name} Collection | AURUM`,
    description: collection.description || collection.tagline,
  };
}

export default function CollectionPage({ params }: { params: { id: string } }) {
  return <CollectionClient id={params.id} />;
}
