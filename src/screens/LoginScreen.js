import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import useAuthStore from '../store/authStore';
import { appTheme } from '../theme/simpleTheme';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const { login, isLoading, error, clearError } = useAuthStore();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateInputs = () => {
    let isValid = true;
    
    if (!email) {
      setEmailError('Email adresi gereklidir');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Geçerli bir email adresi giriniz');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Şifre gereklidir');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Şifre en az 6 karakter olmalıdır');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;
    
    clearError();
    const result = await login(email, password);
    
    if (result.success) {
      // Navigation will be handled by App.js based on auth state
    } else {
      Alert.alert('Giriş Hatası', result.error || 'Giriş yapılamadı');
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@fitapp.com');
    setPassword('demo123');
    
    const result = await login('demo@fitapp.com', 'demo123');
    if (!result.success) {
      Alert.alert('Demo Giriş Hatası', result.error || 'Demo hesabına giriş yapılamadı');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={[appTheme.colors.primary, appTheme.colors.primaryDark]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.title}>MyFitApp</Text>
          <Text style={styles.subtitle}>Sağlıklı yaşam yolculuğunuz başlıyor</Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, emailError && styles.inputError]}
                placeholder="Email"
                placeholderTextColor={appTheme.colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, passwordError && styles.inputError]}
                placeholder="Şifre"
                placeholderTextColor={appTheme.colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
              />
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={appTheme.colors.white} />
              ) : (
                <Text style={styles.loginButtonText}>Giriş Yap</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.demoButton}
              onPress={handleDemoLogin}
              disabled={isLoading}
            >
              <Text style={styles.demoButtonText}>Demo Hesabı ile Giriş</Text>
            </TouchableOpacity>

            <View style={styles.linksContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <Text style={styles.linkText}>Şifremi Unuttum</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={styles.linkText}>Hesap Oluştur</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: appTheme.colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: appTheme.colors.white,
    textAlign: 'center',
    marginBottom: 48,
    opacity: 0.9,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    marginBottom: 8,
  },
  input: {
    backgroundColor: appTheme.colors.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: appTheme.colors.text,
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    ...appTheme.shadows.small,
  },
  inputError: {
    borderColor: appTheme.colors.error || '#ff4444',
  },
  errorText: {
    color: appTheme.colors.error || '#ff4444',
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
  loginButton: {
    backgroundColor: appTheme.colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    ...appTheme.shadows.medium,
  },
  loginButtonText: {
    color: appTheme.colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  demoButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: appTheme.colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  demoButtonText: {
    color: appTheme.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  linkText: {
    color: appTheme.colors.white,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen; 