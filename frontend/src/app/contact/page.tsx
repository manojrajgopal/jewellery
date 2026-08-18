import { Metadata } from 'next';
import ContactClient from './client';

export const metadata: Metadata = {
  title: 'Contact | AURUM',
  description: 'We would love to hear from you',
};

export default function ContactPage() {
  return <ContactClient />;
}
