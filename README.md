# FitApp - Professional Diet Tracking Mobile Application

A comprehensive React Native diet tracking application with modern UI design, FatSecret API integration, and professional features similar to popular diet tracking apps.

## 🔒 Security Notice

This application has been configured with proper security measures. Before running the application:

1. **Environment Variables**: Copy `.env.example` to `.env` and configure your actual API keys
2. **Production Mode**: Set `NODE_ENV=production` for production deployments
3. **Demo Credentials**: Demo users are disabled in production mode for security

## 🚀 Features

### 📱 App Structure & Navigation

* **4 Main Tabs**: Diyet (Diet), Antrenman (Training), İlerleme (Progress), Profil (Profile)
* **React Navigation 6** with custom bottom tab navigator
* **Modern Purple Gradient Theme** with professional styling
* **Safe Area Handling** for all device types

### 🍽️ Diet Tracking (Main Focus)

* **Daily Calorie & Macro Tracking**: Fat, Carbs, Protein, Calories with progress circles
* **4 Meal Sections**:  
   * Kahvaltı (Breakfast) ☀️  
   * Öğle Yemeği (Lunch) 🌞  
   * Akşam Yemeği (Dinner) 🌙  
   * Atıştırmalık (Snacks) 🍎
* **Real-time Progress Indicators**: Circular progress bars for each macro
* **Weekly Progress View**: 7-day progress visualization
* **Water Tracking**: Daily water intake monitoring

### 🔍 Food Search & API Integration

* **Comprehensive Turkish Food Database**: 50+ local Turkish foods with accurate nutrition data
* **FatSecret API Integration**: Access to international food database (when configured)
* **Smart Search**: Autocomplete with fuzzy matching
* **Offline Support**: Local database works without internet
* **Food Categories**: Organized by protein, grains, vegetables, fruits, etc.

### 👤 User Authentication & Profile

* **Complete Auth System**: Login, register, forgot password
* **Demo Account**: Available only in development mode
* **Profile Management**: Personal information, preferences, goals
* **Onboarding Flow**: Initial setup for new users
* **Secure Storage**: Token-based authentication with AsyncStorage

### 📊 Data Management & Persistence

* **AsyncStorage Integration**: Local data persistence
* **Zustand State Management**: Efficient state handling
* **Daily/Weekly/Monthly Tracking**: Historical data storage
* **Smart Caching**: Optimized food search results
* **Data Export**: User data management

### 🎨 Modern UI/UX

* **Professional Design**: FatSecret-inspired interface
* **Purple Gradient Theme**: Consistent color scheme
* **Smooth Animations**: Lottie animations support [[memory:2499438]]
* **Haptic Feedback**: Touch feedback on iOS/Android
* **Loading States**: Proper loading indicators
* **Error Handling**: User-friendly error messages
* **Responsive Design**: Works on all screen sizes

## 🛠️ Technical Stack

### Core Technologies

* **React Native 0.79.5**
* **Expo SDK 53**
* **TypeScript Ready** (structure in place)
* **React Navigation 6**

### State Management

* **Zustand 5.0.6** for lightweight state management
* **AsyncStorage** for data persistence

### UI Components

* **React Native Paper 5.14.5** for Material Design components
* **Expo Linear Gradient** for gradient effects
* **React Native SVG** for custom graphics
* **Lottie React Native** for animations [[memory:2499438]]

### Charts & Visualization

* **React Native Chart Kit 6.12.0** for progress charts
* **React Native Circular Progress** for macro indicators

### API & Networking

* **Axios 1.10.0** for HTTP requests
* **FatSecret API** integration (optional)

### Additional Features

* **Expo Haptics** for tactile feedback
* **Date-fns** for date manipulation
* **React Native Safe Area Context** for safe areas

## 📁 Project Structure

```
FitApp/
├── App.js                          # Main application entry
├── .env.example                    # Environment variables template
├── src/
│   ├── components/                 # Reusable UI components
│   │   ├── BackButton.js
│   │   ├── WorkoutCard.js
│   │   └── NutritionProgress.js
│   ├── screens/                    # Application screens
│   │   ├── auth/
│   │   │   ├── LoginScreen.js      # Professional login with demo
│   │   │   ├── SignUpScreen.js
│   │   │   └── ForgotPasswordScreen.js
│   │   ├── DietScreen.js           # Main diet tracking screen
│   │   ├── MainScreen.js           # Tab navigator
│   │   ├── ProfileScreen.js
│   │   └── ...
│   ├── store/                      # Zustand stores
│   │   ├── authStore.js            # Authentication & user management
│   │   ├── dietStore.js            # Diet tracking & meal data
│   │   ├── userStore.js
│   │   └── workoutStore.js
│   ├── services/                   # API services
│   │   ├── nutritionAPI.js         # FatSecret API & Turkish foods
│   │   └── exerciseAPI.js
│   ├── theme/                      # Design system
│   │   ├── appTheme.js             # Comprehensive theme system
│   │   └── workoutTheme.js
│   └── hooks/                      # Custom React hooks
│       └── useDebounce.js
├── assets/                         # Static assets
│   ├── lottie/                     # Lottie animation files
│   └── images/
└── package.json

```

## 🚀 Getting Started

### Prerequisites

* Node.js 18+
* Expo CLI
* iOS Simulator / Android Emulator or physical device
* Expo Go app (for testing)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Osmanileri/MyFitApp.git
cd FitApp
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

```bash
# Copy the environment template
cp .env.example .env

# Edit .env file with your actual API keys
```

4. **Start the development server**

```bash
npm start
# or
expo start
```

5. **Run on device/simulator**

```bash
# iOS
npm run ios

# Android  
npm run android

# Web
npm run web
```

### Demo Account

For **development mode only**, demo accounts are available:

* **Email**: `demo@fitapp.com`
* **Password**: `demo123`

**Note**: Demo accounts are automatically disabled in production mode for security.

## 🔧 Configuration

### Environment Variables (.env)

Create a `.env` file from `.env.example` and configure the following:

```env
# FatSecret API Credentials (optional)
FATSECRET_CLIENT_ID=your_client_id_here
FATSECRET_CLIENT_SECRET=your_client_secret_here

# Auth Service Secret Key
AUTH_SECRET_KEY=your_secure_secret_key_here

# Environment
NODE_ENV=development
```

### FatSecret API Setup (Optional)

To enable the full food database with international foods:

1. **Get API Credentials**  
   * Register at [FatSecret Platform API](https://platform.fatsecret.com)
   * Obtain your Client ID and Client Secret

2. **Configure API**  
   * Add your credentials to the `.env` file
   * The app will automatically detect if API credentials are configured

3. **Test API Connection**
   * The app will fall back to the local Turkish food database if API is not configured

### Production Deployment

For production deployments:

1. **Set environment variables**:
   ```bash
   NODE_ENV=production
   ```

2. **Configure secure API keys**:
   * Use proper secret management (Azure Key Vault, AWS Secrets Manager, etc.)
   * Never commit actual API keys to version control

3. **Security checks**:
   * Demo accounts are automatically disabled
   * Environment variables are required for sensitive operations

### Theme Customization

The app uses a comprehensive theme system located in `src/theme/appTheme.js`:

```javascript
// Example theme customization
export const Colors = {
  primary: '#6C5CE7',           // Main purple color
  secondary: '#FD79A8',         // Secondary pink
  gradients: {
    primary: ['#6C5CE7', '#A29BFE'],
    // ... more gradients
  },
  // ... complete color system
};
```

## 📱 Main Features Guide

### Diet Tracking
1. **Daily Overview**: View calories and macros at a glance
2. **Add Foods**: Search and add foods to specific meals
3. **Progress Tracking**: Visual progress circles for each nutrient
4. **Water Tracking**: Monitor daily water intake
5. **Weekly View**: See 7-day progress patterns

### Food Database
- **50+ Turkish Foods**: Local database with accurate nutrition data
- **Smart Search**: Type "yumurta" for eggs, "ekmek" for bread, etc.
- **Categories**: Browse by food type (protein, vegetables, fruits, etc.)
- **Nutrition Details**: Complete macro and micronutrient information

### User Profile
- **Personal Info**: Height, weight, age, gender, activity level
- **Nutrition Goals**: Automatic calculation based on profile
- **Preferences**: Theme, notifications, units
- **Data Management**: Export and manage personal data

## 🎯 Key Screens

### DietScreen (Main)
- Modern FatSecret-inspired design
- Daily macro progress circles
- 4 meal sections with smart layout
- Weekly progress indicators
- Quick water tracking

### LoginScreen
- Professional gradient design
- Demo account integration
- Social login placeholders (Google, Apple)
- Comprehensive form validation
- Haptic feedback

### MainScreen (Navigation)
- Custom tab bar with gradients
- Smooth animations
- Turkish labels
- Professional icons

## 🏗️ Architecture Decisions

### State Management
- **Zustand** chosen for its simplicity and performance
- **Individual stores** for different app modules (auth, diet, workout)
- **Async actions** with proper error handling

### Data Persistence
- **AsyncStorage** for local data storage
- **Smart caching** for API responses
- **Offline-first** approach with fallbacks

### UI Framework
- **React Native Paper** for consistent Material Design
- **Custom components** built on top of Paper
- **Theme system** for consistent styling

### API Integration
- **Graceful degradation** when API is unavailable
- **Local Turkish food database** as primary source
- **FatSecret API** as enhancement (optional)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the 0BSD License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **FatSecret API** for nutrition data
- **Expo team** for the excellent development platform
- **React Native Paper** for beautiful UI components
- **Turkish Nutrition Database** for local food data

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ using React Native and Expo** 