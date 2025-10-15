# MyFitApp - Product Requirements Document

**Version:** 1.0  
**Last Updated:** January 2025  
**Project Status:** Active Development  
**Target Platform:** iOS & Android (React Native)

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Current State Analysis](#current-state-analysis)
3. [Tech Stack & Environment](#tech-stack--environment)
4. [Requirements & Features](#requirements--features)
5. [Database Architecture](#database-architecture)
6. [API Integration Strategy](#api-integration-strategy)
7. [Authentication & Authorization](#authentication--authorization)
8. [User Flows](#user-flows)
9. [UI/UX Design](#uiux-design)
10. [Analytics & Insights](#analytics--insights)
11. [Data Synchronization](#data-synchronization)
12. [Security & Privacy](#security--privacy)
13. [Deployment Strategy](#deployment-strategy)
14. [Implementation Roadmap](#implementation-roadmap)
15. [Testing Strategy](#testing-strategy)
16. [Success Metrics](#success-metrics)
17. [Future Enhancements](#future-enhancements)
18. [Risk Assessment](#risk-assessment)

---

## Project Overview

### Description

MyFitApp is a comprehensive, AI-powered fitness and nutrition tracking mobile application that combines diet logging, workout tracking, and advanced analytics to help users achieve their health and fitness goals. The app features a hybrid offline/online architecture, ensuring users can track their progress anywhere, anytime.

### Project Scope

This is a personal project designed for real-world deployment on the Apple App Store and Google Play Store. The application demonstrates modern mobile development practices, cloud-native architecture, and seamless API integrations.

### Target Audience

- **Primary:** Fitness enthusiasts and health-conscious individuals (ages 18-45)
- **Secondary:** Gym-goers tracking workout progress
- **Tertiary:** People starting their fitness journey needing guidance and tracking

### Core Value Proposition

- **Offline-First Architecture:** Track everything without internet, sync when connected
- **Comprehensive Analytics:** Deep insights into nutrition and workout patterns
- **Free & Accessible:** Optimized to work within free tier API limits
- **Privacy-Focused:** User data encrypted and protected with industry standards

### Primary Goals

1. Provide seamless diet tracking with extensive food database (Turkish + International)
2. Enable detailed workout logging with exercise library and GIF demonstrations
3. Deliver actionable insights through comprehensive analytics and visualizations
4. Ensure offline functionality with background cloud synchronization
5. Successfully launch on iOS App Store and Google Play Store

---

## Current State Analysis

### Existing Features (Working)

#### Diet Tracking Module ✅

- Daily calorie and macro tracking (protein, carbs, fats, fiber)
- 4 meal sections: Breakfast, Lunch, Dinner, Snacks
- Water intake tracking
- Supplement tracking
- Turkish food database (50+ items)
- FatSecret API integration (demo mode)
- Food search with autocomplete
- Manual food entry
- Daily progress circles for macros

#### Basic Workout Module ⚠️

- Workout dashboard
- Exercise library (10+ exercises with static GIFs)
- Basic workout logging
- Set/rep tracking
- Mock data for demonstration

#### Progress Tracking ⚠️

- Basic progress screen
- Weight tracking capability
- Measurement tracking structure
- Photo progress placeholder

#### Authentication ⚠️

- Demo login system
- Local user storage
- Basic profile management

#### Infrastructure ✅

- React Native + Expo SDK 53
- Zustand state management
- SQLite local database
- React Navigation
- React Native Paper UI components
- Purple gradient theme

### Features Needing Enhancement 🔧

1. **Supabase Integration** - Cloud database, auth, storage (NOT IMPLEMENTED)
2. **ExerciseDB API** - Real exercise data with proper caching (PARTIAL)
3. **Analytics Dashboard** - Charts, insights, trends (BASIC STRUCTURE ONLY)
4. **Data Synchronization** - SQLite ↔ Supabase sync (NOT IMPLEMENTED)
5. **OAuth Authentication** - Google, Apple Sign-In (NOT IMPLEMENTED)
6. **Progress Photos** - Camera integration, before/after (NOT IMPLEMENTED)
7. **Workout Templates** - Pre-built routines (BASIC STRUCTURE)
8. **Personal Records** - PR tracking and notifications (NOT IMPLEMENTED)

### Technical Debt

- Migration from demo authentication to production Supabase Auth
- SQLite schema optimization for sync
- ExerciseDB API integration with proper caching strategy
- Type safety improvements (gradual TypeScript migration)
- Error handling and logging system
- Performance optimization for large datasets

---

## Tech Stack & Environment

### Frontend

- **Framework:** React Native 0.79.5
- **SDK:** Expo 53.0.19
- **Language:** JavaScript (gradual TypeScript migration planned)
- **Navigation:** React Navigation 7 (Stack + Bottom Tabs)
- **State Management:** Zustand 5.0.6 with persist middleware
- **UI Library:** React Native Paper 5.14.5
- **Styling:** StyleSheet API, Expo Linear Gradient

### Backend & Cloud Services

- **Backend-as-a-Service:** Supabase
  - **Database:** PostgreSQL 15
  - **Authentication:** Supabase Auth (Email, OAuth)
  - **Storage:** Supabase Storage (progress photos)
  - **Realtime:** Supabase Realtime (future feature)
- **Local Database:** SQLite (expo-sqlite 15.2.14)
- **Offline Strategy:** Hybrid SQLite + Supabase with background sync

### External APIs

- **Nutrition Data:** FatSecret API
  - Turkish + International food database
  - Demo mode with fallback to local database
- **Exercise Data:** ExerciseDB API via RapidAPI
  - **Free Tier:** 1,000 requests/month
  - **Endpoints:** Exercise list, body part filter, equipment filter
  - **Cache Strategy:** Local SQLite storage, monthly refresh

### Development Tools

- **Version Control:** Git + GitHub
- **Package Manager:** npm
- **Build Service:** EAS Build (Expo Application Services)
- **Code Quality:** ESLint, Prettier (to be configured)
- **Testing:** Jest, React Native Testing Library (planned)

### UI Components & Libraries

- **Charts:** React Native Chart Kit 6.12.0
- **Progress Indicators:** React Native Circular Progress 1.4.1
- **Animations:** Lottie React Native 7.2.2
- **Icons:** Ionicons (built into Expo)
- **Date Handling:** date-fns 4.1.0
- **Network Detection:** @react-native-community/netinfo 11.4.1
- **Body Visualization:** React Native Body Highlighter 3.1.3

### Target Platforms

- **iOS:** 13.0+
- **Android:** API Level 23+ (Android 6.0)
- **Build Targets:** Production App Store & Play Store releases

---

## Requirements & Features

### Functional Requirements

#### FR-1: User Management & Authentication

**FR-1.1: Supabase Authentication**

- User registration with email and password
- Email verification for new accounts
- Password strength validation (min 8 characters, mixed case, numbers)
- Secure login with email/password
- Google OAuth (iOS and Android)
- Apple Sign-In (iOS App Store requirement)
- Password recovery and reset via email
- Session management with 30-day token expiry
- Automatic token refresh
- Secure token storage using Expo SecureStore

**FR-1.2: User Profile Management**

- Complete profile setup wizard on first launch
- Personal information (name, age, gender, height, current weight)
- Profile photo upload to Supabase Storage
- Edit profile information
- Account deletion with data export option
- Privacy settings control

#### FR-2: Diet Tracking Module

**FR-2.1: Food Database & Search**

- Comprehensive Turkish food database (50+ items, expandable)
- FatSecret API integration for international foods
- Smart search with autocomplete
- Recent foods quick access
- Favorite foods bookmarking
- Food search by category (proteins, grains, vegetables, fruits, dairy)
- Offline search using local SQLite database

**FR-2.2: Meal Logging**

- 4 meal categories: Breakfast, Lunch, Dinner, Snacks
- Add food to specific meal with portion control
- Custom portion sizes (grams, servings, pieces)
- Copy meals to other days
- Edit logged food entries
- Delete food entries
- View meal history

**FR-2.3: Nutrition Tracking**

- Daily calorie goal based on user profile
- Macro tracking: Protein, Carbohydrates, Fats, Fiber
- Real-time circular progress indicators for each macro
- Daily nutrition summary
- Weekly nutrition overview (7-day grid)
- Nutrition goal customization
- Macro ratio recommendations based on goals

**FR-2.4: Water & Supplement Tracking**

- Daily water intake tracker (glasses/liters)
- Water goal setting
- Quick add water buttons
- Supplement logging (name, dosage, time)
- Supplement reminders (optional)

**FR-2.5: Custom Food Entry**

- Manual food creation
- Custom nutrition values input
- Save custom foods to database
- Edit custom foods

#### FR-3: Workout Tracking Module

**FR-3.1: Exercise Library**

- ExerciseDB API integration (1,000+ exercises)
- Exercise search by name
- Filter by body part (chest, back, shoulders, arms, legs, core, cardio)
- Filter by equipment (barbell, dumbbell, bodyweight, machine, cable, etc.)
- Filter by difficulty (beginner, intermediate, advanced)
- Exercise GIF demonstrations
- Exercise instructions and tips
- Muscle group visualization
- Favorite exercises bookmarking
- Custom exercise creation

**FR-3.2: Workout Session Management**

- Start live workout session
- Manual workout logging (log past workouts)
- Select workout from templates
- Create custom workout from scratch
- Add exercises to active workout
- Reorder exercises
- Remove exercises from workout
- Pause/resume workout session
- Workout timer (total duration)
- Rest timer between sets

**FR-3.3: Set & Rep Logging**

- Add sets to exercises
- Log reps and weight for each set
- Mark sets as completed
- Quick set duplication
- Rest time tracking per set
- Time-based exercises (planks, running)
- Drop sets and super sets (future enhancement)
- Personal record notifications

**FR-3.4: Workout Templates**

- Pre-built workout templates (Push/Pull/Legs, Full Body, HIIT)
- Save custom workouts as templates
- Edit templates
- Delete templates
- Template sharing (future enhancement)

**FR-3.5: Workout History**

- View past workouts by date
- Calendar view of workout history
- Workout detail view (exercises, sets, reps, weight)
- Filter by date range
- Search workouts
- Delete workout entries
- Edit past workouts (within 7 days)

#### FR-4: Progress Tracking & Analytics

**FR-4.1: Weight Tracking**

- Daily weight entry
- Weight trend line chart
- Moving average calculation (7-day, 30-day)
- Weight goal setting
- Progress percentage
- Projected goal achievement date
- Weight change notifications

**FR-4.2: Body Measurements**

- Track multiple body parts:
  - Chest, Waist, Hips
  - Biceps (left/right), Thighs (left/right)
  - Calves (left/right)
  - Neck, Shoulders
- Measurement history
- Body part comparison charts
- Measurement entry date tracking
- Measurement goals

**FR-4.3: Progress Photos**

- Front, side, back photo capture
- Photo date tagging
- Before/after photo comparison
- Photo timeline view
- Grid layout for monthly comparison
- Secure photo storage in Supabase Storage
- Photo deletion

**FR-4.4: Nutrition Analytics**

- Daily calorie intake chart (7-day, 30-day)
- Macro distribution pie charts
- Weekly average calories
- Goal adherence percentage
- Streak tracking (consecutive days logged)
- Best/worst days analysis
- Meal timing patterns
- Food category breakdown

**FR-4.5: Workout Analytics**

- Weekly workout frequency
- Total workout time (weekly, monthly)
- Calories burned estimates
- Volume per muscle group (sets × reps × weight)
- Exercise personal records (PRs)
- Workout consistency streaks
- Rest days analysis
- Muscle group balance chart
- Strength progression graphs

**FR-4.6: Combined Progress Dashboard**

- Quick stats overview (weight, workouts this week, calories today)
- Recent activity feed
- Goal progress indicators
- Achievement badges and milestones
- Weekly summary cards
- Data export (CSV/JSON)

#### FR-5: Settings & Preferences

**FR-5.1: Profile Settings**

- Edit personal information
- Update health goals (lose weight, gain muscle, maintain)
- Activity level selection
- Calculate recommended daily calories
- Macro ratio preferences

**FR-5.2: App Settings**

- Notification preferences
- Units (metric/imperial)
- Theme selection (future: dark mode)
- Language selection (English, Turkish planned)
- Data sync settings
- Clear cache
- App version and about

**FR-5.3: Data Management**

- Export all data (JSON format)
- Import data backup
- Clear all local data
- Sync status indicator
- Manual sync trigger
- Last sync timestamp

**FR-5.4: Privacy & Security**

- Privacy policy access
- Terms of service
- Data deletion request
- Logout with data retention options

### Non-Functional Requirements

#### NFR-1: Performance

- **NFR-1.1:** App launch time < 3 seconds on modern devices
- **NFR-1.2:** Screen navigation < 200ms
- **NFR-1.3:** API response caching to reduce load times
- **NFR-1.4:** Smooth 60 FPS animations and transitions
- **NFR-1.5:** Image optimization (compressed uploads, lazy loading)
- **NFR-1.6:** Efficient list rendering with FlatList virtualization
- **NFR-1.7:** Background sync without UI blocking

#### NFR-2: Reliability

- **NFR-2.1:** Crash-free rate > 99%
- **NFR-2.2:** Offline functionality for all core features
- **NFR-2.3:** Automatic error recovery and retry logic
- **NFR-2.4:** Data consistency across devices
- **NFR-2.5:** Graceful API failure handling

#### NFR-3: Usability

- **NFR-3.1:** Intuitive navigation with bottom tab bar
- **NFR-3.2:** Consistent UI design language
- **NFR-3.3:** Touch targets minimum 44×44 points
- **NFR-3.4:** Helpful empty states and onboarding
- **NFR-3.5:** Clear error messages and recovery suggestions
- **NFR-3.6:** Accessibility: Screen reader support, dynamic font sizing

#### NFR-4: Scalability

- **NFR-4.1:** Support 10,000+ food entries per user
- **NFR-4.2:** Handle 1,000+ workout entries efficiently
- **NFR-4.3:** Optimized database queries with indexes
- **NFR-4.4:** Pagination for large datasets
- **NFR-4.5:** ExerciseDB API rate limit management (1,000/month)

#### NFR-5: Security

- **NFR-5.1:** HTTPS/TLS for all network requests
- **NFR-5.2:** Supabase Row Level Security (RLS) policies
- **NFR-5.3:** Secure token storage with Expo SecureStore
- **NFR-5.4:** Input validation and sanitization
- **NFR-5.5:** No sensitive data in logs or error reports
- **NFR-5.6:** GDPR and KVKK compliance

---

## Database Architecture

### Supabase Schema (Cloud Database)

#### Table: `users`

Automatically managed by Supabase Auth. Extended with:

```sql
-- Synced with Supabase Auth
id: UUID (Primary Key, from auth.users)
email: VARCHAR(255) (Unique, Not Null)
created_at: TIMESTAMP (Default: NOW())
updated_at: TIMESTAMP (Default: NOW())
last_login: TIMESTAMP
```

#### Table: `user_profiles`

```sql
id: UUID (Primary Key, Foreign Key to users.id)
user_id: UUID (Foreign Key to auth.users.id, Unique)
full_name: VARCHAR(100)
age: INTEGER
gender: VARCHAR(20) (male, female, other)
height_cm: DECIMAL(5,2)
current_weight_kg: DECIMAL(5,2)
goal_weight_kg: DECIMAL(5,2)
activity_level: VARCHAR(20) (sedentary, lightly_active, moderately_active, very_active, extra_active)
health_goal: VARCHAR(50) (lose_weight, gain_muscle, maintain, general_health)
daily_calorie_goal: INTEGER
protein_goal_g: INTEGER
carbs_goal_g: INTEGER
fat_goal_g: INTEGER
fiber_goal_g: INTEGER
water_goal_ml: INTEGER (Default: 2000)
profile_photo_url: TEXT
created_at: TIMESTAMP (Default: NOW())
updated_at: TIMESTAMP (Default: NOW())
```

#### Table: `diet_logs`

```sql
id: UUID (Primary Key)
user_id: UUID (Foreign Key to users.id, Not Null)
food_id: VARCHAR(100) (Reference to food database)
food_name: VARCHAR(200) (Not Null)
meal_type: VARCHAR(20) (breakfast, lunch, dinner, snack)
serving_size: DECIMAL(10,2)
serving_unit: VARCHAR(20) (g, ml, serving, piece)
calories: INTEGER
protein_g: DECIMAL(10,2)
carbs_g: DECIMAL(10,2)
fat_g: DECIMAL(10,2)
fiber_g: DECIMAL(10,2)
log_date: DATE (Not Null)
log_time: TIME
is_custom_food: BOOLEAN (Default: false)
notes: TEXT
synced_from_local: BOOLEAN (Default: false)
local_id: VARCHAR(50) (For sync tracking)
created_at: TIMESTAMP (Default: NOW())
updated_at: TIMESTAMP (Default: NOW())

-- Indexes
CREATE INDEX idx_diet_logs_user_date ON diet_logs(user_id, log_date);
CREATE INDEX idx_diet_logs_meal_type ON diet_logs(user_id, meal_type);
```

#### Table: `workout_logs`

```sql
id: UUID (Primary Key)
user_id: UUID (Foreign Key to users.id, Not Null)
workout_name: VARCHAR(100)
workout_date: DATE (Not Null)
start_time: TIMESTAMP
end_time: TIMESTAMP
duration_minutes: INTEGER
total_calories_burned: INTEGER
notes: TEXT
workout_type: VARCHAR(50) (strength, cardio, hiit, flexibility)
is_template: BOOLEAN (Default: false)
template_id: UUID (Nullable, self-reference for templates)
synced_from_local: BOOLEAN (Default: false)
local_id: VARCHAR(50)
created_at: TIMESTAMP (Default: NOW())
updated_at: TIMESTAMP (Default: NOW())

-- Indexes
CREATE INDEX idx_workout_logs_user_date ON workout_logs(user_id, workout_date);
```

#### Table: `workout_exercises`

```sql
id: UUID (Primary Key)
workout_id: UUID (Foreign Key to workout_logs.id, ON DELETE CASCADE)
exercise_id: VARCHAR(100) (From ExerciseDB or custom)
exercise_name: VARCHAR(200) (Not Null)
body_part: VARCHAR(50)
equipment: VARCHAR(50)
target_muscle: VARCHAR(50)
exercise_order: INTEGER (Display order in workout)
gif_url: TEXT (ExerciseDB GIF or custom)
is_custom: BOOLEAN (Default: false)
created_at: TIMESTAMP (Default: NOW())

-- Indexes
CREATE INDEX idx_workout_exercises_workout ON workout_exercises(workout_id);
```

#### Table: `workout_sets`

```sql
id: UUID (Primary Key)
workout_exercise_id: UUID (Foreign Key to workout_exercises.id, ON DELETE CASCADE)
set_number: INTEGER (Not Null)
reps: INTEGER
weight_kg: DECIMAL(10,2)
duration_seconds: INTEGER (For time-based exercises)
rest_seconds: INTEGER
is_completed: BOOLEAN (Default: true)
is_personal_record: BOOLEAN (Default: false)
notes: TEXT
created_at: TIMESTAMP (Default: NOW())

-- Indexes
CREATE INDEX idx_workout_sets_exercise ON workout_sets(workout_exercise_id);
```

#### Table: `custom_exercises`

```sql
id: UUID (Primary Key)
user_id: UUID (Foreign Key to users.id, Not Null)
exercise_name: VARCHAR(200) (Not Null)
body_part: VARCHAR(50)
equipment: VARCHAR(50)
target_muscle: VARCHAR(50)
instructions: TEXT
tips: TEXT
custom_gif_url: TEXT (Optional user upload)
is_public: BOOLEAN (Default: false, for future sharing)
created_at: TIMESTAMP (Default: NOW())
updated_at: TIMESTAMP (Default: NOW())

-- Indexes
CREATE INDEX idx_custom_exercises_user ON custom_exercises(user_id);
```

#### Table: `progress_weights`

```sql
id: UUID (Primary Key)
user_id: UUID (Foreign Key to users.id, Not Null)
weight_kg: DECIMAL(5,2) (Not Null)
measurement_date: DATE (Not Null)
notes: TEXT
synced_from_local: BOOLEAN (Default: false)
local_id: VARCHAR(50)
created_at: TIMESTAMP (Default: NOW())

-- Indexes
CREATE INDEX idx_progress_weights_user_date ON progress_weights(user_id, measurement_date);
-- Unique constraint to prevent duplicate entries per day
CREATE UNIQUE INDEX idx_unique_weight_per_day ON progress_weights(user_id, measurement_date);
```

#### Table: `progress_measurements`

```sql
id: UUID (Primary Key)
user_id: UUID (Foreign Key to users.id, Not Null)
measurement_date: DATE (Not Null)
chest_cm: DECIMAL(5,2)
waist_cm: DECIMAL(5,2)
hips_cm: DECIMAL(5,2)
bicep_left_cm: DECIMAL(5,2)
bicep_right_cm: DECIMAL(5,2)
thigh_left_cm: DECIMAL(5,2)
thigh_right_cm: DECIMAL(5,2)
calf_left_cm: DECIMAL(5,2)
calf_right_cm: DECIMAL(5,2)
neck_cm: DECIMAL(5,2)
shoulders_cm: DECIMAL(5,2)
notes: TEXT
synced_from_local: BOOLEAN (Default: false)
local_id: VARCHAR(50)
created_at: TIMESTAMP (Default: NOW())

-- Indexes
CREATE INDEX idx_progress_measurements_user_date ON progress_measurements(user_id, measurement_date);
```

#### Table: `progress_photos`

```sql
id: UUID (Primary Key)
user_id: UUID (Foreign Key to users.id, Not Null)
photo_url: TEXT (Not Null, Supabase Storage URL)
photo_type: VARCHAR(20) (front, side, back)
photo_date: DATE (Not Null)
weight_at_photo_kg: DECIMAL(5,2)
notes: TEXT
storage_path: TEXT (Supabase Storage path)
created_at: TIMESTAMP (Default: NOW())

-- Indexes
CREATE INDEX idx_progress_photos_user_date ON progress_photos(user_id, photo_date);
```

#### Table: `analytics_cache`

```sql
-- Pre-calculated analytics for performance
id: UUID (Primary Key)
user_id: UUID (Foreign Key to users.id, Not Null)
cache_type: VARCHAR(50) (weekly_nutrition, monthly_workout, etc.)
cache_date: DATE (The date this cache represents)
cache_data: JSONB (Flexible JSON storage for analytics data)
expires_at: TIMESTAMP
created_at: TIMESTAMP (Default: NOW())

-- Indexes
CREATE INDEX idx_analytics_cache_user_type ON analytics_cache(user_id, cache_type, cache_date);
```

#### Table: `user_favorites`

```sql
id: UUID (Primary Key)
user_id: UUID (Foreign Key to users.id, Not Null)
favorite_type: VARCHAR(20) (food, exercise, workout_template)
item_id: VARCHAR(100) (Food ID, Exercise ID, or Template ID)
item_name: VARCHAR(200)
item_data: JSONB (Store full item data for quick access)
created_at: TIMESTAMP (Default: NOW())

-- Indexes
CREATE INDEX idx_user_favorites_user_type ON user_favorites(user_id, favorite_type);
```

### SQLite Schema (Local Database - Offline First)

The SQLite schema mirrors the Supabase schema with additional sync tracking tables:

#### Table: `sync_queue`

```sql
id: INTEGER PRIMARY KEY AUTOINCREMENT
table_name: TEXT NOT NULL
operation: TEXT NOT NULL (insert, update, delete)
record_id: TEXT NOT NULL
record_data: TEXT (JSON string)
sync_status: TEXT (pending, syncing, completed, failed)
attempt_count: INTEGER DEFAULT 0
last_attempt_at: TEXT (ISO timestamp)
created_at: TEXT (ISO timestamp)
```

#### Table: `sync_metadata`

```sql
id: INTEGER PRIMARY KEY AUTOINCREMENT
table_name: TEXT NOT NULL UNIQUE
last_sync_at: TEXT (ISO timestamp)
last_sync_status: TEXT (success, partial, failed)
pending_changes_count: INTEGER DEFAULT 0
```

#### Table: `exercise_cache`

```sql
-- Cache ExerciseDB API responses locally
id: INTEGER PRIMARY KEY AUTOINCREMENT
exercise_id: TEXT UNIQUE
exercise_name: TEXT
body_part: TEXT
equipment: TEXT
target_muscle: TEXT
gif_url: TEXT
instructions: TEXT (JSON array)
secondary_muscles: TEXT (JSON array)
cached_at: TEXT (ISO timestamp)
expires_at: TEXT (ISO timestamp, refresh monthly)
```

### Row-Level Security (RLS) Policies

All Supabase tables will have RLS enabled with policies:

```sql
-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE diet_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;
-- ... (repeat for all tables)

-- Users can only access their own data
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own diet logs"
  ON diet_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own diet logs"
  ON diet_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ... (similar policies for all user-specific tables)
```

### Database Functions

```sql
-- Calculate daily nutrition totals
CREATE FUNCTION get_daily_nutrition(user_uuid UUID, target_date DATE)
RETURNS TABLE(
  total_calories INTEGER,
  total_protein DECIMAL,
  total_carbs DECIMAL,
  total_fat DECIMAL,
  total_fiber DECIMAL
);

-- Get workout statistics for date range
CREATE FUNCTION get_workout_stats(user_uuid UUID, start_date DATE, end_date DATE)
RETURNS TABLE(
  total_workouts INTEGER,
  total_duration INTEGER,
  total_calories INTEGER,
  avg_duration DECIMAL
);

-- Calculate personal records
CREATE FUNCTION get_personal_records(user_uuid UUID, exercise_id_param VARCHAR)
RETURNS TABLE(
  max_weight DECIMAL,
  max_reps INTEGER,
  max_volume DECIMAL
);
```

---

## API Integration Strategy

### ExerciseDB API (RapidAPI)

**Base URL:** `https://exercisedb.p.rapidapi.com`  
**Rate Limit:** 1,000 requests/month (Free Tier)  
**Authentication:** RapidAPI Key in headers

#### Endpoints

**1. Get All Exercises**

```
GET /exercises
Query Params: limit=10, offset=0
Response: Array of exercise objects
```

**2. Get Exercise by ID**

```
GET /exercises/exercise/{id}
Response: Single exercise object
```

**3. Get Exercises by Body Part**

```
GET /exercises/bodyPart/{bodyPart}
Body Parts: back, cardio, chest, lower arms, lower legs, neck, shoulders, upper arms, upper legs, waist
Response: Filtered exercise array
```

**4. Get Exercises by Equipment**

```
GET /exercises/equipment/{equipment}
Equipment: barbell, dumbbell, bodyweight, cable, machine, kettlebell, resistance band
Response: Filtered exercise array
```

**5. Get Exercises by Target Muscle**

```
GET /exercises/target/{target}
Response: Filtered exercise array
```

#### Exercise Object Schema

```json
{
  "bodyPart": "chest",
  "equipment": "barbell",
  "gifUrl": "https://v2.exercisedb.io/image/...",
  "id": "0001",
  "name": "barbell bench press",
  "target": "pectorals",
  "secondaryMuscles": ["triceps", "anterior deltoid"],
  "instructions": ["Lie on the bench...", "Grab the barbell...", "..."]
}
```

#### Caching Strategy

**Objective:** Minimize API calls to stay within 1,000/month limit

**Implementation:**

1. **Initial Population:** Fetch all exercises on first app install (~1,300 exercises = 1 API call with pagination)
2. **Local Storage:** Store in SQLite `exercise_cache` table
3. **Cache Duration:** 30 days (refresh monthly)
4. **Refresh Logic:** Background job checks `expires_at`, fetches if expired
5. **Search:** Always search locally first, no API call needed
6. **User Workflow:** Browse locally cached exercises, instant results

**Estimated Monthly Usage:**

- Initial fetch: 1-2 calls
- Monthly refresh: 1-2 calls
- Emergency refresh: 1 call
- **Total: ~5 calls/month** (well within limit)

#### Error Handling

```javascript
async function fetchExercises() {
  try {
    // Check local cache first
    const cached = await getCachedExercises();
    if (cached && !isCacheExpired(cached)) {
      return cached;
    }

    // Fetch from API
    const response = await fetch(EXERCISEDB_URL, {
      headers: { "X-RapidAPI-Key": API_KEY },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    // Cache locally
    await cacheExercises(data);

    return data;
  } catch (error) {
    // Fallback to cached data even if expired
    const cached = await getCachedExercises();
    if (cached) {
      console.warn("Using expired cache due to API error");
      return cached;
    }

    // Ultimate fallback: hardcoded essential exercises
    return getEssentialExercises();
  }
}
```

### FatSecret API

**Current Status:** Demo mode with local Turkish food database  
**Future Enhancement:** Real API integration (optional)

#### Demo Mode (Current)

**Local Turkish Food Database:**

- 50+ common Turkish foods
- Accurate nutrition data
- No API calls required
- Instant search results

**Fallback International Foods:**

- 10+ demo FatSecret foods
- Simulated API delay
- Covers basic needs

#### Real API Integration (Optional Future)

**Base URL:** `https://platform.fatsecret.com/rest/server.api`  
**Authentication:** OAuth 1.0  
**Cost:** Free tier available, paid plans for higher limits

**Implementation Priority:** LOW (current demo mode sufficient)

### Supabase APIs

#### Supabase Client Configuration

```javascript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

#### Authentication APIs

```javascript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: "user@example.com",
  password: "secure-password",
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: "user@example.com",
  password: "password",
});

// Google OAuth
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: "google",
});

// Sign out
await supabase.auth.signOut();
```

#### Database APIs

```javascript
// Insert diet log
const { data, error } = await supabase.from("diet_logs").insert([
  {
    user_id: userId,
    food_name: "Chicken Breast",
    calories: 165,
    protein_g: 31,
    // ...
  },
]);

// Query workout logs
const { data, error } = await supabase
  .from("workout_logs")
  .select(
    `
    *,
    workout_exercises (
      *,
      workout_sets (*)
    )
  `
  )
  .eq("user_id", userId)
  .gte("workout_date", "2025-01-01")
  .order("workout_date", { ascending: false });

// Update profile
const { data, error } = await supabase
  .from("user_profiles")
  .update({ current_weight_kg: 75.5 })
  .eq("user_id", userId);
```

#### Storage APIs

```javascript
// Upload progress photo
const file = {
  uri: photoUri,
  name: `progress_${Date.now()}.jpg`,
  type: "image/jpeg",
};

const { data, error } = await supabase.storage
  .from("progress-photos")
  .upload(`${userId}/${file.name}`, file);

// Get public URL
const { data } = supabase.storage
  .from("progress-photos")
  .getPublicUrl(`${userId}/${file.name}`);
```

---

## Authentication & Authorization

### Supabase Authentication Implementation

#### Authentication Flow

```
1. User opens app
2. Check for existing session in AsyncStorage
3. If session exists:
   - Validate token with Supabase
   - Refresh if expired
   - Load user profile
   - Navigate to Main App
4. If no session:
   - Show Splash/Onboarding
   - Navigate to Login/Register
```

#### Email/Password Registration

**Requirements:**

- Valid email format
- Password minimum 8 characters
- Password must contain: uppercase, lowercase, number
- Terms of service acceptance

**Flow:**

1. User enters email and password
2. Validate inputs client-side
3. Call `supabase.auth.signUp()`
4. Supabase sends verification email
5. User verifies email (clicks link)
6. Email verified → Create user profile
7. Navigate to profile setup wizard

**Implementation:**

```javascript
async function registerUser(email, password, fullName) {
  try {
    // Validate password strength
    if (!isPasswordStrong(password)) {
      throw new Error("Password too weak");
    }

    // Sign up with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;

    // Create user profile in database
    const { error: profileError } = await supabase
      .from("user_profiles")
      .insert([
        {
          user_id: data.user.id,
          full_name: fullName,
        },
      ]);

    if (profileError) throw profileError;

    return { success: true, userId: data.user.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

#### Google OAuth

**Platforms:** iOS and Android  
**Configuration:**

- Google Cloud Console project
- OAuth 2.0 credentials (iOS and Android clients)
- Add redirect URIs to Supabase Auth settings

**Flow:**

1. User taps "Continue with Google"
2. Open Google OAuth web flow
3. User authorizes app
4. Redirect back to app with token
5. Create/update user profile
6. Navigate to Main App or Profile Setup

**Implementation:**

```javascript
async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "myfitapp://auth/callback",
        skipBrowserRedirect: false,
      },
    });

    if (error) throw error;

    // Check if profile exists
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", data.user.id)
      .single();

    // If new user, create profile
    if (!profile) {
      await createUserProfile(data.user.id, data.user.email);
      return { success: true, newUser: true };
    }

    return { success: true, newUser: false };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

#### Apple Sign-In

**Platform:** iOS (required for App Store)  
**Configuration:**

- Apple Developer account
- Enable Sign in with Apple capability
- Configure in Supabase Auth settings

**Flow:** Similar to Google OAuth

#### Password Reset

**Flow:**

1. User taps "Forgot Password"
2. Enter email address
3. Supabase sends password reset email
4. User clicks link in email
5. Enter new password
6. Password updated

**Implementation:**

```javascript
async function sendPasswordReset(email) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "myfitapp://auth/reset-password",
    });

    if (error) throw error;

    return { success: true, message: "Check your email for reset link" };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function updatePassword(newPassword) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

#### Session Management

**Token Storage:** Expo SecureStore (encrypted)  
**Token Expiry:** 1 hour (access token), 30 days (refresh token)  
**Auto-Refresh:** Handled by Supabase client

**Implementation:**

```javascript
// Check session on app launch
async function initializeAuth() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    // Valid session exists
    return { authenticated: true, user: session.user };
  }

  return { authenticated: false };
}

// Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_IN") {
    // User signed in
    loadUserData(session.user.id);
  } else if (event === "SIGNED_OUT") {
    // User signed out
    clearLocalData();
  } else if (event === "TOKEN_REFRESHED") {
    // Token refreshed automatically
    console.log("Session refreshed");
  }
});
```

### Authorization & Security

#### Row-Level Security (RLS)

All Supabase tables are protected with RLS policies ensuring users can only access their own data.

**Example Policies:**

```sql
-- user_profiles table
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- diet_logs table
CREATE POLICY "Users can manage own diet logs"
  ON diet_logs FOR ALL
  USING (auth.uid() = user_id);

-- workout_logs table
CREATE POLICY "Users can manage own workout logs"
  ON workout_logs FOR ALL
  USING (auth.uid() = user_id);
```

#### Client-Side Authorization

```javascript
// Utility function to check if user owns resource
async function checkResourceOwnership(tableName, resourceId, userId) {
  const { data, error } = await supabase
    .from(tableName)
    .select("user_id")
    .eq("id", resourceId)
    .single();

  if (error || !data) return false;

  return data.user_id === userId;
}

// Before deleting a workout
async function deleteWorkout(workoutId) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isOwner = await checkResourceOwnership(
    "workout_logs",
    workoutId,
    user.id
  );

  if (!isOwner) {
    throw new Error("Unauthorized: You can only delete your own workouts");
  }

  // Proceed with deletion
  await supabase.from("workout_logs").delete().eq("id", workoutId);
}
```

---

## User Flows

### Primary User Flow

```
1. App Launch
   ├─ Has Session? → Yes → Main Dashboard
   └─ No Session
      ├─ First Time? → Yes → Onboarding Carousel
      └─ Returning → Login/Register Screen

2. Onboarding (First Time Users)
   ├─ Splash Screen (2s)
   ├─ Welcome Carousel (3-4 screens)
   │  ├─ Track Your Nutrition
   │  ├─ Log Your Workouts
   │  ├─ Analyze Your Progress
   │  └─ Achieve Your Goals
   ├─ Sign Up / Log In Choice
   └─ Profile Setup Wizard
      ├─ Personal Info (name, age, gender, height, weight)
      ├─ Health Goals (lose weight, gain muscle, maintain)
      ├─ Activity Level (sedentary → very active)
      ├─ Calculate Calorie Goals
      └─ Complete → Main Dashboard

3. Main Dashboard
   ├─ Quick Stats (weight, calories today, workouts this week)
   ├─ Recent Activity Feed
   ├─ Quick Actions (Add Meal, Start Workout, Log Weight)
   └─ Bottom Tabs
      ├─ Diet
      ├─ Workout
      ├─ Progress
      └─ Profile

4. Diet Tracking Flow
   ├─ Diet Tab → Daily Overview
   │  ├─ Macro Progress Circles
   │  ├─ Meal Sections (Breakfast, Lunch, Dinner, Snacks)
   │  └─ Water Tracker
   ├─ Tap Meal Section → Add Food
   │  ├─ Search Food (local + FatSecret)
   │  ├─ Recent Foods
   │  ├─ Favorite Foods
   │  └─ Custom Food
   ├─ Select Food → Food Detail
   │  ├─ Nutrition Info
   │  ├─ Portion Selection
   │  └─ Confirm
   ├─ Meal Updated → Back to Diet Overview
   └─ View Weekly Summary

5. Workout Tracking Flow
   ├─ Workout Tab → Workout Dashboard
   │  ├─ Today's Workouts
   │  ├─ Workout Templates
   │  ├─ Recent Workouts
   │  └─ Start Workout (FAB)
   ├─ Start Workout
   │  ├─ Create Custom
   │  └─ Use Template
   ├─ Add Exercises
   │  ├─ Browse Exercise Library
   │  ├─ Filter by Body Part
   │  ├─ Search Exercises
   │  └─ Add to Workout
   ├─ Log Sets
   │  ├─ Enter Reps
   │  ├─ Enter Weight
   │  ├─ Complete Set
   │  └─ Rest Timer
   ├─ Finish Workout
   │  ├─ Workout Summary
   │  ├─ Save
   │  └─ View History
   └─ Workout History
      ├─ Calendar View
      ├─ Workout Details
      └─ Edit/Delete

6. Progress Tracking Flow
   ├─ Progress Tab → Progress Dashboard
   │  ├─ Weight Chart
   │  ├─ Measurements
   │  ├─ Progress Photos
   │  └─ Analytics Tabs
   ├─ Add Weight
   │  ├─ Enter Weight
   │  ├─ Add Note
   │  └─ Save → Chart Updates
   ├─ Add Measurement
   │  ├─ Select Body Part
   │  ├─ Enter Measurement
   │  └─ Save
   ├─ Add Progress Photo
   │  ├─ Take Photo / Select from Gallery
   │  ├─ Select Photo Type (front/side/back)
   │  ├─ Upload to Supabase Storage
   │  └─ Save
   └─ View Analytics
      ├─ Nutrition Analytics
      ├─ Workout Analytics
      └─ Combined Progress

7. Settings & Profile Flow
   ├─ Profile Tab → Profile Screen
   │  ├─ Profile Photo
   │  ├─ Personal Info
   │  ├─ Health Goals
   │  └─ Settings
   ├─ Edit Profile
   │  ├─ Update Info
   │  ├─ Update Goals
   │  └─ Save
   ├─ App Settings
   │  ├─ Notifications
   │  ├─ Units (Metric/Imperial)
   │  ├─ Theme
   │  └─ Data Sync
   ├─ Data Management
   │  ├─ Export Data
   │  ├─ Clear Cache
   │  └─ Sync Now
   └─ Logout
      ├─ Confirm
      └─ Clear Local Data → Login Screen
```

### Alternative Flows

#### Quick Meal Logging

```
Dashboard → Quick Add Meal → Recent Foods → Select → Portion → Confirm → Done
(Estimated time: 15 seconds)
```

#### Quick Workout Repeat

```
Workout Tab → Recent Workouts → Select Previous → Start → Log Sets → Finish
(Reuses previous workout structure)
```

#### Photo Progress Only

```
Progress Tab → Photos → Take Photo → Upload → Done
(No weight/measurements required)
```

---

## UI/UX Design

### Design Principles

1. **Simplicity First:** Clean, uncluttered interfaces focusing on core tasks
2. **Offline-First UX:** All actions work immediately, sync happens in background
3. **Progress Visibility:** Always show user their progress toward goals
4. **Consistency:** Unified design language across all screens
5. **Accessibility:** WCAG 2.1 AA compliance, inclusive design
6. **Performance:** Instant feedback, smooth animations, fast load times

### Design System

#### Color Palette

**Primary Colors (Existing):**

```javascript
primary: "#6C5CE7"; // Purple
secondary: "#FD79A8"; // Pink accent
background: "#F8F9FA"; // Light gray
surface: "#FFFFFF"; // White cards
```

**Gradients:**

```javascript
primaryGradient: ["#6C5CE7", "#A29BFE"];
successGradient: ["#00B894", "#55EFC4"];
warningGradient: ["#FDCB6E", "#FD79A8"];
```

**Semantic Colors:**

```javascript
success: "#00B894"; // Green (goals met)
warning: "#FDCB6E"; // Orange (approaching limit)
error: "#D63031"; // Red (over limit)
info: "#74B9FF"; // Blue (information)
text: "#2D3436"; // Dark gray (primary text)
textSecondary: "#636E72"; // Medium gray (secondary text)
textLight: "#B2BEC3"; // Light gray (placeholder)
```

**Macro-Specific Colors:**

```javascript
protein: "#E17055"; // Orange-red
carbs: "#74B9FF"; // Blue
fat: "#FDCB6E"; // Yellow
fiber: "#00B894"; // Green
calories: "#6C5CE7"; // Purple
```

#### Typography

**System Fonts:** Platform default (San Francisco on iOS, Roboto on Android)

```javascript
fontSizes: {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36
}

fontWeights: {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700'
}
```

#### Spacing

**8px Grid System:**

```javascript
spacing: {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48
}
```

#### Border Radius

```javascript
borderRadius: {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999  // Circle
}
```

#### Shadows

```javascript
shadow: {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5
  }
}
```

### Component Library

#### Core Components

**1. Button Component**

Variants: Primary, Secondary, Outline, Text  
States: Default, Pressed, Disabled  
Sizes: Small (36px), Medium (44px), Large (56px)

```javascript
<Button
  variant="primary"
  size="medium"
  onPress={handlePress}
  disabled={false}
  loading={false}
>
  Start Workout
</Button>
```

**2. Card Component**

Used for meal items, workout exercises, stats

```javascript
<Card variant="elevated" padding="md">
  <CardHeader title="Bench Press" subtitle="Chest" />
  <CardContent>{/* Content */}</CardContent>
  <CardActions>
    <Button variant="text">Edit</Button>
    <Button variant="text">Delete</Button>
  </CardActions>
</Card>
```

**3. CircularProgress Component**

For macro tracking (protein, carbs, fats, calories)

```javascript
<CircularProgress
  value={150}
  maxValue={200}
  size={120}
  strokeWidth={12}
  color="#E17055"
  label="Protein"
  unit="g"
/>
```

**4. Input Component**

```javascript
<Input
  label="Weight"
  placeholder="Enter weight"
  value={value}
  onChangeText={setValue}
  keyboardType="numeric"
  suffix="kg"
  error={error}
  helperText="Current weight for tracking"
/>
```

**5. Modal Component**

```javascript
<Modal
  visible={isVisible}
  onClose={handleClose}
  title="Add Food"
  size="fullscreen"
>
  {/* Modal content */}
</Modal>
```

### Key Screens

#### 1. Splash Screen

- App logo centered
- Purple gradient background
- Loading indicator
- Version number (bottom)

#### 2. Onboarding Screens

**Welcome Carousel (3 screens):**

Screen 1: Track Your Nutrition

- Hero illustration (food tracking)
- "Log meals effortlessly with our extensive food database"

Screen 2: Log Your Workouts

- Hero illustration (workout)
- "Record every rep with our comprehensive exercise library"

Screen 3: Analyze Your Progress

- Hero illustration (charts)
- "Visualize your fitness journey with detailed analytics"

**Pagination dots, Skip/Next buttons**

#### 3. Login/Register Screen

**Login:**

- Email input
- Password input (show/hide toggle)
- "Forgot Password?" link
- Login button (primary)
- Divider with "OR"
- "Continue with Google" button
- "Continue with Apple" button (iOS)
- "Don't have an account? Sign Up" link

**Register:**

- Full name input
- Email input
- Password input (with strength indicator)
- Confirm password input
- Terms checkbox
- Register button (primary)
- OAuth options
- "Already have account? Log In" link

#### 4. Profile Setup Wizard

**Step 1: Personal Info**

- Profile photo upload (optional)
- Full name
- Age (numeric input)
- Gender (select: Male, Female, Other)
- Height (with unit toggle: cm/ft)
- Current weight (with unit toggle: kg/lb)

**Step 2: Health Goals**

- Goal selection (cards):
  - Lose Weight
  - Gain Muscle
  - Maintain Weight
  - General Health
- Target weight (if applicable)

**Step 3: Activity Level**

- Activity level cards:
  - Sedentary (little/no exercise)
  - Lightly Active (1-3 days/week)
  - Moderately Active (3-5 days/week)
  - Very Active (6-7 days/week)
  - Extra Active (athlete/physical job)

**Step 4: Calculated Goals**

- Display calculated daily calorie goal
- Macro recommendations (protein, carbs, fats)
- Confirm or customize
- Complete button → Main Dashboard

#### 5. Main Dashboard

**Header:**

- Greeting ("Good morning, [Name]")
- Notification icon (badge if unread)
- Profile photo (tap → Profile)

**Quick Stats Cards (Horizontal scroll):**

- Today's Calories (circular progress)
- Weight This Week (mini chart)
- Workouts This Week (count badge)
- Current Streak (fire icon + days)

**Quick Actions (3 large buttons):**

- Add Meal (food icon)
- Start Workout (dumbbell icon)
- Log Weight (scale icon)

**Recent Activity Feed:**

- Last 5 activities (meals logged, workouts completed, weight entries)
- Timestamps
- Tap to view details

**Bottom Tab Navigator:**

- Diet (fork/knife icon)
- Workout (dumbbell icon)
- Progress (chart icon)
- Profile (user icon)

#### 6. Diet Screen

**Header:**

- Date selector (< Today >)
- Calendar icon (tap → date picker)
- Weekly view toggle

**Macro Summary (Top):**

- 4 circular progress indicators (row):
  - Calories (purple)
  - Protein (orange-red)
  - Carbs (blue)
  - Fat (yellow)
- Each shows: current/goal, percentage

**Water Tracker:**

- Glass icons (8 glasses)
- Fill animation on tap
- Current/goal text

**Meal Sections (4):**
Each section:

- Header (Breakfast ☀️, Lunch 🌞, Dinner 🌙, Snacks 🍎)
- Total calories for meal
- Add Food button
- List of logged foods:
  - Food name
  - Portion size
  - Calories
  - Macros (P/C/F)
  - Edit/Delete swipe actions

**Weekly Summary Button (Bottom):**

- Tap → Weekly nutrition chart modal

#### 7. Food Search Screen

**Header:**

- Back button
- Search input (auto-focus)
- Filter icon (category filter)

**Tabs:**

- All Foods
- Recent
- Favorites
- Custom

**Search Results:**

- Food cards:
  - Food name
  - Category badge
  - Calories per 100g
  - Macros preview (P/C/F)
  - Favorite icon (toggle)
  - Tap → Food Detail

**Empty State:**

- Magnifying glass illustration
- "No foods found"
- "Try a different search term"

**Create Custom Food Button (FAB):**

- Floating action button
- Opens custom food form

#### 8. Food Detail Screen

**Header:**

- Food name
- Category badge
- Favorite icon (toggle)

**Nutrition Facts Card:**

- Calories (large)
- Macros (protein, carbs, fat, fiber)
- Per 100g/100ml

**Portion Selection:**

- Portion presets (buttons):
  - 50g, 100g, 200g, 1 serving
- Custom amount (numeric input)
- Unit selector (g, ml, serving, piece)
- Real-time nutrition calculation

**Meal Selection:**

- Dropdown: Breakfast, Lunch, Dinner, Snack

**Add to Meal Button (Primary, Bottom):**

- Sticky button
- Adds to selected meal
- Returns to Diet Screen

#### 9. Workout Dashboard Screen

**Header:**

- Date selector
- "Start Workout" button (primary, top-right)

**Today Section:**

- If workout in progress:
  - Current workout card
  - Exercise count, duration, "Continue" button
- If no workout:
  - Empty state: "No workout today"
  - "Start Workout" CTA

**Workout Templates:**

- Horizontal scroll cards:
  - Template name
  - Exercise count
  - Estimated duration
  - Tap → Start from template

**Recent Workouts:**

- List of past 5 workouts:
  - Date
  - Workout name
  - Duration
  - Exercises count
  - Tap → View details
  - Long press → Repeat workout

**Statistics Card:**

- This Week: X workouts, Y minutes
- Calories burned: Z kcal
- Tap → Full workout analytics

#### 10. Exercise Library Screen

**Header:**

- Back button
- Search input
- Filter icon

**Filters (Chips):**

- Body Part: All, Chest, Back, Shoulders, Arms, Legs, Core, Cardio
- Equipment: All, Barbell, Dumbbell, Bodyweight, Machine, Cable
- Difficulty: All, Beginner, Intermediate, Advanced

**Exercise List:**

- Exercise cards (2 columns grid):
  - Exercise GIF (auto-play on scroll)
  - Exercise name
  - Body part badge
  - Equipment icon
  - Favorite icon
  - Tap → Exercise Detail

**Custom Exercise Button (FAB):**

- Create custom exercise

#### 11. Exercise Detail Screen

**Header:**

- Exercise name
- Favorite icon
- Share icon (future)

**GIF Demonstration:**

- Full-width GIF (auto-loop)
- Fullscreen button

**Info Cards:**

- Body Part: Chest
- Equipment: Barbell
- Target Muscle: Pectorals
- Secondary Muscles: Triceps, Front Delts
- Difficulty: Intermediate

**Instructions:**

- Numbered step-by-step list
- Clear, concise steps

**Tips Section:**

- Bullet points
- Form cues
- Safety tips

**Personal Records (if logged before):**

- Max Weight: 100kg (date)
- Max Reps: 12 (date)
- Max Volume: 1200kg (date)

**Add to Workout Button (Primary, Bottom):**

- Adds to active workout
- Or prompts to start workout

#### 12. Workout Entry Screen (Active Workout)

**Header:**

- Workout name (editable)
- Timer (elapsed time)
- Menu (save, cancel, edit workout)

**Exercise List:**

- Drag handles for reordering
- Each exercise card:
  - Exercise name
  - Target: X sets
  - Previous best (if available)
  - Set rows:
    - Set number
    - Weight input (kg)
    - Reps input
    - Checkmark (complete)
    - Previous set (ghost text)
  - Add Set button
  - Delete exercise button

**Rest Timer (Modal):**

- Shows after completing set
- Countdown: 60s (customizable)
- Skip rest button
- Next set button

**Add Exercise Button:**

- Opens exercise library
- Returns to workout with selection

**Finish Workout Button (Primary, Bottom):**

- Complete workout
- Save to history
- Show summary

#### 13. Workout Completion Screen

**Header:**

- "Workout Complete!" (celebration icon)
- Date and time

**Summary Cards:**

- Total Duration: 45 min
- Exercises: 5
- Total Sets: 15
- Total Volume: 2,500 kg
- Calories Burned: ~320 kcal

**Personal Records (if any):**

- "New PR!" badge
- Exercise name + record

**Notes Section (Optional):**

- Text area for workout notes
- Feeling, energy level, observations

**Save Button (Primary):**

- Saves workout
- Returns to Workout Dashboard

**Discard Button (Text):**

- Confirms before discarding

#### 14. Progress Dashboard Screen

**Header:**

- Date range selector (This Week, This Month, All Time)
- Export data button

**Weight Chart:**

- Line chart (7-day or 30-day)
- Current weight (large)
- Change from last week (+/- badge)
- Goal weight (dotted line)
- Tap → Weight History

**Quick Actions:**

- Add Weight button
- Add Measurement button
- Add Photo button

**Tabs:**

- Weight
- Measurements
- Photos
- Nutrition Analytics
- Workout Analytics

#### 15. Weight History Screen

**Header:**

- Add Weight button (top-right)

**Chart:**

- Full-screen line chart
- Moving average line
- Goal weight line
- Zoom and pan gestures

**Weight Entries List:**

- Date, weight, change from previous
- Notes (if any)
- Edit/Delete swipe actions

**Statistics Card:**

- Starting weight
- Current weight
- Total change
- Average weekly change
- Projected goal date

#### 16. Measurements Screen

**Header:**

- Add Measurement button

**Body Diagram:**

- Visual human body outline
- Highlighted measurement points
- Tap point → View measurements

**Measurement Cards:**

- Chest: 100cm (trend arrow)
- Waist: 85cm (trend arrow)
- Biceps: 35cm (trend arrow)
- etc.

**Tap card:**

- Detailed chart for that measurement
- History list

#### 17. Progress Photos Screen

**Header:**

- Add Photo button
- Filter: Front, Side, Back

**Photo Grid:**

- 3 columns
- Date badge on each photo
- Tap → Fullscreen view

**Fullscreen Photo View:**

- Swipe between photos
- Date and weight at photo
- Notes
- Delete button

**Before/After Comparison:**

- Select two photos
- Side-by-side or overlay view
- Date range shown

#### 18. Nutrition Analytics Screen

**Header:**

- Date range selector

**Charts:**

**Daily Calorie Intake (Line Chart):**

- X-axis: Dates
- Y-axis: Calories
- Goal line (dotted)
- Tap data point → That day's details

**Macro Distribution (Pie Chart):**

- Protein, Carbs, Fat percentages
- Color-coded
- Tap slice → Details

**Weekly Average (Bar Chart):**

- 7 bars (Mon-Sun)
- Average calories per day

**Meal Timing Heatmap:**

- Visual representation of meal times
- Identifies patterns

**Statistics Cards:**

- Average daily calories
- Goal adherence: 85%
- Protein avg: 150g/day
- Current streak: 7 days

#### 19. Workout Analytics Screen

**Header:**

- Date range selector

**Charts:**

**Workout Frequency (Bar Chart):**

- Workouts per week over time

**Volume per Muscle Group (Bar Chart):**

- Total volume (sets × reps × weight) by body part
- Identifies imbalances

**Strength Progression (Line Chart):**

- Select exercise
- Max weight over time
- Trend line

**Statistics Cards:**

- Total workouts: 24
- Total duration: 18 hours
- Calories burned: 5,000 kcal
- Average workout: 45 min
- Most trained: Chest (12 sessions)

**Personal Records List:**

- Exercise name
- Record type (weight, reps, volume)
- Value and date

#### 20. Profile Screen

**Header:**

- Edit button (top-right)

**Profile Card:**

- Profile photo (tap to change)
- Full name
- Email
- Member since date

**Health Info Cards:**

- Current weight: 75kg (tap → Weight history)
- Goal weight: 70kg
- Height: 180cm
- Age: 28
- Activity level: Moderately Active

**Goals Section:**

- Health goal: Lose Weight
- Daily calorie goal: 2,000 kcal
- Macro goals: P/C/F
- Edit goals button

**Settings Menu:**

- Notifications
- Units (Metric/Imperial)
- Language (English, Turkish)
- Data Sync
- Privacy Policy
- Terms of Service
- About App

**Data Management:**

- Export Data button
- Clear Cache button
- Sync Now button
- Last sync: 2 minutes ago

**Logout Button (Destructive):**

- Confirms before logout
- Option to keep local data

### Accessibility Features

#### Screen Reader Support

- All interactive elements have `accessibilityLabel`
- Form inputs have `accessibilityHint`
- Dynamic content announces changes
- Proper heading hierarchy

**Example:**

```javascript
<TouchableOpacity
  accessibilityLabel="Add breakfast meal"
  accessibilityHint="Opens food search to add food to breakfast"
  onPress={handleAddMeal}
>
  <Icon name="add" />
</TouchableOpacity>
```

#### Touch Targets

- Minimum 44×44 points for all interactive elements
- Adequate spacing between touch targets
- Visual feedback on press (opacity, scale)

#### Color Contrast

- Text contrast ratio ≥ 4.5:1 (WCAG AA)
- Interactive elements ≥ 3:1
- Avoid color-only information (use icons, labels)

#### Font Scaling

- Support dynamic type (system font scaling)
- Test with largest accessibility sizes
- Graceful layout degradation

#### Haptic Feedback

- Light haptic on button press
- Medium haptic on toggle
- Success haptic on goal achievement
- Error haptic on validation failure

```javascript
import * as Haptics from "expo-haptics";

// On button press
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

// On success
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

// On error
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
```

---

## Analytics & Insights

### Nutrition Analytics Features

#### Daily Tracking

**Calorie Tracking:**

- Real-time calorie counter
- Visual progress circle (current/goal)
- Color-coded: Green (under), Yellow (near), Red (over)
- Goal achievement percentage

**Macro Tracking:**

- Protein, Carbohydrates, Fats, Fiber
- Individual progress circles for each
- Gram amounts with percentages
- Daily macro distribution

#### Weekly Analytics

**Weekly Nutrition Summary:**

- 7-day grid view
- Average daily calories
- Average macros
- Best day (closest to goal)
- Worst day (furthest from goal)
- Consistency score

**Weekly Trends:**

- Line chart: Daily calories over 7 days
- Goal line overlay
- Identify patterns (weekday vs weekend)
- Average vs goal comparison

#### Monthly Analytics

**Monthly Overview:**

- Total calories consumed
- Average daily intake
- Goal adherence percentage (days on track / total days)
- Monthly macro averages
- Weight change correlation

**Nutrition Patterns:**

- Meal timing heatmap (when you eat most)
- Macro ratio trends
- Food category breakdown:
  - Protein sources (chicken, fish, beef, plant-based)
  - Carb sources (rice, bread, pasta, fruits)
  - Fat sources (nuts, oils, dairy)
- Most logged foods (top 10)

#### Streaks & Achievements

**Tracking Streaks:**

- Current streak (consecutive days logged)
- Longest streak
- Total days logged
- Logging consistency percentage

**Achievements/Badges:**

- First meal logged
- 7-day streak
- 30-day streak
- 100 days logged
- Perfect week (all days on target)
- Goal achieved (reached goal weight)

### Workout Analytics Features

#### Weekly Workout Stats

**Frequency Tracking:**

- Workouts completed this week (X / Y goal)
- Progress circle
- Days worked out vs rest days
- Weekly goal achievement

**Volume Tracking:**

- Total sets performed
- Total reps completed
- Total weight lifted (volume = sets × reps × weight)
- Volume by muscle group

**Time Tracking:**

- Total workout time this week
- Average workout duration
- Longest workout
- Shortest workout

#### Monthly Workout Stats

**Consistency Metrics:**

- Total workouts this month
- Workouts per week average
- Rest days per week average
- Consistency score

**Volume Progression:**

- Total volume trend (weekly comparison)
- Volume by muscle group (stacked bar chart)
- Identify undertrained muscle groups

**Exercise Distribution:**

- Most performed exercises
- Exercises by body part (pie chart)
- Equipment usage breakdown

#### Strength Progression

**Personal Records (PRs):**

- Track max weight for each exercise
- Max reps at specific weight
- Max volume (single workout)
- PR notifications when achieved
- PR history timeline

**Strength Charts:**

- Select exercise
- Line chart: Max weight over time
- Trend analysis (gaining, maintaining, declining)
- Projected future performance

**Volume Progression:**

- Total volume per muscle group over time
- Week-over-week comparison
- Month-over-month comparison

#### Exercise Analytics

**Exercise Performance:**

- Average weight per exercise
- Average reps per exercise
- Total times performed
- Last performed date
- Performance trend (improving, stable, declining)

**Body Part Balance:**

- Radar chart showing volume distribution
- Identify imbalances (e.g., chest overdeveloped vs back)
- Recommendations for balanced training

### Progress Analytics Features

#### Weight Tracking Analytics

**Weight Trends:**

- Line chart with data points
- 7-day moving average (smooths daily fluctuations)
- 30-day moving average
- Linear trend line
- Goal weight line (dotted)

**Weight Statistics:**

- Starting weight
- Current weight
- Change from start (kg and %)
- Weekly average change
- Best week (largest drop for weight loss)
- Projected goal achievement date

**Weight Correlations:**

- Weight vs calorie intake chart
- Weight vs workout frequency
- Identify patterns (e.g., weight drops on high-activity weeks)

#### Measurement Analytics

**Body Measurements Tracking:**

- Individual charts for each measurement
- Multi-line chart (compare multiple measurements)
- Percentage change from start
- Largest change area
- Smallest change area

**Body Composition Estimates (Future):**

- Estimated body fat percentage (based on measurements)
- Lean mass estimation
- Body shape changes

#### Photo Progress

**Photo Timeline:**

- Chronological photo grid
- Before/after sliders
- Time-lapse feature (future: auto-generate progress video)
- Date and weight overlays

**Visual Progress:**

- Side-by-side comparison
- Overlay mode (opacity slider)
- Zoom and pan gestures
- Annotations (circle muscle growth areas)

### Combined Analytics Dashboard

**Progress Overview:**

- Quick stats cards:
  - Weight: Current, Change, Goal
  - Workouts: This Week, This Month
  - Nutrition: Streak, Adherence %
  - Calories Burned: Total, Average/day

**Activity Feed:**

- Recent milestones
- PRs achieved
- Streaks maintained
- Goals reached

**Insights & Recommendations:**

- AI-powered insights (future enhancement)
- "You're burning more calories on workout days"
- "Your protein intake is consistent"
- "Consider adding more leg workouts"

**Data Export:**

- Export all data as JSON
- Export charts as images
- Share progress summary (PDF/image)

---

## Data Synchronization

### Sync Architecture Overview

**Strategy:** Offline-First with Background Sync

```
User Action (e.g., Log Meal)
    ↓
Save to SQLite (Instant)
    ↓
Update UI (Immediate Feedback)
    ↓
Add to Sync Queue
    ↓
Check Network Status
    ↓
If Online → Sync to Supabase (Background)
If Offline → Queue for Later
    ↓
Sync Complete → Remove from Queue
    ↓
Update Local Data with Server ID
```

### Sync Implementation

#### Sync Queue System

**Table: `sync_queue`**

```sql
CREATE TABLE sync_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL, -- 'insert', 'update', 'delete'
  record_id TEXT NOT NULL,
  record_data TEXT, -- JSON string
  sync_status TEXT DEFAULT 'pending', -- 'pending', 'syncing', 'completed', 'failed'
  attempt_count INTEGER DEFAULT 0,
  last_attempt_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

#### Sync Operations

**1. Add to Queue**

```javascript
async function addToSyncQueue(tableName, operation, recordId, recordData) {
  const queue = await db.executeSql(
    `INSERT INTO sync_queue (table_name, operation, record_id, record_data) 
     VALUES (?, ?, ?, ?)`,
    [tableName, operation, recordId, JSON.stringify(recordData)]
  );

  // Trigger sync if online
  if (await isOnline()) {
    syncQueue();
  }
}
```

**2. Process Sync Queue**

```javascript
async function syncQueue() {
  const pending = await db.executeSql(
    `SELECT * FROM sync_queue WHERE sync_status = 'pending' ORDER BY created_at ASC LIMIT 50`
  );

  for (const item of pending.rows._array) {
    try {
      await syncItem(item);
    } catch (error) {
      await handleSyncError(item, error);
    }
  }
}

async function syncItem(item) {
  // Update status to 'syncing'
  await db.executeSql(
    `UPDATE sync_queue SET sync_status = 'syncing', last_attempt_at = ? WHERE id = ?`,
    [new Date().toISOString(), item.id]
  );

  const recordData = JSON.parse(item.record_data);

  // Perform appropriate Supabase operation
  if (item.operation === "insert") {
    const { data, error } = await supabase
      .from(item.table_name)
      .insert([recordData]);

    if (error) throw error;

    // Update local record with server ID
    if (data && data[0]) {
      await updateLocalRecordId(item.table_name, item.record_id, data[0].id);
    }
  } else if (item.operation === "update") {
    const { error } = await supabase
      .from(item.table_name)
      .update(recordData)
      .eq("id", item.record_id);

    if (error) throw error;
  } else if (item.operation === "delete") {
    const { error } = await supabase
      .from(item.table_name)
      .delete()
      .eq("id", item.record_id);

    if (error) throw error;
  }

  // Mark as completed
  await db.executeSql(
    `UPDATE sync_queue SET sync_status = 'completed' WHERE id = ?`,
    [item.id]
  );

  // Remove from queue after successful sync
  await db.executeSql(`DELETE FROM sync_queue WHERE id = ?`, [item.id]);
}
```

**3. Error Handling**

```javascript
async function handleSyncError(item, error) {
  const attemptCount = item.attempt_count + 1;
  const maxAttempts = 3;

  if (attemptCount >= maxAttempts) {
    // Mark as failed after max attempts
    await db.executeSql(
      `UPDATE sync_queue SET sync_status = 'failed', attempt_count = ? WHERE id = ?`,
      [attemptCount, item.id]
    );

    // Notify user of sync failure
    showNotification(
      "Sync Failed",
      "Some data could not be synced. Please try manual sync."
    );
  } else {
    // Retry with exponential backoff
    await db.executeSql(
      `UPDATE sync_queue SET sync_status = 'pending', attempt_count = ? WHERE id = ?`,
      [attemptCount, item.id]
    );

    // Schedule retry
    const delay = Math.pow(2, attemptCount) * 1000; // 2s, 4s, 8s
    setTimeout(() => syncQueue(), delay);
  }
}
```

#### Network Detection

```javascript
import NetInfo from "@react-native-community/netinfo";

let isOnlineState = true;

// Subscribe to network state
NetInfo.addEventListener((state) => {
  const wasOffline = !isOnlineState;
  isOnlineState = state.isConnected;

  // If just came online, trigger sync
  if (wasOffline && isOnlineState) {
    console.log("Back online, syncing...");
    syncQueue();
  }
});

async function isOnline() {
  const state = await NetInfo.fetch();
  return state.isConnected;
}
```

#### Sync Triggers

**1. App Foreground**

```javascript
import { AppState } from "react-native";

AppState.addEventListener("change", (nextAppState) => {
  if (nextAppState === "active") {
    // App came to foreground, sync
    syncQueue();
  }
});
```

**2. Manual Sync**

```javascript
// User taps "Sync Now" in settings
async function manualSync() {
  setIsSyncing(true);

  try {
    await syncQueue();
    await pullLatestData();

    showToast("Sync complete");
  } catch (error) {
    showToast("Sync failed: " + error.message);
  } finally {
    setIsSyncing(false);
  }
}
```

**3. Periodic Background Sync**

```javascript
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";

const BACKGROUND_SYNC_TASK = "background-sync";

TaskManager.defineTask(BACKGROUND_SYNC_TASK, async () => {
  try {
    await syncQueue();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// Register background sync (runs every 15 minutes when app is backgrounded)
await BackgroundFetch.registerTaskAsync(BACKGROUND_SYNC_TASK, {
  minimumInterval: 60 * 15, // 15 minutes
  stopOnTerminate: false,
  startOnBoot: true,
});
```

### Conflict Resolution

**Strategy:** Last-Write-Wins (LWW) with Timestamp

```javascript
async function resolveConflict(localRecord, serverRecord) {
  const localTimestamp = new Date(localRecord.updated_at);
  const serverTimestamp = new Date(serverRecord.updated_at);

  if (localTimestamp > serverTimestamp) {
    // Local is newer, push to server
    await supabase.from(tableName).update(localRecord).eq("id", localRecord.id);

    return localRecord;
  } else {
    // Server is newer, update local
    await db.executeSql(`UPDATE ${tableName} SET data = ? WHERE id = ?`, [
      JSON.stringify(serverRecord),
      localRecord.id,
    ]);

    return serverRecord;
  }
}
```

### Pull Data from Server

**Initial Sync (First Login):**

```javascript
async function initialSync(userId) {
  try {
    // Pull user profile
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (profile) {
      await saveProfileLocally(profile);
    }

    // Pull diet logs (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: dietLogs } = await supabase
      .from("diet_logs")
      .select("*")
      .eq("user_id", userId)
      .gte("log_date", thirtyDaysAgo.toISOString());

    if (dietLogs) {
      await saveDietLogsLocally(dietLogs);
    }

    // Pull workout logs (last 30 days)
    const { data: workoutLogs } = await supabase
      .from("workout_logs")
      .select(
        `
        *,
        workout_exercises (
          *,
          workout_sets (*)
        )
      `
      )
      .eq("user_id", userId)
      .gte("workout_date", thirtyDaysAgo.toISOString());

    if (workoutLogs) {
      await saveWorkoutLogsLocally(workoutLogs);
    }

    // Pull progress data
    const { data: weights } = await supabase
      .from("progress_weights")
      .select("*")
      .eq("user_id", userId)
      .order("measurement_date", { ascending: false })
      .limit(100);

    if (weights) {
      await saveWeightsLocally(weights);
    }

    // Update sync metadata
    await updateSyncMetadata("diet_logs", new Date());
    await updateSyncMetadata("workout_logs", new Date());
    await updateSyncMetadata("progress_weights", new Date());
  } catch (error) {
    console.error("Initial sync error:", error);
    throw error;
  }
}
```

**Incremental Sync (Subsequent Syncs):**

```javascript
async function incrementalSync(userId, tableName) {
  // Get last sync timestamp
  const lastSync = await getLastSyncTimestamp(tableName);

  // Pull records updated since last sync
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("user_id", userId)
    .gt("updated_at", lastSync);

  if (error) throw error;

  // Merge with local data (handle conflicts)
  for (const record of data) {
    const localRecord = await getLocalRecord(tableName, record.id);

    if (localRecord) {
      // Conflict resolution
      await resolveConflict(localRecord, record);
    } else {
      // New record from server
      await saveLocalRecord(tableName, record);
    }
  }

  // Update last sync timestamp
  await updateSyncMetadata(tableName, new Date());
}
```

### Sync Status Indicators

**UI Elements:**

1. **Sync Icon (Settings):**

   - Green checkmark: All synced
   - Orange spinner: Syncing in progress
   - Red exclamation: Sync failed
   - Gray cloud: Offline (pending sync)

2. **Last Sync Timestamp:**

   - "Last synced: 2 minutes ago"
   - "Last synced: Today at 3:45 PM"
   - "Pending sync (offline)"

3. **Pending Changes Badge:**

   - "5 changes pending sync"
   - Shown in settings

4. **Sync Progress:**
   - During manual sync, show progress bar
   - "Syncing diet logs... 12/20"

---

## Security & Privacy

### Data Security

#### Encryption in Transit

**HTTPS/TLS:**

- All API requests use HTTPS
- TLS 1.3 for all connections
- Certificate pinning (future enhancement)

```javascript
// Axios configuration with HTTPS enforcement
const api = axios.create({
  baseURL: "https://api.example.com",
  httpsAgent: new https.Agent({
    rejectUnauthorized: true,
  }),
});
```

#### Encryption at Rest

**Supabase:**

- Database encryption at rest (AES-256)
- Automatic by Supabase infrastructure

**SQLite:**

- Sensitive data encryption using SQLCipher (future enhancement)
- Currently: Reliance on device-level encryption (iOS/Android)

**Secure Token Storage:**

```javascript
import * as SecureStore from "expo-secure-store";

// Store auth token securely
async function storeAuthToken(token) {
  await SecureStore.setItemAsync("auth_token", token);
}

// Retrieve auth token
async function getAuthToken() {
  return await SecureStore.getItemAsync("auth_token");
}

// Delete auth token on logout
async function deleteAuthToken() {
  await SecureStore.deleteItemAsync("auth_token");
}
```

#### Input Validation & Sanitization

**Client-Side Validation:**

```javascript
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(password) {
  // Min 8 chars, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return re.test(password);
}

function sanitizeInput(input) {
  // Remove potential XSS characters
  return input.replace(/[<>]/g, "");
}
```

**Server-Side Validation:**

- Supabase RLS policies enforce data access rules
- PostgreSQL constraints on data types and ranges

### Privacy Compliance

#### GDPR Compliance (Europe)

**User Rights:**

1. **Right to Access:** Export all user data (JSON format)
2. **Right to Rectification:** Edit profile and all data
3. **Right to Erasure:** Delete account and all associated data
4. **Right to Data Portability:** Export data in machine-readable format
5. **Right to Object:** Opt-out of analytics (if implemented)

**Implementation:**

```javascript
// Export user data
async function exportUserData(userId) {
  const userData = {
    profile: await getUserProfile(userId),
    dietLogs: await getAllDietLogs(userId),
    workoutLogs: await getAllWorkoutLogs(userId),
    progressWeights: await getAllWeights(userId),
    progressMeasurements: await getAllMeasurements(userId),
    progressPhotos: await getAllPhotoMetadata(userId), // URLs, not actual images
  };

  const json = JSON.stringify(userData, null, 2);
  const filename = `myfit app_data_${userId}_${Date.now()}.json`;

  // Save to device
  await FileSystem.writeAsStringAsync(
    FileSystem.documentDirectory + filename,
    json
  );

  // Share file
  await Sharing.shareAsync(FileSystem.documentDirectory + filename);
}

// Delete user account
async function deleteUserAccount(userId) {
  try {
    // Delete from Supabase (cascading deletes via foreign keys)
    await supabase.from("user_profiles").delete().eq("user_id", userId);

    // Delete progress photos from storage
    const { data: photos } = await supabase
      .from("progress_photos")
      .select("storage_path")
      .eq("user_id", userId);

    for (const photo of photos) {
      await supabase.storage
        .from("progress-photos")
        .remove([photo.storage_path]);
    }

    // Delete Supabase auth user
    await supabase.auth.admin.deleteUser(userId);

    // Clear local data
    await clearAllLocalData();

    return { success: true };
  } catch (error) {
    console.error("Account deletion error:", error);
    return { success: false, error: error.message };
  }
}
```

#### KVKK Compliance (Turkey)

**Turkish Data Protection Law:**

- Similar requirements to GDPR
- User consent for data processing
- Data minimization principles
- Clear privacy policy in Turkish (future)

#### Privacy Policy

**Required Disclosures:**

**Data Collection:**

- Personal information (name, age, gender, height, weight)
- Health data (diet logs, workout logs, body measurements, photos)
- Usage data (app interactions, feature usage)
- Device data (OS version, device model for crash reporting)

**Data Usage:**

- Provide core app functionality
- Sync data across devices
- Improve app performance and features
- No data selling to third parties
- No advertising use (unless ad-supported version)

**Data Sharing:**

- Supabase (infrastructure provider)
- ExerciseDB API (exercise data, no personal data shared)
- FatSecret API (food searches, no personal data shared)
- Crash reporting services (anonymized data)

**Data Retention:**

- User data retained while account is active
- Deleted within 30 days of account deletion
- Backups retained for 90 days maximum

**User Rights:**

- Access, edit, export, delete data at any time
- Contact email for privacy concerns

### App Store Privacy Requirements

#### iOS Privacy Manifest

**Data Types Collected:**

- Health & Fitness (diet, workouts, measurements, weight)
- Contact Info (email)
- Identifiers (user ID)
- Usage Data (interactions, features used)

**Tracking:** No (not using data for advertising)

**Required Reason API Usage:**

- File timestamp access (for data sync)
- UserDefaults access (for app preferences)

#### Android Data Safety

**Google Play Data Safety Section:**

**Data Collected:**

- Personal info (name, email)
- Health and fitness (nutrition, exercise, body measurements)
- Photos (progress photos)

**Data Security:**

- Encrypted in transit (TLS)
- Encrypted at rest (Supabase)
- Option to delete data

**Data Usage:**

- App functionality only
- No data sharing with third parties
- No data selling

### Logging & Monitoring

**Security-Conscious Logging:**

```javascript
// DO NOT log sensitive data
function logUserAction(action, metadata = {}) {
  // Avoid logging:
  // - Passwords
  // - Auth tokens
  // - Email addresses
  // - Personal identifiers

  const safeLog = {
    action,
    timestamp: new Date().toISOString(),
    userId: metadata.userId ? hashUserId(metadata.userId) : null, // Hash for privacy
    screen: metadata.screen,
    // ... other non-sensitive data
  };

  console.log("[USER_ACTION]", safeLog);

  // Send to analytics (if user consented)
  if (userConsentedToAnalytics()) {
    analytics.track(action, safeLog);
  }
}
```

**Crash Reporting (Sentry or similar):**

```javascript
import * as Sentry from "sentry-expo";

Sentry.init({
  dsn: SENTRY_DSN,
  enableInExpoDevelopment: false,

  // Scrub sensitive data before sending
  beforeSend(event, hint) {
    // Remove user email from error context
    if (event.user) {
      delete event.user.email;
    }

    // Remove sensitive breadcrumbs
    if (event.breadcrumbs) {
      event.breadcrumbs = event.breadcrumbs.filter(
        (breadcrumb) => !breadcrumb.message.includes("password")
      );
    }

    return event;
  },
});
```

---

## Deployment Strategy

### iOS App Store Deployment

#### Prerequisites

**Apple Developer Account:**

- Cost: $99/year
- Required for TestFlight and App Store distribution
- Enroll at: https://developer.apple.com/programs/

**App Identifiers:**

- Bundle ID: `com.yourname.myfitapp` (must be unique)
- Display Name: MyFitApp
- Version: 1.0.0 (semantic versioning)

#### App Store Connect Setup

**1. Create App Record:**

- Log in to App Store Connect
- My Apps → + → New App
- Platform: iOS
- Name: MyFitApp
- Primary Language: English (US)
- Bundle ID: Select from dropdown
- SKU: `myfitapp-ios` (unique identifier)

**2. App Information:**

- Category: Health & Fitness
- Secondary Category: Lifestyle (optional)
- Content Rights: Confirm no third-party content
- Age Rating: Complete questionnaire (likely 4+)

**3. Pricing and Availability:**

- Price: Free
- Availability: All countries (or select specific)

#### App Store Assets

**Screenshots (Required):**

**iPhone:**

- 6.7" Display (iPhone 15 Pro Max): 1290 x 2796 pixels (3-10 screenshots)
- 6.5" Display (iPhone 14 Plus): 1242 x 2688 pixels
- 5.5" Display (iPhone 8 Plus): 1242 x 2208 pixels

**Screenshots to Include:**

1. Main Dashboard with quick stats
2. Diet tracking screen with macros
3. Workout logging interface
4. Exercise library with GIFs
5. Progress analytics charts
6. Profile setup wizard

**App Preview Video (Optional but Recommended):**

- 15-30 seconds
- Landscape or Portrait
- Show key features: Add meal, log workout, view progress

**App Icon:**

- 1024 x 1024 pixels (no alpha channel)
- Professional, recognizable
- Consistent with brand (purple theme)

**Promotional Text (170 chars):**

> "Track nutrition, log workouts, and visualize your fitness journey. Your all-in-one health companion with comprehensive analytics and offline support."

**Description (4000 chars max):**

```
MyFitApp - Your Complete Fitness Companion

Transform your health journey with MyFitApp, the all-in-one fitness and nutrition tracker designed to help you achieve your goals.

🍎 NUTRITION TRACKING
• Extensive food database with 1000+ items
• Turkish and international foods
• Track calories, protein, carbs, fats, and fiber
• Water intake monitoring
• Meal planning and custom foods

🏋️ WORKOUT LOGGING
• 1300+ exercises with video demonstrations
• Exercise library filtered by body part and equipment
• Custom workout creation
• Set, rep, and weight tracking
• Rest timer between sets
• Personal record tracking

📊 PROGRESS ANALYTICS
• Weight tracking with trend charts
• Body measurement tracking
• Progress photos with before/after comparison
• Weekly and monthly nutrition summaries
• Workout frequency and volume analytics
• Strength progression graphs

✨ KEY FEATURES
• Offline-first: Track everything without internet
• Cloud sync: Access your data on all devices
• Beautiful UI: Modern design with smooth animations
• Privacy-focused: Your data is encrypted and protected
• Goal setting: Personalized calorie and macro goals
• Streak tracking: Stay motivated with consistency badges

Whether you're losing weight, gaining muscle, or maintaining a healthy lifestyle, MyFitApp provides the tools and insights you need to succeed.

Download now and start your transformation!
```

**Keywords (100 chars):**

> fitness,workout,nutrition,diet,calories,gym,exercise,weight,health,tracker

**Support URL:**

- Your website or GitHub page: `https://github.com/Osmanileri/MyFitApp`

**Privacy Policy URL (Required):**

- Host on GitHub Pages or your website
- Must be publicly accessible
- Example: `https://yourname.github.io/myfitapp-privacy`

#### Privacy Manifest (iOS 17+)

Create `PrivacyInfo.xcprivacy` file:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>NSPrivacyTracking</key>
    <false/>
    <key>NSPrivacyCollectedDataTypes</key>
    <array>
        <dict>
            <key>NSPrivacyCollectedDataType</key>
            <string>NSPrivacyCollectedDataTypeHealthAndFitness</string>
            <key>NSPrivacyCollectedDataTypeLinked</key>
            <true/>
            <key>NSPrivacyCollectedDataTypePurposes</key>
            <array>
                <string>NSPrivacyCollectedDataTypePurposeAppFunctionality</string>
            </array>
        </dict>
        <dict>
            <key>NSPrivacyCollectedDataType</key>
            <string>NSPrivacyCollectedDataTypeEmailAddress</string>
            <key>NSPrivacyCollectedDataTypeLinked</key>
            <true/>
            <key>NSPrivacyCollectedDataTypePurposes</key>
            <array>
                <string>NSPrivacyCollectedDataTypePurposeAppFunctionality</string>
            </array>
        </dict>
    </array>
</dict>
</plist>
```

#### Build with EAS

**Install EAS CLI:**

```bash
npm install -g eas-cli
```

**Login to Expo:**

```bash
eas login
```

**Configure EAS:**

```bash
eas build:configure
```

This creates `eas.json`:

```json
{
  "cli": {
    "version": ">= 5.9.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "ios": {
        "simulator": false
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your@email.com",
        "ascAppId": "your_app_store_connect_id",
        "appleTeamId": "YOUR_TEAM_ID"
      }
    }
  }
}
```

**Build for Production:**

```bash
eas build --platform ios --profile production
```

**TestFlight Beta Testing:**

1. After build completes, download `.ipa` file
2. Upload to App Store Connect via Transporter app
3. Add to TestFlight
4. Add internal/external testers
5. Distribute test build
6. Collect feedback

**Submit to App Store:**

```bash
eas submit --platform ios --latest
```

Or manually in App Store Connect:

1. Go to App Store → iOS App → Version 1.0
2. Fill in all required fields
3. Add screenshots and assets
4. Select build from TestFlight
5. Submit for Review

**Review Guidelines to Follow:**

- App must be fully functional
- No crashes or major bugs
- Privacy policy accessible
- Accurate app description
- Proper age rating
- No placeholder content

**Expected Review Time:** 24-48 hours (average)

### Android Google Play Store Deployment

#### Prerequisites

**Google Play Console Account:**

- Cost: $25 one-time fee
- Create account at: https://play.google.com/console

**App Identifiers:**

- Package Name: `com.yourname.myfitapp` (must be unique, cannot change after first upload)
- Version: 1.0.0
- Version Code: 1 (integer, increments with each release)

#### Google Play Console Setup

**1. Create App:**

- All apps → Create app
- App name: MyFitApp
- Default language: English (United States)
- App or game: App
- Free or paid: Free
- Declarations and acknowledgements (accept)

**2. Dashboard Setup:**

**Store Listing:**

- App name: MyFitApp
- Short description (80 chars):

  > "Track nutrition, workouts, and progress. Your fitness companion."

- Full description (4000 chars):

  ```
  MyFitApp - Your Complete Fitness Companion

  Transform your health journey with MyFitApp, the all-in-one fitness and nutrition tracker designed to help you achieve your goals.

  🍎 NUTRITION TRACKING
  • Extensive food database with 1000+ items
  • Track calories, protein, carbs, fats, and fiber
  • Water intake monitoring
  • Meal planning and custom foods

  🏋️ WORKOUT LOGGING
  • 1300+ exercises with animations
  • Custom workout creation
  • Set, rep, and weight tracking
  • Rest timer and personal records

  📊 PROGRESS ANALYTICS
  • Weight and measurement tracking
  • Progress photos
  • Nutrition and workout analytics
  • Trend charts and insights

  ✨ KEY FEATURES
  • Works offline with cloud sync
  • Beautiful modern design
  • Privacy-focused and secure
  • Personalized goals
  • Streak tracking

  Download now and start your transformation!
  ```

- App icon: 512 x 512 pixels (PNG, 32-bit)
- Feature graphic: 1024 x 500 pixels (PNG or JPEG)
- Screenshots:
  - Phone: 2-8 screenshots (min 320px on shortest side, max 3840px on longest)
  - 7-inch tablet: Optional
  - 10-inch tablet: Optional

**Screenshots to Include:**

1. Main dashboard
2. Diet tracking with macros
3. Workout logging
4. Exercise library
5. Progress charts
6. Profile settings

**Store Settings:**

- App category: Health & Fitness
- Tags: fitness, workout, nutrition, diet, health
- Email: your@email.com
- Phone: Optional
- Website: https://github.com/Osmanileri/MyFitApp
- Privacy policy URL: https://yourname.github.io/myfitapp-privacy

**3. Content Rating:**

- Complete questionnaire
- Likely rating: Everyone
- Categories: Health app, fitness tracking

**4. Target Audience and Content:**

- Target age: 13+
- Appeals to children: No
- Ads: No (unless implementing ads)

**5. Data Safety:**

**Data Collection:**

- Personal info: Yes (name, email)
- Health and fitness: Yes (nutrition, workouts, measurements)
- Photos: Yes (progress photos)

**Data Usage:**

- App functionality only
- No third-party sharing

**Data Security:**

- Encrypted in transit: Yes
- Encrypted at rest: Yes
- User can request data deletion: Yes

**6. App Access:**

- All features available without special access
- No restrictions

**7. Ads:**

- Contains ads: No (unless implementing)

#### Build with EAS

**Build for Production:**

```bash
eas build --platform android --profile production
```

This creates `.aab` (Android App Bundle) file.

**Internal Testing:**

1. Go to Play Console → Testing → Internal testing
2. Create release
3. Upload `.aab` file
4. Add release notes
5. Add testers (email addresses)
6. Publish to internal testing
7. Testers receive email with opt-in link

**Closed Testing (Beta):**

- Similar to internal testing
- Can create Google Groups for testers
- More testers allowed
- Useful for broader beta testing

**Production Release:**

1. Go to Production → Create release
2. Upload production `.aab` file
3. Release notes (What's new):

   ```
   🎉 Welcome to MyFitApp v1.0!

   • Comprehensive nutrition tracking
   • Detailed workout logging
   • Progress analytics and charts
   • Offline-first with cloud sync
   • Beautiful, modern design

   Start your fitness journey today!
   ```

4. Rollout percentage: Start with 10%, gradually increase
5. Review and publish

**Google Play Review:**

- Usually faster than Apple (hours to 1 day)
- Automated checks + human review
- Possible reasons for rejection:
  - Privacy policy issues
  - Misleading description
  - App crashes
  - Copyright violations

#### Privacy Policy Template

Create a privacy policy (required for both stores):

**Hosting Options:**

- GitHub Pages
- Google Sites
- Privacy policy generators (e.g., TermsFeed)

**Sections to Include:**

1. Information Collection
2. How We Use Information
3. Data Storage and Security
4. Third-Party Services
5. User Rights (GDPR/KVKK)
6. Children's Privacy
7. Changes to Privacy Policy
8. Contact Information

### Environment Variables & Secrets

**Development:**

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
EXERCISEDB_API_KEY=your-rapidapi-key
FATSECRET_API_KEY=your-fatsecret-key (if using)
```

**Production:**

- Store secrets in EAS Secrets:

  ```bash
  eas secret:create --scope project --name SUPABASE_URL --value https://...
  eas secret:create --scope project --name SUPABASE_ANON_KEY --value eyJ...
  eas secret:create --scope project --name EXERCISEDB_API_KEY --value your-key
  ```

- Access in `app.config.js`:
  ```javascript
  export default {
    expo: {
      // ...
      extra: {
        supabaseUrl: process.env.SUPABASE_URL,
        supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
        exerciseDbApiKey: process.env.EXERCISEDB_API_KEY,
      },
    },
  };
  ```

### Version Management

**Semantic Versioning:** MAJOR.MINOR.PATCH (e.g., 1.0.0)

- **MAJOR:** Breaking changes (e.g., 2.0.0)
- **MINOR:** New features, backwards compatible (e.g., 1.1.0)
- **PATCH:** Bug fixes (e.g., 1.0.1)

**iOS Build Numbers:**

- Increment with each build
- Can be same version with different build numbers
- Example: Version 1.0.0 (Build 5)

**Android Version Codes:**

- Integer that must increase with each release
- Example: versionName "1.0.0", versionCode 1

**Update Strategy:**

- Bug fixes: Patch updates (1.0.1, 1.0.2)
- New features: Minor updates (1.1.0, 1.2.0)
- Major overhaul: Major updates (2.0.0)

---

## Implementation Roadmap

### Overview

**Total Estimated Time:** 14-16 weeks (part-time, flexible schedule)

**Approach:** Incremental development with working milestones

### Phase 1: Foundation & Infrastructure (Weeks 1-3)

#### Week 1: Supabase Setup

**Goals:**

- Set up Supabase project
- Create database schema
- Configure Row-Level Security (RLS)

**Tasks:**

- [x] Create Supabase account and project
- [x] Design and create all database tables (user_profiles, diet_logs, workout_logs, etc.)
- [x] Set up RLS policies for all tables
- [x] Create database functions (get_daily_nutrition, get_workout_stats, etc.)
- [x] Test database with sample data using Supabase dashboard

**Deliverable:** ✅ Fully functional Supabase database with test data - COMPLETED

#### Week 2: Supabase Authentication

**Goals:**

- Implement Supabase Auth
- Replace demo authentication system
- Set up OAuth providers

**Tasks:**

- [ ] Install Supabase JavaScript client
- [ ] Create Supabase service/API layer
- [ ] Implement email/password registration
- [ ] Implement email/password login
- [ ] Implement password reset flow
- [ ] Configure Google OAuth in Supabase dashboard
- [ ] Implement Google Sign-In
- [ ] Configure Apple Sign-In (iOS)
- [ ] Implement secure token storage with Expo SecureStore
- [ ] Test all authentication flows

**Deliverable:** Working authentication system with email and OAuth

#### Week 3: Data Sync Foundation

**Goals:**

- Create SQLite sync mechanism
- Implement sync queue
- Test offline/online scenarios

**Tasks:**

- [ ] Create sync_queue and sync_metadata tables in SQLite
- [ ] Implement addToSyncQueue function
- [ ] Implement syncQueue function
- [ ] Implement conflict resolution (last-write-wins)
- [ ] Set up network detection with NetInfo
- [ ] Implement initialSync for new users
- [ ] Implement incrementalSync for returning users
- [ ] Test: Add data offline, go online, verify sync
- [ ] Add sync status indicators in UI

**Deliverable:** Working offline-first sync system

### Phase 2: Core Features Enhancement (Weeks 4-7)

#### Week 4: Diet Tracking + Supabase Sync

**Goals:**

- Enhance diet tracking module
- Integrate with Supabase
- Ensure offline functionality

**Tasks:**

- [ ] Update diet store to use new sync system
- [ ] Implement saveDietLog with Supabase sync
- [ ] Implement getDietLogs from Supabase
- [ ] Implement updateDietLog with sync
- [ ] Implement deleteDietLog with sync
- [ ] Test: Log meals offline, sync online
- [ ] Implement weekly nutrition summary
- [ ] Add water tracking sync
- [ ] Add supplement tracking sync

**Deliverable:** Diet module fully synced with cloud

#### Week 5: ExerciseDB Integration

**Goals:**

- Integrate ExerciseDB API
- Implement local caching
- Build exercise library UI

**Tasks:**

- [ ] Set up ExerciseDB API configuration
- [ ] Implement fetchExercises with caching
- [ ] Create exercise_cache table in SQLite
- [ ] Implement cache expiration logic (30 days)
- [ ] Build Exercise Library screen
- [ ] Implement exercise search
- [ ] Implement filters (body part, equipment, difficulty)
- [ ] Display exercise GIFs
- [ ] Implement favorite exercises
- [ ] Test API rate limiting (ensure <1000 calls/month)

**Deliverable:** Exercise library with 1300+ cached exercises

#### Week 6: Workout Logging System

**Goals:**

- Build comprehensive workout logging
- Implement workout templates
- Create workout history

**Tasks:**

- [ ] Redesign Workout Dashboard screen
- [ ] Implement Start Workout flow
- [ ] Build Workout Entry screen (active workout)
- [ ] Implement add exercise to workout
- [ ] Implement set/rep/weight logging
- [ ] Implement rest timer
- [ ] Implement save workout with Supabase sync
- [ ] Build Workout Completion screen
- [ ] Implement workout templates (CRUD)
- [ ] Build Workout History screen
- [ ] Implement edit/delete past workouts
- [ ] Test: Create workout offline, sync online

**Deliverable:** Fully functional workout tracking system

#### Week 7: Body Map & Custom Exercises

**Goals:**

- Implement professional body map
- Enable custom exercise creation

**Tasks:**

- [ ] Integrate react-native-body-highlighter
- [ ] Build body map selector UI
- [ ] Implement muscle group selection
- [ ] Filter exercises by selected muscle group
- [ ] Build Create Custom Exercise screen
- [ ] Implement custom exercise CRUD
- [ ] Sync custom exercises to Supabase
- [ ] Test custom exercises in workouts

**Deliverable:** Body map muscle selector + custom exercises

### Phase 3: Analytics & Insights (Weeks 8-10)

#### Week 8: Progress Tracking

**Goals:**

- Build weight tracking
- Build body measurements tracking
- Implement progress photos

**Tasks:**

- [ ] Build Progress Dashboard screen
- [ ] Implement weight entry
- [ ] Create weight trend chart (line chart with moving average)
- [ ] Implement weight statistics calculations
- [ ] Build Add Measurement screen
- [ ] Implement measurement entry (chest, waist, arms, etc.)
- [ ] Create measurement charts
- [ ] Configure Supabase Storage for photos
- [ ] Build Add Progress Photo screen
- [ ] Implement photo upload to Supabase Storage
- [ ] Build photo grid and timeline view
- [ ] Implement before/after comparison
- [ ] Sync all progress data

**Deliverable:** Complete progress tracking module

#### Week 9: Nutrition Analytics

**Goals:**

- Build nutrition analytics UI
- Implement charts and visualizations

**Tasks:**

- [ ] Build Nutrition Analytics screen
- [ ] Implement daily calorie intake chart (7-day, 30-day)
- [ ] Implement macro distribution pie chart
- [ ] Implement weekly average calculations
- [ ] Create goal adherence percentage
- [ ] Implement streak tracking
- [ ] Build meal timing heatmap
- [ ] Implement food category breakdown
- [ ] Create nutrition statistics cards
- [ ] Optimize queries for analytics (caching)

**Deliverable:** Comprehensive nutrition analytics

#### Week 10: Workout Analytics

**Goals:**

- Build workout analytics UI
- Implement personal records tracking

**Tasks:**

- [ ] Build Workout Analytics screen
- [ ] Implement workout frequency chart
- [ ] Implement volume per muscle group chart
- [ ] Implement strength progression charts (per exercise)
- [ ] Calculate and display personal records
- [ ] Implement PR notifications
- [ ] Build muscle group balance radar chart
- [ ] Implement workout consistency metrics
- [ ] Create workout statistics cards
- [ ] Add analytics data caching for performance

**Deliverable:** Comprehensive workout analytics

### Phase 4: Polish & Testing (Weeks 11-12)

#### Week 11: UI/UX Refinements

**Goals:**

- Polish UI across all screens
- Improve animations and transitions
- Enhance user experience

**Tasks:**

- [ ] Audit all screens for consistency
- [ ] Improve spacing, padding, typography
- [ ] Add loading states to all async operations
- [ ] Add error states with helpful messages
- [ ] Add empty states with CTAs
- [ ] Implement skeleton screens for loading
- [ ] Add haptic feedback to key interactions
- [ ] Improve form validation and feedback
- [ ] Add success/error toasts for user actions
- [ ] Test on both iOS and Android for UI consistency

**Deliverable:** Polished, professional UI/UX

#### Week 12: Testing & Bug Fixes

**Goals:**

- Comprehensive testing
- Fix all critical bugs
- Optimize performance

**Tasks:**

- [ ] Test all user flows end-to-end
- [ ] Test authentication (email, Google, Apple)
- [ ] Test offline functionality (airplane mode)
- [ ] Test data sync (offline → online)
- [ ] Test conflict resolution (same data changed on 2 devices)
- [ ] Test ExerciseDB API caching (no excessive calls)
- [ ] Test on multiple devices (iOS and Android)
- [ ] Test on different screen sizes
- [ ] Profile app performance (identify bottlenecks)
- [ ] Fix all critical and high-priority bugs
- [ ] Optimize slow queries and operations
- [ ] Test accessibility (VoiceOver, TalkBack)

**Deliverable:** Stable, tested app ready for beta

### Phase 5: Deployment Preparation (Weeks 13-14)

#### Week 13: App Store Assets & Beta Testing

**Goals:**

- Create all required store assets
- Deploy to TestFlight and Internal Testing
- Gather beta feedback

**Tasks:**

- [ ] Create app screenshots for both platforms
- [ ] Create app icon (1024x1024)
- [ ] Write app description
- [ ] Write privacy policy
- [ ] Host privacy policy online
- [ ] Create feature graphic (Android)
- [ ] Create promotional video (optional)
- [ ] Set up App Store Connect (iOS)
- [ ] Set up Google Play Console (Android)
- [ ] Build production apps with EAS
- [ ] Upload to TestFlight (iOS)
- [ ] Upload to Internal Testing (Android)
- [ ] Invite beta testers (10-20 people)
- [ ] Collect and address beta feedback

**Deliverable:** Beta builds on TestFlight and Play Console

#### Week 14: Final Preparations & Submission

**Goals:**

- Final bug fixes from beta
- Submit to both stores
- Prepare for launch

**Tasks:**

- [ ] Address beta tester feedback
- [ ] Final bug fixes
- [ ] Final UI polish
- [ ] Test final production builds
- [ ] Complete App Store Connect submission form
- [ ] Complete Google Play Console submission form
- [ ] Submit to iOS App Store for review
- [ ] Submit to Google Play Store for review
- [ ] Prepare launch announcement
- [ ] Monitor review status
- [ ] Respond to review questions if any

**Deliverable:** Apps submitted for review

### Phase 6: Launch & Iteration (Week 15+)

**Post-Launch Activities:**

**Week 15-16: Launch & Monitoring**

- [ ] Apps approved and live on stores
- [ ] Monitor crash reports (Sentry or similar)
- [ ] Monitor user reviews
- [ ] Respond to user feedback
- [ ] Fix any critical post-launch bugs
- [ ] Release patch updates if needed

**Week 17+: Iteration & Enhancement**

- [ ] Analyze usage analytics
- [ ] Identify most/least used features
- [ ] Collect feature requests
- [ ] Plan Phase 2 features
- [ ] Continue improving based on user needs

---

## Testing Strategy

### Unit Testing

**Framework:** Jest

**Coverage Target:** 70%+ for critical business logic

**Areas to Test:**

**1. Utility Functions**

- Date formatting
- Nutrition calculations (calories, macros)
- Validation functions (email, password)
- Data transformations

**Example:**

```javascript
// utils/nutrition.test.js
describe("calculateDailyTotals", () => {
  it("should sum calories correctly", () => {
    const meals = [{ calories: 500 }, { calories: 300 }, { calories: 700 }];
    expect(calculateDailyTotals(meals).calories).toBe(1500);
  });
});
```

**2. Store Actions**

- Zustand store mutations
- Async operations (mocked)
- State updates

**Example:**

```javascript
// store/dietStore.test.js
describe("dietStore", () => {
  it("should add meal to correct meal type", () => {
    const { addMeal } = useDietStore.getState();
    addMeal("breakfast", { name: "Eggs", calories: 155 });

    const breakfast = useDietStore.getState().meals.breakfast;
    expect(breakfast).toHaveLength(1);
    expect(breakfast[0].name).toBe("Eggs");
  });
});
```

### Integration Testing

**Framework:** React Native Testing Library

**Focus:** Component interactions, data flow

**Areas to Test:**

**1. Authentication Flows**

- Registration → Email verification → Login
- Google OAuth flow
- Password reset flow

**2. Data Sync**

- Add data offline → Go online → Verify sync
- Conflict resolution

**3. API Integrations**

- ExerciseDB caching
- Supabase CRUD operations
- Error handling

**Example:**

```javascript
// screens/Login.test.js
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LoginScreen from "./LoginScreen";

describe("LoginScreen", () => {
  it("should login successfully with valid credentials", async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText("Email"), "user@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "password123");
    fireEvent.press(getByText("Login"));

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "user@example.com",
        password: "password123",
      });
    });
  });
});
```

### Manual Testing

**Test Devices:**

- iOS: iPhone 12/13/14 (simulator + physical)
- Android: Samsung Galaxy S21, Google Pixel (emulator + physical)

**Test Scenarios:**

**1. Cross-Device Sync**

- Device A: Add meal
- Device B: Refresh, verify meal appears
- Device A: Edit meal
- Device B: Verify update

**2. Offline/Online**

- Enable airplane mode
- Add multiple meals and workouts
- Disable airplane mode
- Verify all data syncs

**3. Edge Cases**

- Poor network (slow 3G)
- Network loss mid-sync
- Large data sets (100+ meals, 50+ workouts)
- Low storage scenarios

**4. Platform-Specific**

- iOS: Dynamic Island, notch handling
- Android: Back button navigation
- Both: Keyboard behavior, safe areas

### User Acceptance Testing (UAT)

**Beta Testers:** 10-20 people

**Profile Mix:**

- Fitness enthusiasts (5)
- Beginners (5)
- Tech-savvy (5)
- Non-technical (5)

**Feedback Collection:**

- In-app feedback form
- Google Form survey
- Direct messages

**Key Questions:**

- Is the app easy to use?
- Are any features confusing?
- Did you encounter any bugs?
- What features are you missing?
- Would you recommend this app?

---

## Success Metrics

### Technical Metrics

**Performance:**

- App launch time: < 3 seconds ✅
- Screen navigation: < 200ms ✅
- API response time: < 2 seconds ✅
- Sync success rate: > 95% ✅

**Stability:**

- Crash-free rate: > 99% ✅
- App Store rating: 4.5+ stars 🎯
- Critical bugs: 0 ✅
- High-priority bugs: < 5 ✅

**API Usage:**

- ExerciseDB calls: < 50/month ✅ (well under 1000 limit)
- Supabase DB size: < 500MB per user ✅
- Supabase bandwidth: < 5GB/month 🎯

### User Engagement Metrics

**Adoption:**

- Downloads: 100+ in first month 🎯
- Active users (30-day): 60+ 🎯
- User retention (Day 1): 70%+ 🎯
- User retention (Day 7): 50%+ 🎯
- User retention (Day 30): 30%+ 🎯

**Engagement:**

- Average session duration: 10+ minutes ✅
- Sessions per week: 5+ (daily users) ✅
- Meals logged per week: 15+ 🎯
- Workouts logged per week: 3+ 🎯

**Feature Adoption:**

- Users who log meals: 90%+ ✅
- Users who log workouts: 70%+ 🎯
- Users who track weight: 50%+ 🎯
- Users who view analytics: 40%+ 🎯

### Business Metrics

**App Store:**

- iOS rating: 4.5+ stars 🎯
- Android rating: 4.5+ stars 🎯
- Positive reviews: > 80% 🎯
- Critical reviews: < 5% ✅

**Growth:**

- Month-over-month user growth: 20%+ 🎯
- Referrals/word-of-mouth: 10%+ 🎯
- Organic search traffic: 50%+ 🎯

**Support:**

- Support tickets: < 5% of users ✅
- Average response time: < 24 hours ✅
- Issue resolution rate: > 90% ✅

---

## Future Enhancements (Post-MVP)

### Phase 2 Features (3-6 months post-launch)

**Social Features:**

- Friend connections
- Share workouts and meals
- Weekly challenges
- Leaderboards
- Social feed

**AI Enhancements:**

- AI meal planning (OpenAI integration)
- Recipe suggestions based on available ingredients
- Workout plan generation based on goals
- Form check for exercises (computer vision, future)

**Barcode Scanner:**

- Scan food barcodes for instant nutrition info
- Integration with Open Food Facts API
- Custom food database expansion

**Wearable Integration:**

- Apple Health sync (weight, workouts, calories)
- Google Fit sync
- Fitbit, Garmin integration
- Auto-log workouts from smartwatch

**Multi-Language Support:**

- Turkish language (full app translation)
- Spanish, German, French
- Dynamic language switching
- Localized food databases

### Phase 3 Features (6-12 months post-launch)

**Premium Subscription:**

- Advanced analytics
- Custom workout templates (professional)
- Meal planning AI
- Ad-free experience
- Priority support
- Cloud storage expansion

**In-App Purchases:**

- Workout templates by certified trainers
- Meal plans by nutritionists
- Recipe collections
- Progress comparison tool

**Advanced Analytics:**

- Machine learning insights
- Trend predictions (weight, strength)
- Anomaly detection (unusual patterns)
- Personalized recommendations

**Personal Trainer Mode:**

- Trainers can manage client data
- Client progress dashboard
- Assign workouts and meal plans
- In-app messaging

**Macro Meal Builder:**

- Build meals to hit exact macros
- Ingredient swaps to adjust macros
- Save custom meals
- Meal templates

### Long-Term Vision (12+ months)

**Community Platform:**

- User-generated content (workouts, recipes)
- Forums and discussion boards
- Expert Q&A
- Success story sharing

**E-Commerce:**

- Supplement recommendations
- Affiliate partnerships (gym equipment)
- Nutrition plan marketplace
- Trainer service booking

**Advanced Features:**

- Video workout guides
- Live workout classes
- Nutrition consultation booking
- Injury prevention algorithms
- Recovery tracking

---

## Risk Assessment & Mitigation

### Technical Risks

**Risk 1: ExerciseDB API Rate Limit Exceeded**

- **Impact:** High (core feature affected)
- **Probability:** Low (with proper caching)
- **Mitigation:**
  - Aggressive local caching (30-day expiration)
  - Monitor API usage weekly
  - Implement usage alerts at 80% of limit
  - Fallback: Hardcoded essential exercises
  - Long-term: Migrate to self-hosted exercise database

**Risk 2: Supabase Cost Overruns**

- **Impact:** Medium (budget concern)
- **Probability:** Medium (depends on user growth)
- **Mitigation:**
  - Monitor database size per user
  - Implement data retention policies (archive old data)
  - Optimize queries (indexes, selective fetching)
  - Image compression for progress photos
  - Free tier sufficient for <10K users

**Risk 3: Data Sync Conflicts**

- **Impact:** High (user trust, data integrity)
- **Probability:** Low (with last-write-wins)
- **Mitigation:**
  - Robust conflict resolution (timestamp-based)
  - Comprehensive sync testing
  - Sync error logging and monitoring
  - Manual sync option for users
  - User notification on sync issues

**Risk 4: Third-Party API Downtime**

- **Impact:** Medium (degraded experience)
- **Probability:** Low (reliable providers)
- **Mitigation:**
  - Graceful fallbacks (local data)
  - Cache API responses
  - User-friendly error messages
  - Status page monitoring
  - Retry logic with exponential backoff

### Business Risks

**Risk 1: App Store Rejection**

- **Impact:** High (delays launch)
- **Probability:** Medium (first-time submission)
- **Mitigation:**
  - Follow guidelines strictly
  - Thorough pre-submission testing
  - Complete privacy policy
  - Accurate app description
  - Prepare appeal documentation
  - Test on TestFlight before submission

**Risk 2: Low User Adoption**

- **Impact:** High (project success)
- **Probability:** Medium (competitive market)
- **Mitigation:**
  - Beta testing for feedback
  - Iterate based on user needs
  - Focus on unique features (analytics, offline-first)
  - Word-of-mouth marketing (encourage reviews)
  - Social media presence
  - App Store optimization (ASO)

**Risk 3: High Competition**

- **Impact:** Medium (differentiation challenge)
- **Probability:** High (saturated market)
- **Mitigation:**
  - Unique value prop: offline-first + comprehensive analytics
  - Free and accessible (no paywalls for core features)
  - Superior UX (beautiful, intuitive design)
  - Privacy-focused (no data selling)
  - Regular updates and new features

**Risk 4: Negative Reviews**

- **Impact:** Medium (reputation, ratings)
- **Probability:** Medium (inevitable with growth)
- **Mitigation:**
  - Responsive customer support
  - Quick bug fixes
  - Address feedback in updates
  - Encourage satisfied users to review
  - Learn from criticism

### Security Risks

**Risk 1: Data Breach**

- **Impact:** Critical (user trust, legal)
- **Probability:** Low (with proper security)
- **Mitigation:**
  - Supabase RLS policies (enforced)
  - HTTPS/TLS for all connections
  - Secure token storage (Expo SecureStore)
  - Regular security audits
  - No sensitive data in logs
  - GDPR/KVKK compliance

**Risk 2: Account Takeover**

- **Impact:** High (user data compromised)
- **Probability:** Low (with auth best practices)
- **Mitigation:**
  - Strong password requirements
  - Email verification
  - OAuth as alternative (Google, Apple)
  - Session expiry (30 days)
  - Suspicious activity monitoring (future)
  - Two-factor authentication (future enhancement)

### Development Risks

**Risk 1: Scope Creep**

- **Impact:** Medium (timeline delays)
- **Probability:** High (enthusiastic development)
- **Mitigation:**
  - Stick to MVP roadmap
  - Use this PRD as reference
  - Prioritize ruthlessly
  - Defer "nice-to-have" to Phase 2
  - Track time spent on features

**Risk 2: Technical Debt**

- **Impact:** Medium (future maintenance)
- **Probability:** Medium (rapid development)
- **Mitigation:**
  - Code reviews (self or peer)
  - Refactor as you go
  - Document complex logic
  - Write tests for critical paths
  - Periodic code cleanup sprints

---

## Conclusion

MyFitApp represents a comprehensive, production-ready fitness and nutrition tracking application designed for real-world deployment on iOS and Android platforms. This PRD provides a complete blueprint for development, from technical architecture to deployment strategy.

### Key Takeaways

**Technical Excellence:**

- Hybrid offline/online architecture ensures reliability
- Supabase + SQLite provides robust data management
- Optimized API usage stays within free tier limits
- Modern React Native stack ensures maintainability

**User-Focused Design:**

- Intuitive UI/UX with comprehensive features
- Privacy-first approach builds trust
- Offline functionality provides flexibility
- Detailed analytics drive user engagement

**Practical Roadmap:**

- 14-week timeline with clear milestones
- Incremental development ensures working features
- Flexible schedule accommodates personal project pace
- Clear success metrics guide progress

### Next Steps

1. **Week 1:** Set up Supabase project and database schema
2. **Create checklist:** Break down roadmap into daily/weekly tasks
3. **Set up development environment:** Ensure all tools installed
4. **Start coding:** Begin Phase 1, track progress
5. **Iterate:** Review this PRD regularly, adjust as needed

### Remember

- **Focus on MVP:** Resist feature creep, ship core features first
- **Test continuously:** Catch bugs early, ensure quality
- **Gather feedback:** Beta testers provide invaluable insights
- **Iterate based on data:** Let user behavior guide enhancements
- **Celebrate milestones:** Acknowledge progress along the way

This is your roadmap to success. Take it one phase at a time, stay focused on the goal, and build something amazing. Good luck! 🚀

---

**Document Version:** 1.0  
**Last Updated:** January 2025  
**Author:** MyFitApp Development Team  
**Status:** Ready for Implementation

---

**Appendix: Quick Reference**

- **GitHub Repository:** https://github.com/Osmanileri/MyFitApp
- **Supabase Dashboard:** (to be created)
- **ExerciseDB API Docs:** https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb
- **React Native Docs:** https://reactnative.dev
- **Expo Docs:** https://docs.expo.dev
- **EAS Build Docs:** https://docs.expo.dev/build/introduction

---

_End of Product Requirements Document_
