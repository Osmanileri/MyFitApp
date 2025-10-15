import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const mockWeightData = [
  { date: "2024-06-01", weight: 80 },
  { date: "2024-06-10", weight: 78.5 },
  { date: "2024-06-20", weight: 77.8 },
  { date: "2024-07-01", weight: 77.2 },
  { date: "2024-07-10", weight: 76.8 },
];

const mockMeasurements = [
  { type: "Bel", value: 85, date: "2024-06-01" },
  { type: "Bel", value: 83, date: "2024-06-20" },
  { type: "Kol", value: 34, date: "2024-06-01" },
  { type: "Kol", value: 35, date: "2024-07-01" },
];

const mockPhotos = [
  { uri: "https://via.placeholder.com/120x160", date: "2024-06-01" },
  { uri: "https://via.placeholder.com/120x160", date: "2024-07-01" },
];

export default function ProgressDashboardScreen({ navigation }) {
  const [range, setRange] = useState("month"); // 'week' | 'month' | 'quarter'

  const summary = useMemo(() => {
    if (mockWeightData.length < 2) return { start: 0, end: 0, diff: 0 };
    const start = mockWeightData[0].weight;
    const end = mockWeightData[mockWeightData.length - 1].weight;
    return { start, end, diff: +(end - start).toFixed(1) };
  }, []);

  const FilterChip = ({ label, value }) => {
    const active = range === value;
    return (
      <TouchableOpacity
        onPress={() => setRange(value)}
        style={[styles.chip, active && styles.chipActive]}
      >
        <Text style={[styles.chipText, active && styles.chipTextActive]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>İlerleme</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("ProgressHistory")}
            style={styles.headerAction}
          >
            <Ionicons name="time" size={18} color="#fff" />
            <Text style={styles.headerActionText}>Geçmiş</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.filterRow}>
          <FilterChip label="Hafta" value="week" />
          <FilterChip label="Ay" value="month" />
          <FilterChip label="3 Ay" value="quarter" />
        </View>
      </LinearGradient>

      <FlatList
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* Summary Cards */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <View style={styles.statIconCircle}>
                  <Ionicons name="speedometer" size={18} color="#fff" />
                </View>
                <Text style={styles.statLabel}>Kilo Değişimi</Text>
                <Text
                  style={[
                    styles.statValue,
                    { color: summary.diff <= 0 ? "#22c55e" : "#ef4444" },
                  ]}
                >
                  {summary.diff > 0 ? `+${summary.diff}` : `${summary.diff}`} kg
                </Text>
              </View>
              <View style={styles.statCard}>
                <View
                  style={[
                    styles.statIconCircle,
                    { backgroundColor: "#f59e0b" },
                  ]}
                >
                  <Ionicons name="barbell" size={18} color="#fff" />
                </View>
                <Text style={styles.statLabel}>Haftalık Antrenman</Text>
                <Text style={styles.statValue}>4 kez</Text>
              </View>
              <View style={styles.statCard}>
                <View
                  style={[
                    styles.statIconCircle,
                    { backgroundColor: "#0ea5e9" },
                  ]}
                >
                  <Ionicons name="trophy" size={18} color="#fff" />
                </View>
                <Text style={styles.statLabel}>Süreklilik</Text>
                <Text style={styles.statValue}>78%</Text>
              </View>
            </View>

            {/* Weight Trend (cards) */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Kilo Trendi</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("AddWeight")}
                  style={styles.sectionCta}
                >
                  <Ionicons name="add-circle" size={18} color="#fff" />
                  <Text style={styles.sectionCtaText}>Kilo Ekle</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={mockWeightData}
                keyExtractor={(item) => item.date}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View style={styles.weightCard}>
                    <Text style={styles.weightValue}>{item.weight} kg</Text>
                    <Text style={styles.weightDate}>{item.date}</Text>
                  </View>
                )}
                style={{ marginTop: 6 }}
              />
            </View>

            {/* Measurements */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Vücut Ölçüleri</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("AddMeasurement")}
                  style={[styles.sectionCta, { backgroundColor: "#10b981" }]}
                >
                  <Ionicons name="create" size={16} color="#fff" />
                  <Text style={styles.sectionCtaText}>Ölçü Ekle</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={mockMeasurements}
                keyExtractor={(item) => item.type + item.date}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View style={styles.measureCard}>
                    <Text style={styles.measureType}>{item.type}</Text>
                    <Text style={styles.measureValue}>{item.value} cm</Text>
                    <Text style={styles.measureDate}>{item.date}</Text>
                  </View>
                )}
                style={{ marginTop: 6 }}
              />
            </View>

            {/* Photo Progress */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Fotoğraf Karşılaştırma</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("PhotoProgress")}
                  style={[styles.sectionCta, { backgroundColor: "#3b82f6" }]}
                >
                  <Ionicons name="images" size={16} color="#fff" />
                  <Text style={styles.sectionCtaText}>Fotoğraf Ekle</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.photoRow}>
                {mockPhotos.map((p) => (
                  <View key={p.date} style={styles.photoCard}>
                    <Image source={{ uri: p.uri }} style={styles.photo} />
                    <Text style={styles.photoDate}>{p.date}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        }
        data={[]}
        renderItem={null}
        ListFooterComponent={<View style={{ height: 12 }} />}
      />

      {/* Bottom primary actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: "#22c55e" }]}
          onPress={() => navigation.navigate("AddWeight")}
        >
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.primaryButtonText}>Ağırlık Ekle</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: "#8b5cf6" }]}
          onPress={() => navigation.navigate("AddMeasurement")}
        >
          <Ionicons name="create" size={18} color="#fff" />
          <Text style={styles.primaryButtonText}>Ölçü Ekle</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  headerAction: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
  },
  headerActionText: { color: "#fff", fontWeight: "600", marginLeft: 6 },
  filterRow: { flexDirection: "row", marginTop: 12, gap: 8 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 16,
  },
  chipActive: { backgroundColor: "#fff" },
  chipText: { color: "#fff", fontWeight: "600" },
  chipTextActive: { color: "#4f46e5" },
  listContent: { padding: 20, paddingBottom: 100 },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  statIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statLabel: { fontSize: 12, color: "#64748B", fontWeight: "600" },
  statValue: {
    fontSize: 18,
    color: "#0F172A",
    fontWeight: "800",
    marginTop: 4,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#0F172A" },
  sectionCta: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#7c3aed",
    borderRadius: 12,
  },
  sectionCtaText: { color: "#fff", fontWeight: "700", marginLeft: 6 },
  weightCard: {
    backgroundColor: "#EEF2FF",
    borderRadius: 12,
    padding: 12,
    marginRight: 10,
    alignItems: "center",
    minWidth: 110,
  },
  weightValue: { fontSize: 18, fontWeight: "700", color: "#4338CA" },
  weightDate: { fontSize: 12, color: "#64748B", marginTop: 4 },
  measureCard: {
    backgroundColor: "#ECFDF5",
    borderRadius: 12,
    padding: 12,
    marginRight: 10,
    alignItems: "center",
    minWidth: 110,
  },
  measureType: { fontSize: 14, fontWeight: "700", color: "#065F46" },
  measureValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#047857",
    marginTop: 2,
  },
  measureDate: { fontSize: 12, color: "#64748B", marginTop: 2 },
  photoRow: { flexDirection: "row", gap: 12 },
  photoCard: { alignItems: "center" },
  photo: {
    width: 120,
    height: 160,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
  },
  photoDate: { fontSize: 12, color: "#64748B", marginTop: 6 },
  bottomActions: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 20,
    flexDirection: "row",
    gap: 10,
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 8,
    fontSize: 14,
  },
});
