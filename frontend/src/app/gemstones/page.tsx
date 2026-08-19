import { Metadata } from 'next';
import GemstonesClient from './client';

export const metadata: Metadata = {
  title: 'The Stone Library',
  description:
    'Every gem we set, with the figures that decide how it can be worn — Mohs hardness, refractive index, origin and care. Plus the metals bench and the chain from mine to showcase.',
};

export default function GemstonesPage() {
  return <GemstonesClient />;
}
