// src/components/LoginScreen.js
import React from 'react';
import { View, ScrollView } from 'react-native';
import styles from '../styles/LoginScreenStyles';
import Logo from '../components/Logo';
import LoginForm from '../components/LoginForm';

const LoginScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo de la App */}
        <Logo />

        {/* Formulario de Login */}
        <LoginForm navigation={navigation}  />
      </ScrollView>
    </View>
  );
};

export default LoginScreen;