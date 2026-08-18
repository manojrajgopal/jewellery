import { Service } from '@/types';

export const services: Service[] = [
  {
    id: 'bespoke',
    link: '/services/bespoke',
    title: 'Bespoke Design',
    description: 'Collaborate with our master designers to create a one-of-a-kind masterpiece tailored to your vision.',
    icon: 'Gem',
    features: [
      'Personalized consultation with lead designers',
      '3D rendering and wax prototyping',
      'Custom gemstone sourcing',
      'Exclusive handcrafted production'
    ]
  },
  {
    id: 'restoration',
    link: '/services/restoration',
    title: 'Restoration & Care',
    description: 'Preserve the legacy of your cherished heirlooms with our meticulous restoration and maintenance services.',
    icon: 'Wrench',
    features: [
      'Professional ultrasonic cleaning',
      'Prong tightening and stone resetting',
      'Antique piece restoration',
      'Complimentary annual maintenance'
    ]
  },
  {
    id: 'certification',
    link: '/services/certification',
    title: 'Certification',
    description: 'Every AURUM piece is accompanied by rigorous authentication, guaranteeing the utmost quality and ethical sourcing.',
    icon: 'ShieldCheck',
    features: [
      '100% BIS Hallmarked gold',
      'GIA and IGI certified diamonds',
      'Conflict-free sourcing guarantee',
      'Detailed valuation reports'
    ]
  },
  {
    id: 'styling',
    link: '/services/styling',
    title: 'Personal Styling',
    description: 'Elevate your wardrobe with expert advice from our personal jewellery stylists, curating looks for every occasion.',
    icon: 'Sparkles',
    features: [
      'Bridal trousseau curation',
      'Wardrobe and jewellery pairing',
      'Private viewing sessions',
      'Virtual styling consultations'
    ]
  }
];
