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
  ScrollView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { appTheme } from '../theme/simpleTheme';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [autoLoginEnabled, setAutoLoginEnabled] = useState(true);
  
  const { login, logout, isLoading, error, clearError, toggleAutoLogin, getAutoLoginStatus } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    const result = await login({ email: email.trim().toLowerCase(), password });
    
    if (!result.success) {
      Alert.alert('Giriş Hatası', result.error || 'Giriş yapılamadı');
    }
  };

  const handleDemoLogin = async () => {
    const result = await login({ email: 'demo@fitapp.com', password: 'demo123' });
    
    if (!result.success) {
      Alert.alert('Demo Giriş Hatası', result.error || 'Demo hesabına giriş yapılamadı');
    }
  };

  React.useEffect(() => {
    if (error) {
      Alert.alert('Hata', error);
      clearError();
    }
  }, [error]);

  React.useEffect(() => {
    // Otomatik giriş durumunu yükle
    const loadAutoLoginStatus = async () => {
      const status = await getAutoLoginStatus();
      setAutoLoginEnabled(status);
    };
    loadAutoLoginStatus();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={appTheme.colors.primary} />
      
      {/* Header with gradient */}
      <LinearGradient
        colors={[appTheme.colors.primary, appTheme.colors.primaryDark]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Hoş Geldiniz</Text>
          <Text style={styles.headerSubtitle}>Hesabınıza giriş yapın</Text>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="email@example.com"
                placeholderTextColor={appTheme.colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Şifre</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Şifrenizi girin"
                  placeholderTextColor={appTheme.colors.textSecondary}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[appTheme.colors.primary, appTheme.colors.primaryDark]}
                style={styles.buttonGradient}
              >
                <Text style={styles.loginButtonText}>
                  {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.forgotPassword}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
            </TouchableOpacity>

            {/* Demo Login Button */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>veya</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={[styles.demoButton, isLoading && styles.disabledButton]}
              onPress={handleDemoLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.demoButtonText}>
                Demo Hesabı ile Giriş
              </Text>
            </TouchableOpacity>

            {/* Geliştirme Araçları */}
            <View style={styles.devTools}>
              <Text style={styles.devToolsTitle}>🛠️ Geliştirme Araçları</Text>
              <TouchableOpacity 
                style={styles.devButton}
                onPress={async () => {
                  const newStatus = !autoLoginEnabled;
                  const result = await toggleAutoLogin(newStatus);
                  if (result.success) {
                    setAutoLoginEnabled(newStatus);
                    Alert.alert('Bilgi', `Otomatik demo girişi ${newStatus ? 'açıldı' : 'kapatıldı'}`);
                  } else {
                    Alert.alert('Hata', result.error || 'Ayar değiştirilemedi');
                  }
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.devButtonText}>
                  Otomatik Demo Girişi: {autoLoginEnabled ? '✅ Açık' : '❌ Kapalı'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.devButton}
                onPress={async () => {
                  await logout();
                  Alert.alert('Bilgi', 'Çıkış yapıldı. Otomatik giriş devre dışı bırakıldı.');
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.devButtonText}>
                  🚪 Demo Hesabından Çıkış Yap
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Hesabınız yok mu? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              activeOpacity={0.7}
            >
              <Text style={styles.signupText}>Kayıt Ol</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appTheme.colors.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: appTheme.colors.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: appTheme.colors.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  form: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: appTheme.colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: appTheme.colors.white,
    color: appTheme.colors.text,
    ...appTheme.shadows.small,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    borderRadius: 12,
    backgroundColor: appTheme.colors.white,
    ...appTheme.shadows.small,
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: appTheme.colors.text,
  },
  eyeButton: {
    padding: 16,
  },
  eyeText: {
    fontSize: 18,
  },
  loginButton: {
    borderRadius: 12,
    marginTop: 10,
    overflow: 'hidden',
    ...appTheme.shadows.medium,
  },
  buttonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: appTheme.colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 20,
  },
  forgotPasswordText: {
    color: appTheme.colors.primary,
    fontSize: 14,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: appTheme.colors.border,
  },
  dividerText: {
    marginHorizontal: 16,
    color: appTheme.colors.textSecondary,
    fontSize: 14,
  },
  demoButton: {
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    backgroundColor: appTheme.colors.white,
    ...appTheme.shadows.small,
  },
  demoButtonText: {
    color: appTheme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    color: appTheme.colors.textSecondary,
    fontSize: 14,
  },
  signupText: {
    color: appTheme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  devTools: {
    marginTop: 30,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  devToolsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 12,
    textAlign: 'center',
  },
  devButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  devButtonText: {
    fontSize: 13,
    color: '#495057',
    fontWeight: '500',
  },
});

export default LoginScreen; 