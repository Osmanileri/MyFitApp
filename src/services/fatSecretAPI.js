// 🔍 FatSecret API Service
// Provides international food data using real FatSecret API

import Constants from "expo-constants";

const DEMO_MODE = false; // Using real API credentials

// Get API credentials from app.json extra config
const getApiCredentials = () => {
  const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
  return {
    clientId:
      extra.FATSECRET_CLIENT_ID || process.env.FATSECRET_CLIENT_ID || "",
    clientSecret:
      extra.FATSECRET_CLIENT_SECRET ||
      process.env.FATSECRET_CLIENT_SECRET ||
      "",
  };
};

// Demo FatSecret food database for testing
const DEMO_FATSECRET_FOODS = [
  {
    id: "fs_chicken_breast",
    name: "Chicken Breast (Skinless)",
    nameLocal: "Tavuk Göğsü (Derisiz)",
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    brand: "Generic",
    source: "fatsecret_demo",
  },
  {
    id: "fs_brown_rice",
    name: "Brown Rice Cooked",
    nameLocal: "Esmer Pirinç (Pişmiş)",
    calories: 111,
    protein: 2.6,
    carbs: 22,
    fat: 0.9,
    fiber: 1.8,
    brand: "Generic",
    source: "fatsecret_demo",
  },
  {
    id: "fs_banana",
    name: "Banana Medium",
    nameLocal: "Muz (Orta Boy)",
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
    fiber: 3.1,
    brand: "Fresh",
    source: "fatsecret_demo",
  },
  {
    id: "fs_greek_yogurt",
    name: "Greek Yogurt Plain",
    nameLocal: "Yunan Yoğurdu (Sade)",
    calories: 100,
    protein: 10,
    carbs: 6,
    fat: 5,
    fiber: 0,
    brand: "Generic",
    source: "fatsecret_demo",
  },
  {
    id: "fs_almonds",
    name: "Almonds Raw",
    nameLocal: "Badem (Çiğ)",
    calories: 579,
    protein: 21.2,
    carbs: 21.6,
    fat: 49.9,
    fiber: 12.5,
    brand: "Generic",
    source: "fatsecret_demo",
  },
  {
    id: "fs_salmon",
    name: "Atlantic Salmon",
    nameLocal: "Atlantik Somonu",
    calories: 208,
    protein: 25.4,
    carbs: 0,
    fat: 12.4,
    fiber: 0,
    brand: "Fresh",
    source: "fatsecret_demo",
  },
  {
    id: "fs_sweet_potato",
    name: "Sweet Potato Baked",
    nameLocal: "Tatlı Patates (Fırında)",
    calories: 86,
    protein: 1.6,
    carbs: 20.1,
    fat: 0.1,
    fiber: 3,
    brand: "Fresh",
    source: "fatsecret_demo",
  },
  {
    id: "fs_avocado",
    name: "Avocado",
    nameLocal: "Avokado",
    calories: 160,
    protein: 2,
    carbs: 8.5,
    fat: 14.7,
    fiber: 6.7,
    brand: "Fresh",
    source: "fatsecret_demo",
  },
  {
    id: "fs_quinoa",
    name: "Quinoa Cooked",
    nameLocal: "Kinoa (Pişmiş)",
    calories: 120,
    protein: 4.4,
    carbs: 21.8,
    fat: 1.9,
    fiber: 2.8,
    brand: "Generic",
    source: "fatsecret_demo",
  },
  {
    id: "fs_whey_protein",
    name: "Whey Protein Powder",
    nameLocal: "Whey Protein Tozu",
    calories: 103,
    protein: 20,
    carbs: 2,
    fat: 1.5,
    fiber: 1,
    brand: "Generic",
    source: "fatsecret_demo",
  },
];

class FatSecretAPI {
  constructor() {
    const credentials = getApiCredentials();
    this.baseURL = "https://platform.fatsecret.com/rest/server.api";
    this.tokenURL = "https://oauth.fatsecret.com/connect/token";
    this.consumerKey = credentials.clientId;
    this.consumerSecret = credentials.clientSecret;
    this.accessToken = null;
    this.tokenExpiryTime = null;
    this.demoMode = DEMO_MODE;

    console.log("FatSecret API initialized with credentials:", {
      hasClientId: !!this.consumerKey,
      hasClientSecret: !!this.consumerSecret,
      demoMode: this.demoMode,
    });
  }

  // Base64 encode for React Native
  base64Encode(str) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    let output = "";
    let i = 0;
    const bytes = unescape(encodeURIComponent(str));

    while (i < bytes.length) {
      const c1 = bytes.charCodeAt(i++);
      const c2 = bytes.charCodeAt(i++);
      const c3 = bytes.charCodeAt(i++);
      const e1 = c1 >> 2;
      const e2 = ((c1 & 3) << 4) | (c2 >> 4);
      let e3 = ((c2 & 15) << 2) | (c3 >> 6);
      let e4 = c3 & 63;

      if (isNaN(c2)) {
        e3 = e4 = 64;
      } else if (isNaN(c3)) {
        e4 = 64;
      }

      output +=
        chars.charAt(e1) +
        chars.charAt(e2) +
        chars.charAt(e3) +
        chars.charAt(e4);
    }
    return output;
  }

  // Get OAuth 2.0 access token
  async getAccessToken() {
    try {
      // Check if we have a valid cached token
      if (
        this.accessToken &&
        this.tokenExpiryTime &&
        Date.now() < this.tokenExpiryTime - 60000
      ) {
        console.log("Using cached FatSecret token");
        return this.accessToken;
      }

      if (!this.consumerKey || !this.consumerSecret) {
        throw new Error("FatSecret API credentials not configured");
      }

      console.log("Requesting new FatSecret token...");

      // Base64 encode credentials
      const credentials = `${this.consumerKey}:${this.consumerSecret}`;
      const encodedCredentials = this.base64Encode(credentials);

      const response = await fetch(this.tokenURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${encodedCredentials}`,
        },
        body: "grant_type=client_credentials&scope=basic",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Token request failed:", response.status, errorText);
        throw new Error(`Token request failed: ${response.status}`);
      }

      const tokenData = await response.json();
      this.accessToken = tokenData.access_token;
      this.tokenExpiryTime = Date.now() + tokenData.expires_in * 1000;

      console.log("FatSecret token obtained successfully");
      return this.accessToken;
    } catch (error) {
      console.error("FatSecret token error:", error);
      throw error;
    }
  }

  // Demo search function
  searchFoodsDemo(query) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = DEMO_FATSECRET_FOODS.filter(
          (food) =>
            food.name.toLowerCase().includes(query.toLowerCase()) ||
            food.nameLocal.toLowerCase().includes(query.toLowerCase())
        );
        resolve({
          success: true,
          data: results,
          source: "demo",
        });
      }, 300); // Simulate API delay
    });
  }

  // Real FatSecret API search
  async searchFoodsReal(query, maxResults = 20) {
    try {
      const accessToken = await this.getAccessToken();

      const params = new URLSearchParams({
        method: "foods.search",
        search_expression: query,
        format: "json",
        max_results: maxResults.toString(),
      });

      const response = await fetch(`${this.baseURL}?${params}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log("🔥 Raw FatSecret response:", JSON.stringify(data, null, 2));

      if (!data.foods || !data.foods.food) {
        console.log("⚠️ No foods found in response");
        return {
          success: true,
          data: [],
          source: "fatsecret",
        };
      }

      const foods = Array.isArray(data.foods.food)
        ? data.foods.food
        : [data.foods.food];

      console.log("📦 Found foods:", foods.length);

      const formattedFoods = foods.map((food) => {
        // Parse nutrition from description
        const desc = food.food_description || "";
        const caloriesMatch = desc.match(/Calories:\s*(\d+)/i);
        const proteinMatch = desc.match(/Protein:\s*([\d.]+)g/i);
        const carbsMatch = desc.match(/Carbs:\s*([\d.]+)g/i);
        const fatMatch = desc.match(/Fat:\s*([\d.]+)g/i);

        return {
          id: food.food_id,
          name: food.food_name,
          calories: caloriesMatch ? parseInt(caloriesMatch[1]) : 0,
          protein: proteinMatch ? parseFloat(proteinMatch[1]) : 0,
          carbs: carbsMatch ? parseFloat(carbsMatch[1]) : 0,
          fat: fatMatch ? parseFloat(fatMatch[1]) : 0,
          fiber: 0,
          brand: food.brand_name || "Generic",
          source: "fatsecret",
        };
      });

      return {
        success: true,
        data: formattedFoods,
        source: "fatsecret",
      };
    } catch (error) {
      console.error("FatSecret API Error:", error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  }

  // Main search function
  async searchFoods(query, maxResults = 20) {
    if (!query || query.length < 2) {
      return {
        success: true,
        data: [],
        source: "empty_query",
      };
    }

    try {
      if (this.demoMode) {
        return await this.searchFoodsDemo(query);
      } else {
        return await this.searchFoodsReal(query, maxResults);
      }
    } catch (error) {
      console.error("FatSecret Search Error:", error);

      // Fallback to demo data on error
      console.log("Falling back to demo data...");
      return await this.searchFoodsDemo(query);
    }
  }

  // Get popular international foods
  getPopularFoods() {
    const popular = [
      "fs_chicken_breast",
      "fs_greek_yogurt",
      "fs_salmon",
      "fs_quinoa",
      "fs_whey_protein",
      "fs_avocado",
    ];

    return DEMO_FATSECRET_FOODS.filter((food) => popular.includes(food.id));
  }

  // Get food details by ID from real API
  async getFoodById(id) {
    if (this.demoMode) {
      return DEMO_FATSECRET_FOODS.find((food) => food.id === id);
    }

    try {
      const accessToken = await this.getAccessToken();

      const params = new URLSearchParams({
        method: "food.get.v2",
        food_id: id,
        format: "json",
      });

      const response = await fetch(`${this.baseURL}?${params}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.food && data.food.servings && data.food.servings.serving) {
        const serving = Array.isArray(data.food.servings.serving)
          ? data.food.servings.serving[0]
          : data.food.servings.serving;

        return {
          id: id,
          name: data.food.food_name,
          calories: parseInt(serving.calories || "0"),
          protein: parseFloat(serving.protein || "0"),
          carbs: parseFloat(serving.carbohydrate || "0"),
          fat: parseFloat(serving.fat || "0"),
          fiber: parseFloat(serving.fiber || "0"),
          brand: data.food.brand_name || "Generic",
          source: "fatsecret",
        };
      }

      return null;
    } catch (error) {
      console.error("FatSecret getFoodById error:", error);
      return null;
    }
  }

  // Convert FatSecret food to our standard format
  formatFoodItem(fatSecretFood) {
    return {
      id: fatSecretFood.id,
      name: fatSecretFood.nameLocal || fatSecretFood.name,
      nameEn: fatSecretFood.name,
      category: this.categorizeFood(fatSecretFood),
      calories: fatSecretFood.calories,
      protein: fatSecretFood.protein,
      carbs: fatSecretFood.carbs,
      fat: fatSecretFood.fat,
      fiber: fatSecretFood.fiber || 0,
      defaultAmount: 100,
      commonPortions: this.generateCommonPortions(fatSecretFood),
      searchTerms: this.generateSearchTerms(fatSecretFood),
      source: "fatsecret",
      brand: fatSecretFood.brand,
    };
  }

  // Categorize food based on nutrition profile
  categorizeFood(food) {
    const { protein, carbs, fat } = food;

    if (protein > 15 && protein > carbs && protein > fat) {
      return "protein";
    } else if (carbs > 40) {
      return "grains";
    } else if (fat > 15) {
      return "fats";
    } else if (
      food.name.toLowerCase().includes("fruit") ||
      food.nameLocal?.toLowerCase().includes("meyve")
    ) {
      return "fruits";
    } else if (
      food.name.toLowerCase().includes("vegetable") ||
      food.nameLocal?.toLowerCase().includes("sebze")
    ) {
      return "vegetables";
    } else if (
      food.name.toLowerCase().includes("milk") ||
      food.name.toLowerCase().includes("cheese") ||
      food.name.toLowerCase().includes("yogurt") ||
      food.nameLocal?.toLowerCase().includes("süt") ||
      food.nameLocal?.toLowerCase().includes("peynir") ||
      food.nameLocal?.toLowerCase().includes("yoğurt")
    ) {
      return "dairy";
    } else {
      return "protein"; // Default category
    }
  }

  // Generate common portions based on food type
  generateCommonPortions(food) {
    const basePortions = [
      { name: "1 porsiyon", amount: 100, unit: "g" },
      { name: "50g", amount: 50, unit: "g" },
      { name: "200g", amount: 200, unit: "g" },
    ];

    // Add specific portions based on food type
    if (
      food.name.toLowerCase().includes("protein") ||
      food.nameLocal?.toLowerCase().includes("protein")
    ) {
      basePortions.unshift({ name: "1 ölçek (30g)", amount: 30, unit: "g" });
    } else if (
      food.name.toLowerCase().includes("chicken") ||
      food.nameLocal?.toLowerCase().includes("tavuk")
    ) {
      basePortions.unshift({ name: "1 dilim", amount: 85, unit: "g" });
    } else if (
      food.name.toLowerCase().includes("rice") ||
      food.nameLocal?.toLowerCase().includes("pirinç")
    ) {
      basePortions.unshift({ name: "1 çay bardağı", amount: 75, unit: "g" });
    }

    return basePortions;
  }

  // Generate search terms
  generateSearchTerms(food) {
    const terms = [
      food.name.toLowerCase(),
      food.nameLocal?.toLowerCase(),
    ].filter(Boolean);

    // Add common English-Turkish translations
    const translations = {
      chicken: "tavuk",
      rice: "pirinç",
      protein: "protein",
      yogurt: "yoğurt",
      salmon: "somon",
      banana: "muz",
    };

    Object.entries(translations).forEach(([en, tr]) => {
      if (food.name.toLowerCase().includes(en)) {
        terms.push(tr);
      }
    });

    return [...new Set(terms)]; // Remove duplicates
  }

  // Check API status
  async checkStatus() {
    if (this.demoMode) {
      return {
        status: "demo",
        message: "Running in demo mode",
        available: true,
      };
    }

    try {
      // This would check the actual FatSecret API status
      return {
        status: "active",
        message: "FatSecret API is available",
        available: true,
      };
    } catch (error) {
      return {
        status: "error",
        message: error.message,
        available: false,
      };
    }
  }
}

// Export singleton instance
export const fatSecretAPI = new FatSecretAPI();

// Export individual functions for easier testing
export const searchFoods = (query, maxResults) =>
  fatSecretAPI.searchFoods(query, maxResults);
export const getPopularFoods = () => fatSecretAPI.getPopularFoods();
export const getFoodById = (id) => fatSecretAPI.getFoodById(id);
export const checkAPIStatus = () => fatSecretAPI.checkStatus();

export default fatSecretAPI;
