import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-paper';

export default function OnboardingScreen({ navigation }) {
  return (
    <View style={styles.background}>
      <View style={styles.overlay}>
        <Text style={styles.quote}>
          "Hayattan zevk almak isteyen ilk önce dönüp kendisini sevmeli, aynaya baktığında memnun kalmalı. Bu yolculuk, seninle başlar."
        </Text>
        <Button
          mode="contained"
          style={styles.button}
          labelStyle={{ fontSize: 18 }}
          onPress={() => navigation.replace('Login')}
        >
          Başlayalım
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#e0f7fa', // Geçici arka plan rengi
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    padding: 32,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    alignItems: 'center',
    marginBottom: 0,
  },
  quote: {
    fontSize: 20,
    color: '#333',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    width: '100%',
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
  },
}); 