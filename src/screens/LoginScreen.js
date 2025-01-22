// src/components/LoginScreen.js
import React from 'react';
import { View, ScrollView, Alert } from 'react-native';
import styles from '../styles/LoginScreenStyles';
import Logo from '../components/Logo';
import LoginForm from '../components/LoginForm';
import {login} from '../services/api-auth-service';

const LoginScreen = ({ navigation, onLogin }) => {
  const handleLogin = async (email, password, periodo) => {
    try {
      // Llamar al servicio de autenticación
      const data = await login(email, password, periodo);

      // Pasamos los datos del usuario a AppNavigator
      onLogin(data);

      // Redirigir dependiendo del rol
      if (data.user.rol === 'admin') {
        navigation.navigate('Admin'); // Pantalla de Admin
      } else if (data.user.rol === 'user') {
        navigation.navigate('Student'); // Pantalla de Estudiante
      }
    } catch (error) {
      Alert.alert('Error', error.message); // Mostrar el mensaje de error
    }
  };

  const navegarCambiarContrasena = () => {
    navigation.navigate('ContrasenaScreen');
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
        <LoginForm onLoginPress={handleLogin} navegarPress={navegarCambiarContrasena} />
      </ScrollView>
    </View>
  );
};

export default LoginScreen;
