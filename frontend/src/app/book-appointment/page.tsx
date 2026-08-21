import { Metadata } from 'next';
import BookAppointmentClient from './client';

export const metadata: Metadata = {
  title: 'Book an Appointment | AURUM',
  description:
    'Reserve a private viewing, a bespoke consultation, a valuation or a restoration visit with an AURUM advisor.',
};

export default function BookAppointmentPage() {
  return <BookAppointmentClient />;
}
