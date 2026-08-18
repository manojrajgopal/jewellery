import { Metadata } from 'next';
import ServicesClient from './client';

export const metadata: Metadata = {
  title: 'Our Services | AURUM',
  description: 'Beyond the showcase — excellence in every detail',
};

export default function ServicesPage() {
  return <ServicesClient />;
}
