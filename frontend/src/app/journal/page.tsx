import { Metadata } from 'next';
import JournalClient from './client';

export const metadata: Metadata = {
  title: 'The Journal',
  description:
    'Notes from the bench — why we lose weight on purpose, what a jardin actually is, and how to read a grading report properly.',
};

export default function JournalPage() {
  return <JournalClient />;
}
