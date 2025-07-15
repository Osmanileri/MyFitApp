import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Surface, Card, Chip, FAB, Portal, Modal, TextInput } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SupplementTrackingScreen() {
  const [supplements, setSupplements] = useState([
    { id: 1, name: 'Vitamin D3', dose: '2000 IU', time: '08:00', taken: true, color: '#ff9800' },
    { id: 2, name: 'Omega-3', dose: '1000mg', time: '12:00', taken: false, color: '#4caf50' },
    { id: 3, name: 'Creatine', dose: '5g', time: '18:00', taken: false, color: '#2196f3' },
    { id: 4, name: 'Protein', dose: '30g', time: '20:00', taken: false, color: '#9c27b0' },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newSupplement, setNewSupplement] = useState({ name: '', dose: '', time: '08:00' });

  const toggleTaken = (id) => {
    setSupplements(prev => prev.map(s => s.id === id ? { ...s, taken: !s.taken } : s));
  };

  const addSupplement = () => {
    if (newSupplement.name && newSupplement.dose) {
      const colors = ['#ff9800', '#4caf50', '#2196f3', '#9c27b0', '#f44336', '#00bcd4'];
      const newItem = {
        id: Date.now(),
        ...newSupplement,
        taken: false,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
      setSupplements(prev => [...prev, newItem]);
      setNewSupplement({ name: '', dose: '', time: '08:00' });
      setModalVisible(false);
    }
  };

  const takenCount = supplements.filter(s => s.taken).length;

  return (
    <LinearGradient colors={['#f3e5f5', '#fff']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Supplement Takibi</Text>
        
        <Surface style={styles.summaryBox} elevation={4}>
          <MaterialCommunityIcons name="pill" size={48} color="#9c27b0" style={{ alignSelf: 'center' }} />
          <Text style={styles.summaryText}>{takenCount} / {supplements.length} Alındı</Text>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${(takenCount / supplements.length) * 100}%` }]} />
          </View>
        </Surface>

        <Text style={styles.sectionTitle}>Günlük Supplementler</Text>
        
        {supplements.map(supplement => (
          <Card key={supplement.id} style={[styles.supplementCard, { borderLeftColor: supplement.color }]} elevation={3}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.supplementInfo}>
                <View style={[styles.colorDot, { backgroundColor: supplement.color }]} />
                <View style={styles.supplementDetails}>
                  <Text style={styles.supplementName}>{supplement.name}</Text>
                  <Text style={styles.supplementDose}>{supplement.dose} • {supplement.time}</Text>
                </View>
              </View>
              <View style={styles.supplementActions}>
                <Chip 
                  icon={supplement.taken ? "check-circle" : "circle-outline"} 
                  style={[styles.statusChip, supplement.taken && styles.takenChip]}
                  onPress={() => toggleTaken(supplement.id)}
                >
                  {supplement.taken ? 'Alındı' : 'Alınmadı'}
                </Chip>
              </View>
            </Card.Content>
          </Card>
        ))}

        <Portal>
          <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modal}>
            <Surface style={styles.modalContent} elevation={8}>
              <Text style={styles.modalTitle}>Yeni Supplement Ekle</Text>
              <TextInput
                label="Supplement Adı"
                value={newSupplement.name}
                onChangeText={(text) => setNewSupplement(prev => ({ ...prev, name: text }))}
                style={styles.modalInput}
              />
              <TextInput
                label="Doz"
                value={newSupplement.dose}
                onChangeText={(text) => setNewSupplement(prev => ({ ...prev, dose: text }))}
                style={styles.modalInput}
              />
              <TextInput
                label="Saat"
                value={newSupplement.time}
                onChangeText={(text) => setNewSupplement(prev => ({ ...prev, time: text }))}
                style={styles.modalInput}
              />
              <View style={styles.modalButtons}>
                <Button mode="outlined" onPress={() => setModalVisible(false)} style={styles.modalBtn}>
                  İptal
                </Button>
                <Button mode="contained" onPress={addSupplement} style={styles.modalBtn}>
                  Ekle
                </Button>
              </View>
            </Surface>
          </Modal>
        </Portal>

        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => setModalVisible(true)}
        />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#9c27b0',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryBox: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  summaryText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9c27b0',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#9c27b0',
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
  },
  supplementCard: {
    marginBottom: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    backgroundColor: '#fff',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  supplementInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  supplementDetails: {
    flex: 1,
  },
  supplementName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  supplementDose: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  supplementActions: {
    marginLeft: 12,
  },
  statusChip: {
    backgroundColor: '#f5f5f5',
  },
  takenChip: {
    backgroundColor: '#e8f5e8',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#9c27b0',
  },
  modal: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalBtn: {
    flex: 1,
    marginHorizontal: 8,
  },
}); 