// src/components/Logo.js
import React from 'react';
import { View, Image } from 'react-native';
import styles from '../styles/LoginScreenStyles';

const Logo = () => {
  return (
    <View style={styles.logoContainer}>
      <Image
        source={require('../assets/images/logo.jpg')} // Asegúrate de que la ruta sea correcta
        style={styles.logo}
      />
    </View>
  );
};

export default Logo;
