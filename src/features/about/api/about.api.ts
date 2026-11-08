import { fetchDocumentWithSeed } from '@/shared/firebase';
import { aboutOverviewSchema } from './about.schema';
import type { AboutOverviewData } from './about.types';

export const SEED_ABOUT_DATA: AboutOverviewData = {
  metrics: [
    {
      id: 'waste',
      value: '14.6 Tons',
      label: 'Dorm Waste Diverted',
      detail: 'Furniture, appliances, and cookware kept in active student circulation.',
    },
    {
      id: 'savings',
      value: '$184,000+',
      label: 'Saved by Students',
      detail: 'Average 62% savings compared to buying brand-new retail household goods.',
    },
    {
      id: 'campuses',
      value: '18 Halls',
      label: 'Connected Pickup Hubs',
      detail: 'Safe, step-free lobby handover zones across university residences.',
    },
  ],
  faqs: [
    {
      id: 'faq-1',
      question: 'Who can buy and sell on UniCycle?',
      answer:
        'Only verified university students and staff with an active .ac.uk or .edu academic email address can list or reserve items, ensuring a trusted campus-only community.',
    },
    {
      id: 'faq-2',
      question: 'How do campus hall pickups work?',
      answer:
        'When you reserve an item, you and the student seller pick a convenient time at a designated Residence Hall reception or Students Union hub—no shipping boxes or courier fees required.',
    },
    {
      id: 'faq-3',
      question: 'How does the 3D Product Studio work?',
      answer:
        'Our lightweight 3D inspection studio lets you tilt, zoom, and inspect colourways and condition details at 60fps without slowing down your browser or mobile connection.',
    },
    {
      id: 'faq-4',
      question: 'What items are permitted on UniCycle?',
      answer:
        'Clean, working pre-owned household essentials including desk lamps, chairs, shelving, kitchenware, small appliances, audio tech, and everyday student carry.',
    },
  ],
};

export async function fetchAboutOverview(): Promise<AboutOverviewData> {
  return fetchDocumentWithSeed('about', 'overview', aboutOverviewSchema, SEED_ABOUT_DATA);
}
