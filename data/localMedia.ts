import { Image } from 'react-native';

const image1 = Image.resolveAssetSource(require('../assets/TestUserMedia/images/sample1.png')).uri;
const image2 = Image.resolveAssetSource(require('../assets/TestUserMedia/images/sample2.png')).uri;
const image3 = Image.resolveAssetSource(require('../assets/TestUserMedia/images/sample3.png')).uri;
const banner1 = Image.resolveAssetSource(require('../assets/TestUserMedia/banner/banner1.png')).uri;
const audio1 = require('../assets/TestUserMedia/audio/sample.mp3');
const video1 = require('../assets/TestUserMedia/video/sample.mp4');

export const LOCAL_MEDIA = [
  { id: 'media-1', type: 'image' as const, title: 'Sample Image 1', thumbnail: image1, url: image1, dateCreated: '2023-05-15' },
  { id: 'media-2', type: 'image' as const, title: 'Sample Image 2', thumbnail: image2, url: image2, dateCreated: '2023-06-22' },
  { id: 'media-3', type: 'image' as const, title: 'Sample Image 3', thumbnail: image3, url: image3, dateCreated: '2023-07-10' },
  { id: 'audio-1', type: 'audio' as const, title: 'Sample Audio', thumbnail: image1, url: audio1, dateCreated: '2023-08-05' },
  { id: 'video-1', type: 'video' as const, title: 'Sample Video', thumbnail: image2, url: video1, dateCreated: '2023-09-18' },
  { id: 'banner-1', type: 'image' as const, title: 'Sample Banner', thumbnail: banner1, url: banner1, dateCreated: '2023-10-01' }
];

export function getMediaById(id: string) {
  return LOCAL_MEDIA.find((m) => m.id === id);
}
