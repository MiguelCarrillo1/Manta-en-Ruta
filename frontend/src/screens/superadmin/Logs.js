import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { superadminService } from '../../services/superadminService';
import { colors, typography, spacing, borderRadius } from '../../theme';

export default function Logs() {
  const [tab, setTab] = useState('logs');
  const [logs, setLogs] = useState([]);
  const [audit, setAudit] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async (t) => {
    setLoading(true);
    setTab(t);
    try {
      if (t === 'logs') { const r = await superadminService.getLogs(); setLogs(r.data?.data || []); }
      else { const r = await superadminService.getAudit(); setAudit(r.data?.data || []); }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabRow}>
        <TouchableOpacity style={[styles.tab, tab === 'logs' && styles.tabActive]} onPress={() => loadData('logs')}>
          <Text style={[styles.tabText, tab === 'logs' && styles.tabTextActive]}>Logs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'audit' && styles.tabActive]} onPress={() => loadData('audit')}>
          <Text style={[styles.tabText, tab === 'audit' && styles.tabTextActive]}>Auditoría</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 60 }} color="#000" />
      ) : (
        <FlatList
          data={tab === 'logs' ? logs : audit}
          keyExtractor={(item, i) => String(item.id || i)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.empty}>Sin registros</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.action}>{item.action}</Text>
              <Text style={styles.detail}>{item.description || item.details}</Text>
              <Text style={styles.meta}>{item.created_at ? new Date(item.created_at).toLocaleString() : ''}{item.ip_address ? ` · ${item.ip_address}` : ''}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  tabRow: { flexDirection: 'row', paddingHorizontal: spacing.xl, gap: spacing.sm, marginTop: 12, marginBottom: spacing.md },
  tab: { flex: 1, height: 40, borderRadius: 10, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E8E8E8' },
  tabActive: { backgroundColor: '#000', borderColor: '#000' },
  tabText: { fontSize: 14, color: '#666' },
  tabTextActive: { color: '#FFF', fontWeight: '600' },
  list: { paddingHorizontal: spacing.xl, paddingBottom: 30 },
  empty: { textAlign: 'center', marginTop: 60, fontSize: 14, color: '#888' },
  card: { backgroundColor: '#FFF', borderRadius: 14, padding: spacing.lg, marginBottom: spacing.sm, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3 },
  action: { fontSize: 15, fontWeight: '600' },
  detail: { fontSize: 13, color: '#888', marginVertical: spacing.xs },
  meta: { fontSize: 11, color: '#AAA' },
});
