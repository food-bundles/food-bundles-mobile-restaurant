import type { ImageSourcePropType } from 'react-native';

const TRANSPARENT_PIXEL_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVR4AWMAAQAABQABDQottAAAAABJRU5ErkJggg==';

export const PLACEHOLDER_IMAGE: ImageSourcePropType = { uri: TRANSPARENT_PIXEL_PNG };
