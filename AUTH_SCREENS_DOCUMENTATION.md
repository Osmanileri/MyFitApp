# Authentication Screens Documentation

## Overview
This document describes the new authentication screens that have been created for the Firebase-based authentication system.

## Screen Locations
All authentication screens are now organized in the `src/screens/auth/` directory:

- `src/screens/auth/SignUpScreen.js` - Comprehensive user registration
- `src/screens/auth/ForgotPasswordScreen.js` - Enhanced password reset functionality

## SignUpScreen Features

### User Registration Fields
- **Basic Information**
  - First Name (required)
  - Last Name (required)
  - Email (required, validated)
  - Password (required, minimum 6 characters)
  - Confirm Password (required, must match password)

- **Physical Information**
  - Age (optional, 13-120 range)
  - Gender (optional, Male/Female picker)
  - Height (optional, 100-250 cm range)
  - Weight (optional, 30-300 kg range)

- **Fitness Information**
  - Activity Level (picker with options):
    - Sedentary (Desk job)
    - Light Active
    - Moderate Active
    - Very Active
    - Extremely Active
  - Goal (picker with options):
    - Lose Weight
    - Maintain Weight
    - Gain Weight

### Validation Features
- Real-time form validation
- Email format validation
- Password strength requirements
- Numeric field range validation
- Error messages displayed below each field
- Visual error indicators (red borders)

### User Experience
- Responsive design with KeyboardAvoidingView
- ScrollView for longer forms
- Loading states during registration
- Success/error alerts
- Navigation links to Login screen

## ForgotPasswordScreen Features

### Enhanced UI
- Back button with arrow icon
- Lock icon for visual context
- Gradient background matching app theme
- Professional typography

### Functionality
- Email validation
- Firebase password reset integration
- Visual feedback for sent emails
- Resend functionality
- Error handling

### User Experience
- Auto-focus on email input
- Real-time validation feedback
- Success confirmation with instructions
- Disabled state after email sent
- Clear navigation options

## Integration with Firebase

### SignUpScreen Integration
- Uses Firebase Auth `createUserWithEmailAndPassword`
- Creates user profile in Firestore
- Stores additional user information:
  - Physical stats (age, gender, height, weight)
  - Fitness preferences (activity level, goal)
  - Display name
  - Timestamps

### ForgotPasswordScreen Integration
- Uses Firebase Auth `sendPasswordResetEmail`
- Proper error handling for various Firebase errors
- Success feedback with instructions

## Navigation Structure

### App.js Updates
- Added new screens to navigation stack
- Proper screen imports from auth directory
- Maintains existing navigation flow

### Navigation Flow
1. **Splash Screen** → Login/Register options
2. **Login Screen** → Links to SignUp and ForgotPassword
3. **SignUp Screen** → Registration → Success → Login
4. **ForgotPassword Screen** → Password reset → Back to Login

## Theme Integration

### Colors Used
- Primary gradient background
- White input fields
- Error color for validation
- Success color for confirmations
- Proper text contrast

### Typography
- Consistent font sizes
- Proper text hierarchy
- Readable placeholder text
- Error text styling

## Form Validation

### SignUpScreen Validation
```javascript
// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Age validation
if (age && (isNaN(age) || age < 13 || age > 120)) {
  // Show error
}

// Height validation
if (height && (isNaN(height) || height < 100 || height > 250)) {
  // Show error
}

// Weight validation
if (weight && (isNaN(weight) || weight < 30 || weight > 300)) {
  // Show error
}
```

### ForgotPasswordScreen Validation
- Email format validation
- Required field validation
- Clear error messages

## Error Handling

### SignUpScreen Errors
- Form validation errors
- Firebase authentication errors
- Network errors
- User-friendly error messages in Turkish

### ForgotPasswordScreen Errors
- Email validation errors
- Firebase reset errors
- Network connectivity issues
- Clear error feedback

## Dependencies Required

### Packages
- `@react-native-picker/picker` - For dropdown selections
- `@expo/vector-icons` - For icons
- `expo-linear-gradient` - For gradient backgrounds
- Firebase packages (already installed)

### Usage
```javascript
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
```

## Testing Checklist

### SignUpScreen Testing
- [ ] All required fields validation
- [ ] Email format validation
- [ ] Password confirmation matching
- [ ] Numeric field ranges
- [ ] Picker selections
- [ ] Firebase registration
- [ ] Firestore profile creation
- [ ] Error handling
- [ ] Loading states
- [ ] Navigation links

### ForgotPasswordScreen Testing
- [ ] Email validation
- [ ] Firebase reset email
- [ ] Success feedback
- [ ] Error handling
- [ ] Resend functionality
- [ ] Back navigation
- [ ] Loading states

## Best Practices Implemented

### Code Organization
- Separate validation functions
- Clean component structure
- Proper state management
- Error boundary protection

### User Experience
- Immediate feedback
- Clear error messages
- Logical form flow
- Accessible design
- Consistent styling

### Security
- Client-side validation
- Firebase security rules
- Proper error handling
- No sensitive data exposure

## Future Enhancements

### Potential Improvements
- Social login integration
- Profile picture upload
- More detailed onboarding flow
- Analytics tracking
- Accessibility improvements
- Internationalization

### Maintenance
- Regular dependency updates
- Error monitoring
- Performance optimization
- User feedback integration

## Troubleshooting

### Common Issues
1. **Picker not displaying**: Check platform-specific styling
2. **Firebase errors**: Verify configuration
3. **Navigation issues**: Check screen names in App.js
4. **Validation errors**: Review validation logic

### Solutions
- Check Firebase console for authentication errors
- Verify Firestore security rules
- Test on both iOS and Android
- Check network connectivity

This documentation provides a comprehensive guide for understanding and maintaining the authentication screens in the fitness app. 