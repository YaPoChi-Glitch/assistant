import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Entry } from '@/types';

// Весь доступ к хранилищу собран здесь: чтобы перейти на сервер,
// достаточно переписать эти две функции, экран менять не придётся.

const STORAGE_KEY = 'entries';

export async function loadEntries(): Promise<Entry[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? (JSON.parse(json) as Entry[]) : [];
  } catch (error) {
    console.warn('Не удалось загрузить записи', error);
    return [];
  }
}

export async function saveEntries(entries: Entry[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.warn('Не удалось сохранить записи', error);
  }
}
