// 🏋️‍♂️ PROFESSIONAL MUSCLEWIKI CLONE
// Using your custom body assets with precise muscle mapping

import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Text,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Body from "react-native-body-highlighter";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const ProfessionalBodyMap = () => {
  const [currentView, setCurrentView] = useState("front");
  const [selectedMuscle, setSelectedMuscle] = useState(null);

  // Your original muscle names mapped to package names
  const muscleNameMapping = {
    // Your names -> Package names
    traps: "trapezius",
    shoulder: "deltoids",
    "rear-shoulder": "deltoids",
    biceps: "biceps",
    triceps: "triceps",
    chest: "chest",
    oblique: "obliques",
    abdominals: "abs",
    forearms: "forearm",
    quads: "quadriceps",
    hands: "hands",
    calves: "calves",
    calf: "calves",
    glutes: "gluteal",
    hamstring: "hamstring",
    lats: "upper-back",
    lowerback: "lower-back",
    "traps-middle": "trapezius",
  };

  // Your muscle groups with different colors/intensities
  const muscleGroupsData = {
    front: [
      { name: "chest", packageName: "chest", intensity: 1, color: "#FF6B35" },
      { name: "biceps", packageName: "biceps", intensity: 2, color: "#4ECDC4" },
      {
        name: "shoulder",
        packageName: "deltoids",
        intensity: 1,
        color: "#45B7D1",
      },
      {
        name: "abdominals",
        packageName: "abs",
        intensity: 3,
        color: "#96CEB4",
      },
      {
        name: "forearms",
        packageName: "forearm",
        intensity: 1,
        color: "#FFEAA7",
      },
      {
        name: "quads",
        packageName: "quadriceps",
        intensity: 2,
        color: "#DDA0DD",
      },
      { name: "calves", packageName: "calves", intensity: 1, color: "#98D8C8" },
      {
        name: "traps",
        packageName: "trapezius",
        intensity: 1,
        color: "#F7DC6F",
      },
      {
        name: "oblique",
        packageName: "obliques",
        intensity: 2,
        color: "#BB8FCE",
      },
    ],
    back: [
      {
        name: "triceps",
        packageName: "triceps",
        intensity: 2,
        color: "#FF6B35",
      },
      {
        name: "rear-shoulder",
        packageName: "deltoids",
        intensity: 1,
        color: "#4ECDC4",
      },
      {
        name: "lats",
        packageName: "upper-back",
        intensity: 3,
        color: "#45B7D1",
      },
      {
        name: "traps",
        packageName: "trapezius",
        intensity: 1,
        color: "#F7DC6F",
      },
      {
        name: "lowerback",
        packageName: "lower-back",
        intensity: 2,
        color: "#96CEB4",
      },
      {
        name: "glutes",
        packageName: "gluteal",
        intensity: 2,
        color: "#FFEAA7",
      },
      {
        name: "hamstring",
        packageName: "hamstring",
        intensity: 1,
        color: "#DDA0DD",
      },
      { name: "calf", packageName: "calves", intensity: 1, color: "#98D8C8" },
      {
        name: "forearms",
        packageName: "forearm",
        intensity: 1,
        color: "#BB8FCE",
      },
    ],
  };

  // Convert your muscle data to package format
  const getHighlightData = () => {
    return muscleGroupsData[currentView].map((muscle) => ({
      slug: muscle.packageName,
      intensity: muscle.intensity,
    }));
  };

  // Get original muscle name from package name
  const getOriginalMuscleName = (packageName) => {
    const currentMuscles = muscleGroupsData[currentView];
    const muscle = currentMuscles.find((m) => m.packageName === packageName);
    return muscle ? muscle.name : packageName;
  };

  const handleMusclePress = useCallback(
    (bodyPart, side) => {
      const originalName = getOriginalMuscleName(bodyPart.slug);
      setSelectedMuscle(originalName);

      // Navigation or action handler
      Alert.alert(
        "Muscle Group",
        `${originalName} selected! (Exercise navigation will be implemented here)`,
        [
          {
            text: "View Exercises",
            onPress: () => {
              // Here you can navigate to exercises for this muscle group
              console.log("Navigate to exercises for:", originalName);
            },
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      );
    },
    [currentView]
  );

  const toggleView = () => {
    setCurrentView((prev) => (prev === "front" ? "back" : "front"));
    setSelectedMuscle(null);
  };

  // Custom colors for different intensities
  const customColors = [
    "#FF6B35", // Intensity 1 - Orange
    "#4ECDC4", // Intensity 2 - Teal
    "#45B7D1", // Intensity 3 - Blue
    "#96CEB4", // Intensity 4 - Light Green
    "#FFEAA7", // Intensity 5 - Yellow
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {currentView === "front" ? "Front View" : "Back View"}
          </Text>
        </View>
        <TouchableOpacity style={styles.rotateButton} onPress={toggleView}>
          <LinearGradient
            colors={["#FF6B35", "#4ECDC4"]}
            style={styles.rotateGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.rotateText}>
              {currentView === "front" ? "Back" : "Front"}
            </Text>
            <Text style={styles.rotateIcon}>🔄</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Body Map */}
      <View style={styles.bodyMapContainer}>
        <Body
          data={getHighlightData()}
          onBodyPartPress={handleMusclePress}
          colors={customColors}
          side={currentView}
          gender="male" // Can be made dynamic
          scale={1.5}
          border="#dfdfdf"
        />
      </View>

      {/* Info Text */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Tap on any muscle group to see exercises
        </Text>
        {selectedMuscle && (
          <Text style={styles.selectedText}>Selected: {selectedMuscle}</Text>
        )}
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Muscle Groups:</Text>
        <View style={styles.legendGrid}>
          {muscleGroupsData[currentView].map((muscle, index) => (
            <View key={muscle.name} style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  { backgroundColor: customColors[muscle.intensity - 1] },
                ]}
              />
              <Text style={styles.legendText}>{muscle.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginRight: 8,
  },
  rotateButton: {
    borderRadius: 25,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  rotateGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
  },
  rotateText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
    marginRight: 6,
  },
  rotateIcon: {
    fontSize: 16,
  },
  bodyMapContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  infoContainer: {
    padding: 20,
    alignItems: "center",
  },
  infoText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  selectedText: {
    color: "#4ECDC4",
    fontSize: 14,
    fontWeight: "600",
  },
  legendContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  legendTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  legendGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    color: "#FFFFFF",
    fontSize: 12,
    flex: 1,
  },
});

export default ProfessionalBodyMap;
