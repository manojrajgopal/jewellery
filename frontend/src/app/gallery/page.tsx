import { Metadata } from 'next';
import GalleryClient from './client';

export const metadata: Metadata = {
  title: 'Gallery | AURUM',
  description: 'A visual journey through our finest creations',
};

export default function GalleryPage() {
  return <GalleryClient />;
}
