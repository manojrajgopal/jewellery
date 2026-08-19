import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { journal } from '@/data/editorial';
import ArticleClient from './client';

/**
 * `output: 'export'` means every dynamic route has to be enumerable at build time,
 * so this is required rather than an optimisation — without it the build fails
 * rather than falling back to on-demand rendering.
 */
export function generateStaticParams() {
  return journal.map((entry) => ({ slug: entry.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const entry = journal.find((j) => j.slug === params.slug);
  if (!entry) return { title: 'Not found' };

  return {
    title: entry.title,
    description: entry.standfirst,
    openGraph: {
      title: entry.title,
      description: entry.standfirst,
      type: 'article',
      publishedTime: entry.date,
      authors: [entry.author],
    },
  };
}

export default function JournalEntryPage({ params }: { params: { slug: string } }) {
  const entry = journal.find((j) => j.slug === params.slug);
  if (!entry) notFound();

  return <ArticleClient slug={params.slug} />;
}
