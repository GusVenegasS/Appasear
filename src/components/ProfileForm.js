import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/LoginScreenStyles';
import textStyles from '../styles/texto';

const ProfileForm = () => {
  const [telefono, setTelefono] = useState('');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Alert.alert('Error', 'No se ha encontrado el token de autenticación.');
          return;
        }

        const response = await fetch('http://172.16.0.208:5001/api/user/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error en la solicitud, código de estado: ${response.status}`);
        }

        const data = await response.json();
        setNombre(data.nombre);
        setCorreo(data.correo);
        setTelefono(data.telefono);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Ocurrió un problema al obtener los datos.');
      }
    };

    fetchUserProfile();
  }, []);

  const guardarTelefono = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'No se ha encontrado el token de autenticación.');
        return;
      }

      const response = await fetch('http://172.29.35.248:5001/api/telefono', {
        method: 'PATCH', // Puedes usar PATCH o PUT según tu API
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ telefono }), // Enviamos solo el campo que se actualiza
      });

      if (!response.ok) {
        throw new Error(`Error al actualizar, código de estado: ${response.status}`);
      }

      Alert.alert('Éxito', 'Número de teléfono actualizado correctamente.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Ocurrió un problema al guardar los cambios.');
    }
  };

  return (
    <View style={styles.formContainer}>
      {/* Campo de nombre no editable */}
      <Text style={textStyles.title3}>Nombre:</Text>
      <View style={styles.inputContainer}>
        <TextInput value={nombre} editable={false} style={textStyles.cuerpo} />
        <Ionicons name="person-outline" size={24} color="gray" style={styles.icon} />
      </View>

      {/* Campo de correo no editable */}
      <Text style={textStyles.title3}>Correo Electrónico:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          value={correo}
          editable={false}
          style={textStyles.cuerpo}
          keyboardType="email-address"
        />
        <Ionicons name="mail-outline" size={24} color="gray" style={styles.icon} />
      </View>

      {/* Campo de número de celular */}
      <Text style={textStyles.title3}>Número de celular:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          value={telefono}
          onChangeText={setTelefono}
          placeholder="Número de celular"
          style={textStyles.cuerpo}
          keyboardType="phone-pad"
        />
        <Ionicons name="call-outline" size={24} color="gray" style={styles.icon} />
      </View>

      {/* Botón de guardar */}
      <TouchableOpacity style={styles.loginButton} onPress={guardarTelefono}>
        <Text style={textStyles.title3}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileForm;
