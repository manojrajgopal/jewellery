import { Metadata } from 'next';
import LookbookClient from './client';

export const metadata: Metadata = {
  title: 'The Lookbook',
  description:
    'Twelve plates, bound. The season read as a book — turn the leaves, run the contact sheet, and see the pieces as they were photographed.',
};

export default function LookbookPage() {
  return <LookbookClient />;
}
