export type LocalMediaItem = {
  id: string;
  type: 'image' | 'audio' | 'video';
  title: string;
  preview: any;
};

export const LOCAL_MEDIA: LocalMediaItem[] = [
  {
    id: 'media-1',
    type: 'image',
    title: 'Placeholder Image',
    preview: require('../assets/TestUserMedia/images/placeholder.png'),
  },
  {
    id: 'audio-1',
    type: 'audio',
    title: 'Placeholder Audio',
    preview: require('../assets/TestUserMedia/audio/placeholder.mp3'),
  },
  {
    id: 'video-1',
    type: 'video',
    title: 'Placeholder Video',
    preview: require('../assets/TestUserMedia/video/placeholder.txt'),
  },
  {
    id: 'banner-1',
    type: 'image',
    title: 'Placeholder Banner',
    preview: require('../assets/TestUserMedia/banner/placeholder.png'),
  },
];
