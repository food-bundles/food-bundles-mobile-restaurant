import type { ImageSourcePropType } from 'react-native';

function unsplash(photoId: string, width: number, height: number): ImageSourcePropType {
  return { uri: `https://images.unsplash.com/${photoId}?w=${width}&h=${height}&fit=crop&q=80` };
}

export const LANDING_IMAGES = {
  chefPreparing: unsplash('photo-1572715376701-98568319fd0b', 800, 600),
} as const;
