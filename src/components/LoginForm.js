import React, { useState } from 'react';
import { View, TouchableOpacity, Text, TextInput, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/LoginScreenStyles';
import textStyles from '../styles/texto';

const LoginForm = ({ onLoginPress }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.100.3:5001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.status === 200) {
        await AsyncStorage.setItem('authToken', data.token); // Guardar el token
        Alert.alert('Éxito', 'Inicio de sesión exitoso');
        onLoginPress(); // Navegar a la pantalla de Brigadas
      } else {
        Alert.alert('Error', data.message || 'Inicio de sesión fallido');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor');
      console.error('Error al iniciar sesión:', error);
    }
  };

  return (
    <View style={styles.formContainer}>
      {/* Etiqueta para el campo de Correo Electrónico */}
      <Text style={textStyles.title3}>Correo Electrónico</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="ejemplo@epn.edu.ec"
          style={textStyles.cuerpo}
          value={email}
          onChangeText={setEmail}
        />
        <Ionicons name="mail-outline" size={24} color="gray" style={styles.icon} />
      </View>

      {/* Etiqueta para el campo de Contraseña */}
      <Text style={textStyles.title3}>Contraseña</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="********"
          secureTextEntry={true}
          style={textStyles.cuerpo}
          value={password}
          onChangeText={setPassword}
        />
        <Ionicons name="lock-closed-outline" size={24} color="gray" style={styles.icon} />
      </View>

      {/* Botón de Inicio de Sesión */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={textStyles.title3}>Iniciar Sesión</Text>
      </TouchableOpacity>

      {/* Opción de "¿Olvidaste tu contraseña?" */}
      <TouchableOpacity onPress={() => { }}>
        <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginForm;
