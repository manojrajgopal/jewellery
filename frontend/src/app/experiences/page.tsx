import { Metadata } from 'next';
import ExperiencesClient from './client';

export const metadata: Metadata = {
  title: 'Experiences',
  description:
    'An hour at the bench, a gem-grading class, the full atelier tour, or the boutique to yourself after hours — the days each one runs, and the diary to ask for it.',
};

export default function ExperiencesPage() {
  return <ExperiencesClient />;
}
