import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kayıt Ol</Text>
      <TextInput
        label="E-posta"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        label="Şifre"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry={!showPassword}
        right={<TextInput.Icon icon={showPassword ? 'eye-off' : 'eye'} onPress={() => setShowPassword(!showPassword)} />}
      />
      <TextInput
        label="Şifre Tekrarı"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        secureTextEntry={!showConfirmPassword}
        right={<TextInput.Icon icon={showConfirmPassword ? 'eye-off' : 'eye'} onPress={() => setShowConfirmPassword(!showConfirmPassword)} />}
      />
      <Button
        mode="contained"
        style={[styles.button, { backgroundColor: '#DB4437' }]}
        icon="google"
        onPress={() => Alert.alert('Google ile Kayıt', 'Bu özellik yakında eklenecek.')}
      >
        Google ile Kayıt Ol
      </Button>
      <Button
        mode="contained"
        style={[styles.button, { backgroundColor: '#000', marginBottom: 16 }]}
        icon="apple"
        onPress={() => Alert.alert('Apple ile Kayıt', 'Bu özellik yakında eklenecek.')}
      >
        Apple ile Kayıt Ol
      </Button>
      <Button mode="contained" style={styles.button} onPress={() => { Alert.alert('Kayıt Başarılı', 'Başarıyla kayıt oldunuz!'); navigation.replace('Login'); }}>
        Kayıt Ol
      </Button>
      <View style={styles.footer}>
        <Text>Zaten hesabın var mı?</Text>
        <TouchableOpacity onPress={() => navigation.replace('Login')}>
          <Text style={styles.link}> Giriş Yap</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
    color: '#222',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#f7f7f7',
  },
  button: {
    marginTop: 8,
    marginBottom: 16,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
  },
  link: {
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
}); 