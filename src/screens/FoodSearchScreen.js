import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Dimensions,
  Animated,
  Platform,
  Text as RNText,
} from "react-native";
import {
  Text,
  TextInput,
  Surface,
  ActivityIndicator,
  Divider,
  Card,
  Chip,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useDebounce } from "../hooks/useDebounce";
import fatSecretAPI from "../services/fatSecretAPI";
// Using FatSecret API exclusively for food data
import * as Haptics from "expo-haptics";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// 🎨 DARK THEME COLOR PALETTE
const colors = {
  background: "#0a0a0a",
  surface: "#1a1a1a",
  surfaceVariant: "#2a2a2a",
  primary: "#00d4aa",
  primaryVariant: "#00c49c",
  secondary: "#03dac6",
  text: "#ffffff",
  textSecondary: "#b3b3b3",
  textTertiary: "#808080",
  accent: "#bb86fc",
  success: "#4caf50",
  warning: "#ff9800",
  error: "#f44336",
  calories: "#ff6b6b",
  protein: "#4ecdc4",
  carbs: "#ffe66d",
  fat: "#ff8b94",
  border: "#333333",
  headerGradient: ["#1a1a1a", "#0a0a0a"],
};

// 🍽️ MEAL TYPE INFO (English)
const MEAL_TYPES = {
  breakfast: { emoji: "🌅", label: "Breakfast", time: "Tuesday, Jul 8" },
  lunch: { emoji: "☀️", label: "Lunch", time: "Tuesday, Jul 8" },
  dinner: { emoji: "🌙", label: "Dinner", time: "Tuesday, Jul 8" },
  snacks: { emoji: "🍎", label: "Snacks", time: "Tuesday, Jul 8" },
};

// 📱 TAB OPTIONS (English)
const SEARCH_TABS = [
  { id: "foods", label: "FOODS", icon: "silverware-fork-knife" },
];

// 🥗 EXAMPLE SUGGESTIONS (English)
const POPULAR_SEARCH_ITEMS = [];

const FoodSearchScreen = ({ navigation, route }) => {
  const { mealType = "breakfast" } = route.params || {};

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("foods");
  const [selectedFood, setSelectedFood] = useState(null);
  const [customAmount, setCustomAmount] = useState("100");
  const [isLoading, setIsLoading] = useState(false);
  const [apiResults, setApiResults] = useState([]);
  const [apiLoading, setApiLoading] = useState(false);

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

  // Debounced search for better performance
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Get meal info
  const mealInfo = MEAL_TYPES[mealType] || MEAL_TYPES.breakfast;

  // Suggestions when not searching (English examples)
  const searchResults = useMemo(() => {
    return [];
  }, [debouncedSearch, activeTab]);

  // Fetch FatSecret API results when user types a query
  useEffect(() => {
    let isCancelled = false;
    const run = async () => {
      const q = debouncedSearch.trim();
      if (q.length < 2) {
        setApiResults([]);
        setApiLoading(false);
        return;
      }
      try {
        setApiLoading(true);
        console.log("🔍 Searching for:", q);
        const response = await fatSecretAPI.searchFoods(q, 20);
        console.log("✅ API Response:", JSON.stringify(response, null, 2));
        if (!isCancelled) {
          if (response.success && response.data) {
            console.log("📊 Results count:", response.data.length);
            console.log("📋 First result:", response.data[0]);
            setApiResults(response.data);
          } else {
            console.log("❌ No success or data in response");
            setApiResults([]);
          }
        }
      } catch (e) {
        console.error("❌ FatSecret search error:", e);
        if (!isCancelled) setApiResults([]);
      } finally {
        if (!isCancelled) setApiLoading(false);
      }
    };
    run();
    return () => {
      isCancelled = true;
    };
  }, [debouncedSearch]);

  // Animation effects
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Handle selection for suggestion items (strings)
  const handleFoodSelectLocal = async (foodName) => {
    try {
      if (Haptics?.impactAsync) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      setSearchQuery(foodName);
    } catch (error) {
      console.error("Food selection error:", error);
      Alert.alert("Error", "There was a problem selecting the food.");
    }
  };

  // Confirm selection for FatSecret API item
  const confirmApiSelection = async () => {
    if (!selectedFood) return;
    const amountNumber = parseFloat(customAmount) || 100;

    // Fetch precise serving details from FatSecret API
    const buildPayload = (base) => ({
      id: selectedFood.id,
      name: selectedFood.name,
      amount: amountNumber,
      unit: "g",
      calories: Math.round((base.calories || 0) * (amountNumber / 100)),
      protein: Math.round((base.protein || 0) * (amountNumber / 100) * 10) / 10,
      carbs: Math.round((base.carbs || 0) * (amountNumber / 100) * 10) / 10,
      fat: Math.round((base.fat || 0) * (amountNumber / 100) * 10) / 10,
      fiber: Math.round((base.fiber || 0) * (amountNumber / 100) * 10) / 10,
      sugar: 0,
      sodium: 0,
      source: "fatsecret",
    });

    let payload;
    try {
      // Get detailed info from FatSecret API
      const detailed = await fatSecretAPI.getFoodById(selectedFood.id);
      payload = buildPayload(detailed || selectedFood);
    } catch (error) {
      console.error("Error fetching food details:", error);
      payload = buildPayload(selectedFood);
    }

    const onFoodSelected = route.params?.onFoodSelected;
    if (typeof onFoodSelected === "function") {
      onFoodSelected(payload);
    }
    navigation.goBack();
  };

  // Handle camera action
  const handleCameraPress = () => {
    Alert.alert(
      "📸 Kamera",
      "Kamera ile besin ekleme özelliği yakında eklenecek!",
      [{ text: "Tamam" }]
    );
  };

  // Handle barcode scanner
  const handleBarcodePress = () => {
    Alert.alert(
      "🔍 Barkod Tarayıcı",
      "Barkod tarama özelliği yakında eklenecek!",
      [{ text: "Tamam" }]
    );
  };

  // Render header with meal info
  const renderHeader = () => (
    <LinearGradient colors={colors.headerGradient} style={styles.header}>
      <SafeAreaView>
        <Animated.View
          style={[
            styles.headerContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Top Row */}
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>

            <View style={styles.mealInfo}>
              <View style={styles.mealHeader}>
                <Text style={styles.mealEmoji}>{mealInfo.emoji}</Text>
                <View>
                  <Text style={styles.mealTitle}>{mealInfo.label}</Text>
                  <Text style={styles.mealTime}>{mealInfo.time}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.cancelText}>İptal</Text>
            </TouchableOpacity>
          </View>

          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            {SEARCH_TABS.map((tab, index) => (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tab, activeTab === tab.id && styles.activeTab]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab.id && styles.activeTabText,
                  ]}
                >
                  {tab.label}
                </Text>
                {activeTab === tab.id && <View style={styles.tabIndicator} />}
              </TouchableOpacity>
            ))}
          </View>

          {/* Search Bar */}
          <Animated.View
            style={[
              styles.searchContainer,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: Animated.add(slideAnim, new Animated.Value(10)),
                  },
                ],
              },
            ]}
          >
            <View style={styles.searchInputContainer}>
              <MaterialCommunityIcons
                name="magnify"
                size={20}
                color={colors.textTertiary}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Bir Yemek Ara"
                placeholderTextColor={colors.textTertiary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                mode="flat"
                underlineColor="transparent"
                activeUnderlineColor="transparent"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => setSearchQuery("")}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={20}
                    color={colors.textTertiary}
                  />
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );

  // Render food item (supports string suggestions and API result objects)
  const renderFoodItem = ({ item, index }) => {
    const isStringItem = typeof item === "string";
    const title = isStringItem ? item : item.name;
    const subtitle = isStringItem
      ? ""
      : `Calories: ${Math.round(item.calories || 0)} • P ${
          item.protein || 0
        }g • C ${item.carbs || 0}g • F ${item.fat || 0}g`;
    const onPress = () => {
      if (isStringItem) {
        handleFoodSelectLocal(item);
      } else {
        setSelectedFood(item);
      }
    };

    return (
      <Animated.View
        style={[
          styles.foodItemContainer,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: Animated.add(
                  slideAnim,
                  new Animated.Value(index * 2)
                ),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.foodItem}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <View style={styles.foodItemContent}>
            <View style={{ flex: 1 }}>
              <Text style={styles.foodName}>{title}</Text>
              {!isStringItem && (
                <Text style={styles.foodSubtitle}>{subtitle}</Text>
              )}
            </View>
            {!isStringItem && (
              <Chip
                mode="outlined"
                textStyle={{ color: colors.textSecondary }}
                style={{ borderColor: colors.border }}
              >
                FatSecret
              </Chip>
            )}
            {isStringItem && (
              <MaterialCommunityIcons
                name="arrow-up-right"
                size={20}
                color={colors.textTertiary}
              />
            )}
          </View>
          <View style={styles.foodItemBorder} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Render bottom action bar
  const renderBottomActions = () => (
    <Animated.View
      style={[
        styles.bottomActions,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: Animated.multiply(slideAnim, new Animated.Value(-1)),
            },
          ],
        },
      ]}
    >
      <Surface style={styles.actionBar} elevation={8}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleCameraPress}
        >
          <View
            style={[
              styles.actionIcon,
              { backgroundColor: colors.primary + "20" },
            ]}
          >
            <MaterialCommunityIcons
              name="camera"
              size={24}
              color={colors.primary}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleBarcodePress}
        >
          <View
            style={[
              styles.actionIcon,
              { backgroundColor: colors.accent + "20" },
            ]}
          >
            <MaterialCommunityIcons
              name="line-scan"
              size={24}
              color={colors.accent}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleBarcodePress}
        >
          <View
            style={[
              styles.actionIcon,
              { backgroundColor: colors.primary + "20" },
            ]}
          >
            <MaterialCommunityIcons
              name="barcode-scan"
              size={24}
              color={colors.primary}
            />
          </View>
        </TouchableOpacity>
      </Surface>
    </Animated.View>
  );

  // Render empty state
  const renderEmptyState = () => (
    <Animated.View
      style={[
        styles.emptyState,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <MaterialCommunityIcons
        name="food-off"
        size={64}
        color={colors.textTertiary}
      />
      <Text style={styles.emptyStateText}>
        {searchQuery ? "No results found" : "Explore popular foods"}
      </Text>
      <Text style={styles.emptyStateSubtext}>
        {searchQuery ? "Try different keywords" : "Search or use camera"}
      </Text>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.background}
        translucent={false}
      />

      {/* Header */}
      {renderHeader()}

      {/* Content */}
      <View style={styles.content}>
        <FlatList
          data={debouncedSearch.trim().length >= 2 ? apiResults : searchResults}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={renderFoodItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.foodList}
          ListEmptyComponent={renderEmptyState}
          initialNumToRender={15}
          maxToRenderPerBatch={10}
          windowSize={10}
        />
        {apiLoading && (
          <View style={{ padding: 16, alignItems: "center" }}>
            <ActivityIndicator />
          </View>
        )}
      </View>

      {/* Bottom Actions */}
      {renderBottomActions()}

      {/* Selection Panel for FatSecret item */}
      {selectedFood && (
        <View style={styles.selectionPanel}>
          <View style={styles.selectionHeader}>
            <Text style={styles.selectionTitle}>{selectedFood.name}</Text>
            <Text style={styles.selectionBrand}>
              FatSecret • {selectedFood.portion || "100g"}
            </Text>
          </View>

          <View style={styles.portionContainer}>
            <Text style={styles.portionLabel}>Miktar</Text>
            <View style={styles.portionInput}>
              <TextInput
                style={styles.portionTextInput}
                value={customAmount}
                onChangeText={setCustomAmount}
                keyboardType="numeric"
                underlineColor="transparent"
              />
              <Text style={styles.portionUnit}>g</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={confirmApiSelection}
          >
            <Text style={styles.confirmButtonText}>Ekle</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header Styles
  header: {
    paddingTop: Platform.OS === "ios" ? 0 : 0,
    paddingBottom: 20,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceVariant,
    alignItems: "center",
    justifyContent: "center",
  },
  mealInfo: {
    flex: 1,
    alignItems: "center",
  },
  mealHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  mealEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  mealTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },
  mealTime: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cancelText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "600",
  },

  // Tab Styles
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    position: "relative",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  activeTabText: {
    color: colors.text,
  },
  tabIndicator: {
    position: "absolute",
    bottom: -1,
    height: 2,
    width: "100%",
    backgroundColor: colors.primary,
  },

  // Search Styles
  searchContainer: {
    marginBottom: 8,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    backgroundColor: "transparent",
  },
  clearButton: {
    padding: 4,
  },

  // Content Styles
  content: {
    flex: 1,
  },
  foodList: {
    paddingTop: 16,
  },
  foodItemContainer: {
    marginHorizontal: 20,
  },
  foodItem: {
    paddingVertical: 16,
  },
  foodItemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  foodName: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  foodSubtitle: {
    marginTop: 6,
    fontSize: 12,
    color: colors.textSecondary,
  },
  foodItemBorder: {
    height: 1,
    backgroundColor: colors.border,
    marginTop: 16,
  },

  // Bottom Actions Styles
  bottomActions: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  actionBar: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButton: {
    marginHorizontal: 8,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  // Empty State Styles
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
  // Selection panel styles
  selectionPanel: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 16,
  },
  selectionHeader: {
    marginBottom: 12,
  },
  selectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  selectionBrand: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  portionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  portionLabel: {
    fontSize: 14,
    color: colors.text,
    marginRight: 12,
  },
  portionInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  portionTextInput: {
    flex: 0,
    minWidth: 70,
    fontSize: 16,
    color: colors.text,
    backgroundColor: "transparent",
    textAlign: "center",
    marginRight: 8,
  },
  portionUnit: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default FoodSearchScreen;
