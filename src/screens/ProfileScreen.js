import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Card, Text, Avatar, Divider } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import useAuthStore from "../store/authStore";
import { appTheme } from "../theme/simpleTheme";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Kullanıcı bilgilerini authStore'dan al
  const userInfo = {
    name: user?.displayName || user?.full_name || "Kullanıcı",
    email: user?.email || "",
    age: user?.age || "-",
    gender: user?.gender || "-",
    height: user?.height_cm || user?.height || "-",
    weight: user?.current_weight_kg || user?.weight || "-",
    activity: user?.activity_level || user?.activityLevel || "-",
    goal: user?.health_goal || user?.goal || "-",
  };

  // Logout handler
  const handleLogout = () => {
    Alert.alert(
      "🚪 Çıkış Yap",
      "Hesabınızdan çıkmak istediğinizden emin misiniz?",
      [
        {
          text: "İptal",
          style: "cancel",
        },
        {
          text: "Çıkış Yap",
          style: "destructive",
          onPress: async () => {
            setIsLoggingOut(true);
            const result = await logout();

            if (result.success) {
              // Navigation will be handled automatically by App.js auth state
              console.log("✅ Logged out, redirecting to login...");
            } else {
              Alert.alert("Hata", "Çıkış yapılamadı. Lütfen tekrar deneyin.");
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  // Activity level türkçeleştir
  const getActivityLabel = (activity) => {
    const labels = {
      sedentary: "Hareketsiz",
      lightly_active: "Az Aktif",
      moderately_active: "Orta Aktif",
      very_active: "Çok Aktif",
      extra_active: "Ekstra Aktif",
      moderate: "Orta Aktif",
    };
    return labels[activity] || activity || "Belirlenmedi";
  };

  // Health goal türkçeleştir
  const getGoalLabel = (goal) => {
    const labels = {
      lose_weight: "Kilo Verme",
      gain_muscle: "Kas Kazanma",
      maintain: "Kilo Koruma",
      general_health: "Genel Sağlık",
    };
    return labels[goal] || goal || "Belirlenmedi";
  };

  return (
    <LinearGradient
      colors={[appTheme.colors.primary, "#fff"]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.3 }}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Avatar.Icon
              icon="account-circle"
              size={100}
              style={styles.avatar}
              color="#fff"
            />
          </View>
          <Text style={styles.userName}>{userInfo.name}</Text>
          <Text style={styles.userEmail}>{userInfo.email}</Text>
        </View>

        {/* Profile Info Card */}
        <Card style={styles.card} elevation={3}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="information-circle"
                size={24}
                color={appTheme.colors.primary}
              />
              <Text style={styles.sectionTitle}>Profil Bilgileri</Text>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Ionicons name="body" size={20} color="#666" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Boy</Text>
                  <Text style={styles.infoValue}>{userInfo.height} cm</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="fitness" size={20} color="#666" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Kilo</Text>
                  <Text style={styles.infoValue}>{userInfo.weight} kg</Text>
                </View>
              </View>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Ionicons name="calendar" size={20} color="#666" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Yaş</Text>
                  <Text style={styles.infoValue}>{userInfo.age} yaş</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="male-female" size={20} color="#666" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Cinsiyet</Text>
                  <Text style={styles.infoValue}>{userInfo.gender}</Text>
                </View>
              </View>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.fullWidthInfo}>
              <Ionicons name="walk" size={20} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Aktivite Seviyesi</Text>
                <Text style={styles.infoValue}>
                  {getActivityLabel(userInfo.activity)}
                </Text>
              </View>
            </View>

            <View style={styles.fullWidthInfo}>
              <Ionicons name="flag" size={20} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Hedef</Text>
                <Text style={styles.infoValue}>
                  {getGoalLabel(userInfo.goal)}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Settings Card */}
        <Card style={styles.card} elevation={3}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="settings"
                size={24}
                color={appTheme.colors.primary}
              />
              <Text style={styles.sectionTitle}>Ayarlar</Text>
            </View>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate("ProfileSetup")}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name="create"
                  size={22}
                  color={appTheme.colors.primary}
                />
                <Text style={styles.menuItemText}>Profili Düzenle</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#999" />
            </TouchableOpacity>

            <Divider style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() =>
                Alert.alert(
                  "Bildirimler",
                  "Bildirim ayarları yakında eklenecek!"
                )
              }
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name="notifications" size={22} color="#FFC107" />
                <Text style={styles.menuItemText}>Bildirimler</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#999" />
            </TouchableOpacity>

            <Divider style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() =>
                Alert.alert("Gizlilik", "Gizlilik ayarları yakında eklenecek!")
              }
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name="shield-checkmark" size={22} color="#4CAF50" />
                <Text style={styles.menuItemText}>Gizlilik ve Güvenlik</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#999" />
            </TouchableOpacity>

            <Divider style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() =>
                Alert.alert(
                  "Hakkında",
                  "MyFitApp v1.0.0\n\nKapsamlı fitness ve beslenme takip uygulaması."
                )
              }
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name="information-circle" size={22} color="#2196F3" />
                <Text style={styles.menuItemText}>Hakkında</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#999" />
            </TouchableOpacity>
          </Card.Content>
        </Card>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={isLoggingOut}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out" size={22} color="#fff" />
          <Text style={styles.logoutText}>
            {isLoggingOut ? "Çıkış Yapılıyor..." : "Çıkış Yap"}
          </Text>
        </TouchableOpacity>

        {/* App Info */}
        <Text style={styles.appVersion}>MyFitApp v1.0.0</Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    paddingBottom: 40,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatar: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  userName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  userEmail: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
    textAlign: "center",
  },
  card: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginLeft: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  infoItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  fullWidthInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  divider: {
    marginVertical: 12,
    backgroundColor: "#f0f0f0",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 16,
    fontWeight: "500",
  },
  menuDivider: {
    marginVertical: 4,
    backgroundColor: "#f0f0f0",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff4444",
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#ff4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  appVersion: {
    textAlign: "center",
    fontSize: 12,
    color: "#999",
    marginTop: 8,
    marginBottom: 20,
  },
});
