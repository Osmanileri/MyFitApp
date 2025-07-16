// Bu dosya SVG tabanlı eski BodyMapContainer'dı. Artık kullanılmıyor.
// Lütfen src/components/BodyMap/ProfessionalBodyMap.js dosyasını kullanın.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BodyMapContainer = () => (
  <View style={styles.container}>
    <Text style={styles.text}>
      Bu ekran artık kullanılmıyor. Lütfen yeni ProfessionalBodyMap bileşenini kullanın.
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1a1a1a' },
  text: { color: '#fff', fontSize: 18, textAlign: 'center', padding: 32 }
});

export default BodyMapContainer; 