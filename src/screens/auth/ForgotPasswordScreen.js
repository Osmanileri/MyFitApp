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
import { Ionicons } from '@expo/vector-icons';
import useAuthStore from '../../store/authStore';
import { appTheme } from '../../theme/simpleTheme';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  
  const { resetPassword, isLoading, error, clearError } = useAuthStore();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateInput = () => {
    if (!email.trim()) {
      setEmailError('Email adresi gereklidir');
      return false;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Geçerli bir email adresi giriniz');
      return false;
    }
    
    setEmailError('');
    return true;
  };

  const handleResetPassword = async () => {
    if (!validateInput()) return;
    
    clearError();
    const result = await resetPassword(email);
    
    if (result.success) {
      setIsEmailSent(true);
      Alert.alert(
        'Email Gönderildi',
        'Şifre sıfırlama bağlantısı email adresinize gönderildi. Lütfen email kutunuzu kontrol edin.',
        [
          {
            text: 'Tamam',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } else {
      Alert.alert('Hata', result.error || 'Şifre sıfırlama emaili gönderilemedi');
    }
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    if (emailError) {
      setEmailError('');
    }
    if (isEmailSent) {
      setIsEmailSent(false);
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={appTheme.colors.white} />
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <Ionicons name="lock-closed-outline" size={64} color={appTheme.colors.white} />
          </View>

          <Text style={styles.title}>Şifremi Unuttum</Text>
          <Text style={styles.subtitle}>
            Email adresinizi girin, şifre sıfırlama bağlantısını size gönderelim.
          </Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, emailError && styles.inputError]}
                placeholder="Email Adresi"
                placeholderTextColor={appTheme.colors.textSecondary}
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoFocus
              />
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>

            <TouchableOpacity
              style={[styles.resetButton, isEmailSent && styles.resetButtonSent]}
              onPress={handleResetPassword}
              disabled={isLoading || isEmailSent}
            >
              {isLoading ? (
                <ActivityIndicator color={appTheme.colors.primary} />
              ) : (
                <View style={styles.resetButtonContent}>
                  <Ionicons 
                    name={isEmailSent ? "checkmark" : "mail-outline"} 
                    size={20} 
                    color={appTheme.colors.primary} 
                    style={styles.resetButtonIcon}
                  />
                  <Text style={styles.resetButtonText}>
                    {isEmailSent ? 'Email Gönderildi' : 'Şifre Sıfırlama Emaili Gönder'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.helpContainer}>
              <Text style={styles.helpText}>
                Email gelmedi mi? Spam klasörünü kontrol edin.
              </Text>
              
              <TouchableOpacity
                style={styles.resendButton}
                onPress={handleResetPassword}
                disabled={isLoading || !isEmailSent}
              >
                <Text style={[styles.resendButtonText, (!isEmailSent || isLoading) && styles.resendButtonDisabled]}>
                  Tekrar Gönder
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.loginLinkContainer}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginLinkText}>
                Şifrenizi hatırladınız mı? <Text style={styles.loginLink}>Giriş Yapın</Text>
              </Text>
            </TouchableOpacity>
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
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    zIndex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: appTheme.colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: appTheme.colors.white,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
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
  resetButton: {
    backgroundColor: appTheme.colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    ...appTheme.shadows.medium,
  },
  resetButtonSent: {
    backgroundColor: appTheme.colors.success || '#4CAF50',
  },
  resetButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resetButtonIcon: {
    marginRight: 8,
  },
  resetButtonText: {
    color: appTheme.colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  helpContainer: {
    alignItems: 'center',
    marginTop: 24,
    gap: 8,
  },
  helpText: {
    color: appTheme.colors.white,
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.9,
  },
  resendButton: {
    padding: 8,
  },
  resendButtonText: {
    color: appTheme.colors.white,
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  resendButtonDisabled: {
    color: appTheme.colors.white,
    opacity: 0.5,
    textDecorationLine: 'none',
  },
  loginLinkContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  loginLinkText: {
    color: appTheme.colors.white,
    fontSize: 14,
    opacity: 0.9,
  },
  loginLink: {
    color: appTheme.colors.white,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default ForgotPasswordScreen; 