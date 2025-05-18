import * as FileSystem from 'expo-file-system';
import { Scape } from '@/types/Scape';

const BASE_DIR = FileSystem.documentDirectory + 'genscape/';

export const initUserStorage = async (userId: string) => {
  const userDir = BASE_DIR + userId + '/';
  const scapeDir = userDir + 'scapes/';
  const contentDir = userDir + 'content/';

  await FileSystem.makeDirectoryAsync(scapeDir, { intermediates: true }).catch(() => {});
  await FileSystem.makeDirectoryAsync(contentDir, { intermediates: true }).catch(() => {});

  return { userDir, scapeDir, contentDir };
};

export const saveScapeToFile = async (userId: string, scape: Scape) => {
  const { scapeDir } = await initUserStorage(userId);
  const filePath = scapeDir + `${scape.id}.json`;
  await FileSystem.writeAsStringAsync(filePath, JSON.stringify(scape));
};

export const loadScapeFromFile = async (userId: string, scapeId: string): Promise<Scape | null> => {
  const { scapeDir } = await initUserStorage(userId);
  const filePath = scapeDir + `${scapeId}.json`;
  try {
    const content = await FileSystem.readAsStringAsync(filePath);
    return JSON.parse(content);
  } catch {
    return null;
  }
};

export const listUserScapes = async (userId: string): Promise<Scape[]> => {
  const { scapeDir } = await initUserStorage(userId);
  try {
    const files = await FileSystem.readDirectoryAsync(scapeDir);
    const scapes: Scape[] = [];
    for (const fileName of files) {
      if (fileName.endsWith('.json')) {
        const content = await FileSystem.readAsStringAsync(scapeDir + fileName);
        scapes.push(JSON.parse(content));
      }
    }
    return scapes;
  } catch {
    return [];
  }
};
