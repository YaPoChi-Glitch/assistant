import { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { loadEntries, saveEntries } from '@/storage';
import { ENTRY_TYPE_LABELS, type Entry, type EntryType } from '@/types';

const ENTRY_TYPES = Object.keys(ENTRY_TYPE_LABELS) as EntryType[];

const colors = {
  background: '#121212',
  surface: '#1E1E1E',
  border: '#2C2C2C',
  text: '#F2F2F2',
  muted: '#8A8A8A',
  accent: '#4C8DFF',
};

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function HomeScreen() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [text, setText] = useState('');
  const [type, setType] = useState<EntryType>('task');

  useEffect(() => {
    loadEntries().then(setEntries);
  }, []);

  function updateEntries(next: Entry[]) {
    setEntries(next);
    saveEntries(next);
  }

  function addEntry() {
    const trimmed = text.trim();
    if (!trimmed) return;
    const entry: Entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      text: trimmed,
      type,
      done: false,
      createdAt: Date.now(),
    };
    // Новая запись идёт в начало массива — поэтому новые всегда сверху
    updateEntries([entry, ...entries]);
    setText('');
  }

  function toggleDone(id: string) {
    updateEntries(entries.map((e) => (e.id === id ? { ...e, done: !e.done } : e)));
  }

  function confirmDelete(entry: Entry) {
    Alert.alert('Удалить запись?', entry.text, [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: () => updateEntries(entries.filter((e) => e.id !== entry.id)),
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Записать мысль…"
          placeholderTextColor={colors.muted}
          onSubmitEditing={addEntry}
          returnKeyType="done"
        />
        <Pressable
          style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
          onPress={addEntry}>
          <Text style={styles.addButtonText}>Добавить</Text>
        </Pressable>
      </View>

      <View style={styles.typeRow}>
        {ENTRY_TYPES.map((t) => (
          <Pressable
            key={t}
            style={[styles.typeChip, t === type && styles.typeChipActive]}
            onPress={() => setType(t)}>
            <Text style={[styles.typeChipText, t === type && styles.typeChipTextActive]}>
              {ENTRY_TYPE_LABELS[t]}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={<Text style={styles.empty}>Пока нет записей</Text>}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.item, pressed && styles.pressed]}
            onPress={() => toggleDone(item.id)}
            onLongPress={() => confirmDelete(item)}>
            <Text style={[styles.itemText, item.done && styles.itemTextDone]}>{item.text}</Text>
            <Text style={styles.itemMeta}>
              {ENTRY_TYPE_LABELS[item.type]} · {formatDate(item.createdAt)}
            </Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    marginBottom: 8,
  },
  typeChip: {
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  typeChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  typeChipText: {
    color: colors.muted,
    fontSize: 14,
  },
  typeChipTextActive: {
    color: '#FFFFFF',
  },
  list: {
    gap: 8,
    paddingVertical: 8,
  },
  item: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 12,
    gap: 4,
  },
  itemText: {
    color: colors.text,
    fontSize: 16,
  },
  itemTextDone: {
    color: colors.muted,
    textDecorationLine: 'line-through',
  },
  itemMeta: {
    color: colors.muted,
    fontSize: 12,
  },
  empty: {
    color: colors.muted,
    textAlign: 'center',
    marginTop: 32,
  },
  pressed: {
    opacity: 0.7,
  },
});
