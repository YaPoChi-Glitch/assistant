export type EntryType = 'task' | 'idea' | 'purchase';

export type Entry = {
  id: string;
  text: string;
  type: EntryType;
  done: boolean;
  // Время создания в миллисекундах (Date.now()) — так проще хранить в JSON и сортировать
  createdAt: number;
};

export const ENTRY_TYPE_LABELS: Record<EntryType, string> = {
  task: 'Задача',
  idea: 'Идея',
  purchase: 'Покупка',
};
