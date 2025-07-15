import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Şifremi Sıfırla</Text>
      <Text style={styles.info}>E-posta adresinizi girin. Şifrenizi sıfırlamanız için size bir bağlantı göndereceğiz.</Text>
      <TextInput
        label="E-posta"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button mode="contained" style={styles.button} onPress={() => {}}>
        Sıfırlama Bağlantısı Gönder
      </Button>
      <TouchableOpacity onPress={() => navigation.replace('Login')}>
        <Text style={styles.link}>Giriş Ekranına Geri Dön</Text>
      </TouchableOpacity>
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
    marginBottom: 16,
    textAlign: 'center',
    color: '#222',
  },
  info: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
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
}); 