import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function BackButton({ style, iconColor = '#222', backgroundColor = '#fff' }) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity style={[styles.backBtn, style]} onPress={() => navigation.goBack()}>
      <View style={[styles.backBtnCircle, { backgroundColor }]}> 
        <MaterialCommunityIcons name="arrow-left" size={26} color={iconColor} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    position: 'absolute',
    top: 28,
    left: 16,
    zIndex: 10,
    elevation: 10,
  },
  backBtnCircle: {
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
}); 