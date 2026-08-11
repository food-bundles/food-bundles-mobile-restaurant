import type { Farm } from './types';
import { LANDING_IMAGES } from './landingImages';

export const farms: Farm[] = [
  { id: 'kinyinya', name: 'Kinyinya', category: 'FRESH_VEGETABLES', image: LANDING_IMAGES.farmKinyinya },
  { id: 'musanze', name: 'Musanze', category: 'FRESH_VEGETABLES', image: LANDING_IMAGES.farmMusanze },
  { id: 'nasho', name: 'Nasho', category: 'FRESH_FRUITS', image: LANDING_IMAGES.farmNasho },
];
