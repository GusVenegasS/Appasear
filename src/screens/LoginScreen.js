// src/components/LoginScreen.js
import React from 'react';
import { View, ScrollView, Alert } from 'react-native';
import styles from '../styles/LoginScreenStyles';
import Logo from '../components/Logo';
import LoginForm from '../components/LoginForm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AUTH from '../services/auth-service'

const LoginScreen = ({ navigation, onLogin }) => {

  const handleLogin = async (email, password, periodo) => {
    // Llamar a la API de login
    const response = await fetch('http://192.168.3.69:5001/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, periodo: periodo }),
    });

    const data = await response.json();

    if (response.status === 200) {
      await AsyncStorage.setItem('authToken', data.token);
      onLogin(data); // Pasamos los datos del usuario a AppNavigator

      // Redirigir dependiendo del rol
      if (data.user.rol === 'admin') {
        Alert.alert('Éxito', 'Inicio de sesión exitoso');
        navigation.navigate('Admin'); // Pantalla de Admin
      } else if (data.user.rol === 'user') {
        Alert.alert('Éxito', 'Inicio de sesión exitoso');
        navigation.navigate('Student'); // Pantalla de Estudiante
      }
    } else {
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    }
  };


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
        <LoginForm onLoginPress={handleLogin} />
      </ScrollView>
    </View>
  );
};

export default LoginScreen;