import { Metadata } from 'next';
import VaultClient from './client';

export const metadata: Metadata = {
  title: 'Your Vault',
  description:
    'Everything you have saved, compared, looked at and asked us to remember — held in your own browser, with the note that travels in the box.',
  // Nothing here is public and nothing here is the same twice, so there is no
  // version of this page worth putting in an index.
  robots: { index: false, follow: true },
};

export default function VaultPage() {
  return <VaultClient />;
}
