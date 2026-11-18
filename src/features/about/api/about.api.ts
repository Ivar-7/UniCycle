import { fetchDocumentWithSeed } from '@/shared/firebase';
import { aboutOverviewSchema } from './about.schema';
import type { AboutOverviewData } from './about.types';

const SEED_ABOUT_DATA: AboutOverviewData = {
  metrics: [
    {
      id: 'waste',
      value: '14.6 Tons',
      label: 'Campus Waste Diverted',
      detail: 'Furniture, appliances, and cookware kept in active student circulation.',
    },
    {
      id: 'savings',
      value: 'Ksh 2.4M+',
      label: 'Saved by Students',
      detail: 'Average 62% savings compared to buying brand-new retail household goods.',
    },
    {
      id: 'campuses',
      value: '18 Hubs',
      label: 'Connected Pickup Hubs',
      detail: 'Safe, convenient handover zones across university campus.',
    },
  ],
  faqs: [
    {
      id: 'faq-1',
      question: 'Who can buy and sell on UniCycle?',
      answer:
        'Anyone with a UniCycle account—using any personal or university email address—can list pre-owned essentials or reserve items for on-campus pickup.',
    },
    {
      id: 'faq-2',
      question: 'How do campus pickups work?',
      answer:
        'When you reserve an item, you and the seller pick a convenient time at a designated campus pickup point or Student Center hub—no shipping boxes or courier fees required.',
    },
    {
      id: 'faq-3',
      question: 'How does the interactive item viewer work?',
      answer:
        'Rotate, zoom, and switch colourways directly on our product stage to inspect condition, materials, and details before arranging a campus pickup.',
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
