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
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import useAuthStore from '../../store/authStore';
import { appTheme } from '../../theme/simpleTheme';

const SignUpScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    activityLevel: 'sedentary',
    goal: 'maintain',
  });

  const [errors, setErrors] = useState({});
  const { register, isLoading, error, clearError } = useAuthStore();

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.firstName.trim()) newErrors.firstName = 'Ad gereklidir';
    if (!formData.lastName.trim()) newErrors.lastName = 'Soyad gereklidir';
    if (!formData.email.trim()) newErrors.email = 'Email gereklidir';
    if (!formData.password) newErrors.password = 'Şifre gereklidir';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Şifre tekrarı gereklidir';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Geçerli bir email adresi giriniz';
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalıdır';
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor';
    }

    // Age validation
    if (formData.age && (isNaN(formData.age) || formData.age < 13 || formData.age > 120)) {
      newErrors.age = 'Yaş 13-120 arasında olmalıdır';
    }

    // Height validation
    if (formData.height && (isNaN(formData.height) || formData.height < 100 || formData.height > 250)) {
      newErrors.height = 'Boy 100-250 cm arasında olmalıdır';
    }

    // Weight validation
    if (formData.weight && (isNaN(formData.weight) || formData.weight < 30 || formData.weight > 300)) {
      newErrors.weight = 'Kilo 30-300 kg arasında olmalıdır';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    clearError();
    const userInfo = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      displayName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
      age: formData.age ? parseInt(formData.age) : null,
      gender: formData.gender,
      height: formData.height ? parseInt(formData.height) : null,
      weight: formData.weight ? parseInt(formData.weight) : null,
      activityLevel: formData.activityLevel,
      goal: formData.goal,
    };

    const result = await register(formData.email, formData.password, userInfo);

    if (result.success) {
      Alert.alert('Başarılı', 'Hesabınız başarıyla oluşturuldu!');
    } else {
      Alert.alert('Kayıt Hatası', result.error || 'Hesap oluşturulamadı');
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
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Hesap Oluştur</Text>
            <Text style={styles.subtitle}>Sağlıklı yaşam yolculuğunuzu başlatın</Text>

            <View style={styles.form}>
              {/* Basic Info */}
              <View style={styles.row}>
                <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                  <TextInput
                    style={[styles.input, errors.firstName && styles.inputError]}
                    placeholder="Ad"
                    placeholderTextColor={appTheme.colors.textSecondary}
                    value={formData.firstName}
                    onChangeText={(value) => handleInputChange('firstName', value)}
                    autoCapitalize="words"
                  />
                  {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}
                </View>

                <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                  <TextInput
                    style={[styles.input, errors.lastName && styles.inputError]}
                    placeholder="Soyad"
                    placeholderTextColor={appTheme.colors.textSecondary}
                    value={formData.lastName}
                    onChangeText={(value) => handleInputChange('lastName', value)}
                    autoCapitalize="words"
                  />
                  {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="Email"
                  placeholderTextColor={appTheme.colors.textSecondary}
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
                {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, errors.password && styles.inputError]}
                  placeholder="Şifre"
                  placeholderTextColor={appTheme.colors.textSecondary}
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry
                  autoComplete="password"
                />
                {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, errors.confirmPassword && styles.inputError]}
                  placeholder="Şifre Tekrarı"
                  placeholderTextColor={appTheme.colors.textSecondary}
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  secureTextEntry
                  autoComplete="password"
                />
                {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
              </View>

              {/* Physical Info */}
              <View style={styles.row}>
                <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                  <TextInput
                    style={[styles.input, errors.age && styles.inputError]}
                    placeholder="Yaş"
                    placeholderTextColor={appTheme.colors.textSecondary}
                    value={formData.age}
                    onChangeText={(value) => handleInputChange('age', value)}
                    keyboardType="numeric"
                  />
                  {errors.age ? <Text style={styles.errorText}>{errors.age}</Text> : null}
                </View>

                <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                  <View style={[styles.input, styles.pickerContainer]}>
                    <Picker
                      selectedValue={formData.gender}
                      onValueChange={(value) => handleInputChange('gender', value)}
                      style={styles.picker}
                    >
                      <Picker.Item label="Cinsiyet" value="" />
                      <Picker.Item label="Erkek" value="male" />
                      <Picker.Item label="Kadın" value="female" />
                    </Picker>
                  </View>
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                  <TextInput
                    style={[styles.input, errors.height && styles.inputError]}
                    placeholder="Boy (cm)"
                    placeholderTextColor={appTheme.colors.textSecondary}
                    value={formData.height}
                    onChangeText={(value) => handleInputChange('height', value)}
                    keyboardType="numeric"
                  />
                  {errors.height ? <Text style={styles.errorText}>{errors.height}</Text> : null}
                </View>

                <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                  <TextInput
                    style={[styles.input, errors.weight && styles.inputError]}
                    placeholder="Kilo (kg)"
                    placeholderTextColor={appTheme.colors.textSecondary}
                    value={formData.weight}
                    onChangeText={(value) => handleInputChange('weight', value)}
                    keyboardType="numeric"
                  />
                  {errors.weight ? <Text style={styles.errorText}>{errors.weight}</Text> : null}
                </View>
              </View>

              {/* Activity Level */}
              <View style={styles.inputContainer}>
                <View style={[styles.input, styles.pickerContainer]}>
                  <Picker
                    selectedValue={formData.activityLevel}
                    onValueChange={(value) => handleInputChange('activityLevel', value)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Aktivite Seviyesi" value="" />
                    <Picker.Item label="Sedanter (Masa başı)" value="sedentary" />
                    <Picker.Item label="Hafif Aktif" value="light" />
                    <Picker.Item label="Orta Aktif" value="moderate" />
                    <Picker.Item label="Çok Aktif" value="very" />
                    <Picker.Item label="Aşırı Aktif" value="extreme" />
                  </Picker>
                </View>
              </View>

              {/* Goal */}
              <View style={styles.inputContainer}>
                <View style={[styles.input, styles.pickerContainer]}>
                  <Picker
                    selectedValue={formData.goal}
                    onValueChange={(value) => handleInputChange('goal', value)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Hedef" value="" />
                    <Picker.Item label="Kilo Vermek" value="lose" />
                    <Picker.Item label="Kilo Korumak" value="maintain" />
                    <Picker.Item label="Kilo Almak" value="gain" />
                  </Picker>
                </View>
              </View>

              <TouchableOpacity
                style={styles.signUpButton}
                onPress={handleSignUp}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={appTheme.colors.primary} />
                ) : (
                  <Text style={styles.signUpButtonText}>Hesap Oluştur</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.loginLinkContainer}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.loginLinkText}>
                  Zaten hesabınız var mı? <Text style={styles.loginLink}>Giriş Yapın</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
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
    marginBottom: 32,
    opacity: 0.9,
  },
  form: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  pickerContainer: {
    paddingVertical: 0,
    paddingHorizontal: 8,
  },
  picker: {
    color: appTheme.colors.text,
  },
  errorText: {
    color: appTheme.colors.error || '#ff4444',
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
  signUpButton: {
    backgroundColor: appTheme.colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    ...appTheme.shadows.medium,
  },
  signUpButtonText: {
    color: appTheme.colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLinkContainer: {
    alignItems: 'center',
    marginTop: 24,
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

export default SignUpScreen; 