import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList } from 'react-native';
import { colors, typography, spacing } from '../../theme';
import Card from '../../components/ui/Card';

export default function Search() {
  const [query, setQuery] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Buscar</Text>
        <TextInput style={styles.input} placeholder="Línea, parada, destino..." value={query} onChangeText={setQuery} placeholderTextColor={colors.textSecondary} />
      </View>
      {query.length > 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Resultados aparecerán aquí</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 60 },
  header: { paddingHorizontal: spacing.xl, marginBottom: spacing.md },
  title: { fontSize: 28, fontWeight: '700', marginBottom: spacing.md, letterSpacing: -0.5 },
  input: { height: 44, backgroundColor: colors.grayLight, borderRadius: 14, paddingHorizontal: spacing.lg, fontSize: 15, color: colors.textPrimary },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { ...typography.caption },
});
