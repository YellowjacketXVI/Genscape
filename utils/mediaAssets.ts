/**
 * Utility functions for working with media assets
 */

// Types of media supported
export type MediaType = 'image' | 'video' | 'audio';

// Function to get the URL for a media file in the TestUserMedia directory
export const getTestUserMediaUrl = (type: MediaType, filename: string): string => {
  let folder = '';
  switch (type) {
    case 'image':
      folder = 'images';
      break;
    case 'video':
      folder = 'video';
      break;
    case 'audio':
      folder = 'audio';
      break;
    default:
      folder = `${type}s`;
  }
  // Use a relative path so the assets load correctly in both web and native builds
  // Encode the filename to handle spaces and other characters
  const encodedName = encodeURIComponent(filename);
  return `./assets/TestUserMedia/${folder}/${encodedName}`;
};

// Function to get all available test media
export const getTestUserMedia = () => {
  // This would normally be fetched from a file system or API
  // For now, we'll hardcode the available media files we found in the directory
  
  const images = [
    {
      id: 'img-1',
      type: 'image' as MediaType,
      title: 'ChatGPT Image 1',
      description: 'Generated image from ChatGPT',
      filename: 'ChatGPT Image Mar 30, 2025, 11_05_45 PM.png',
      size: '2.1 MB',
      dimensions: { width: 1024, height: 1024 },
      tags: ['ai', 'generated'],
      createdAt: '2025-03-30T23:05:45Z',
      updatedAt: '2025-03-30T23:05:45Z',
    },
    {
      id: 'img-2',
      type: 'image' as MediaType,
      title: 'ChatGPT Image 2',
      description: 'Generated image from ChatGPT',
      filename: 'ChatGPT Image Mar 30, 2025, 11_10_35 PM.png',
      size: '2.2 MB',
      dimensions: { width: 1024, height: 1024 },
      tags: ['ai', 'generated'],
      createdAt: '2025-03-30T23:10:35Z',
      updatedAt: '2025-03-30T23:10:35Z',
    },
    {
      id: 'img-3',
      type: 'image' as MediaType,
      title: 'ChatGPT Image 3',
      description: 'Generated image from ChatGPT',
      filename: 'ChatGPT Image Mar 30, 2025, 11_22_32 PM.png',
      size: '2.3 MB',
      dimensions: { width: 1024, height: 1024 },
      tags: ['ai', 'generated'],
      createdAt: '2025-03-30T23:22:32Z',
      updatedAt: '2025-03-30T23:22:32Z',
    },
    {
      id: 'img-4',
      type: 'image' as MediaType,
      title: 'Gen4 Young Man',
      description: 'A young man wearing a black tactical suit',
      filename: 'Gen4 A young man wearing a black tactical suit with red trim standing tall in front of a gr 26864226.png',
      size: '1.7 MB',
      dimensions: { width: 1024, height: 1024 },
      tags: ['ai', 'generated', 'portrait'],
      createdAt: '2025-05-11T21:27:00Z',
      updatedAt: '2025-05-11T21:27:00Z',
    },
    {
      id: 'img-5',
      type: 'image' as MediaType,
      title: 'Gen4 Young Woman',
      description: 'A young woman standing tall with her hands on her hips',
      filename: 'Gen4 A young woman IMG_1 IMG_2  standing tall with her hands on her   hips, her athletic fier 26426329.png',
      size: '1.4 MB',
      dimensions: { width: 1024, height: 1024 },
      tags: ['ai', 'generated', 'portrait'],
      createdAt: '2025-05-11T21:21:00Z',
      updatedAt: '2025-05-11T21:21:00Z',
    }
  ];

  const videos = [
    {
      id: 'vid-1',
      type: 'video' as MediaType,
      title: 'Streamer Laughing',
      description: 'A streamer laughing',
      filename: '2025-03-28T13-33-25_a_streamer_laughing.mp4',
      size: '2.9 MB',
      dimensions: { width: 640, height: 480 },
      duration: 15,
      tags: ['streamer', 'laughing'],
      createdAt: '2025-03-28T13:33:25Z',
      updatedAt: '2025-03-28T13:33:25Z',
    }
  ];

  const audio = [
    {
      id: 'aud-1',
      type: 'audio' as MediaType,
      title: 'Medusa',
      description: 'Medusa audio track',
      filename: 'Medusa.mp3',
      size: '4.1 MB',
      duration: 180,
      tags: ['music', 'track'],
      createdAt: '2025-05-21T00:27:00Z',
      updatedAt: '2025-05-21T00:27:00Z',
    }
  ];

  // Combine all media types
  return [...images, ...videos, ...audio].map(item => ({
    ...item,
    url: getTestUserMediaUrl(item.type, item.filename),
    thumbnail: item.type === 'image' 
      ? getTestUserMediaUrl('image', item.filename) 
      : item.type === 'video'
        ? getTestUserMediaUrl('video', item.filename)
        : '/assets/images/audio-placeholder.png',
    permissions: {
      genGuard: false,
      datasetReuse: true,
      contentWarnings: {
        suggestive: false,
        political: false,
        violent: false,
        nudity: false,
      },
    },
  }));
};

// Function to get a specific media item by ID
export const getTestUserMediaById = (id: string) => {
  const allMedia = getTestUserMedia();

  // Support legacy IDs used in mock scape data
  let lookupId = id;
  if (id.startsWith('media-')) {
    lookupId = `img-${id.split('-')[1]}`;
  } else if (id.startsWith('audio-')) {
    lookupId = `aud-${id.split('-')[1]}`;
  } else if (id.startsWith('video-')) {
    lookupId = `vid-${id.split('-')[1]}`;
  }

  return allMedia.find(item => item.id === lookupId) || null;
};
