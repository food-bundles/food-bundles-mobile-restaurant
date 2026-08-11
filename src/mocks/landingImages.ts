import type { ImageSourcePropType } from 'react-native';

function unsplash(photoId: string, width: number, height: number): ImageSourcePropType {
  return { uri: `https://images.unsplash.com/${photoId}?w=${width}&h=${height}&fit=crop&q=80` };
}

export const LANDING_IMAGES = {
  chefPreparing: unsplash('photo-1572715376701-98568319fd0b', 800, 600),
  farmWorkersHarvesting: unsplash('photo-1605000797499-95a51c5269ae', 800, 400),
  farmKinyinya: unsplash('photo-1509099381441-ea3c0cf98b94', 700, 400),
  farmMusanze: unsplash('photo-1509100194014-d49809396daa', 700, 400),
  farmNasho: unsplash('photo-1598871569630-f00343aad008', 700, 400),
} as const;
