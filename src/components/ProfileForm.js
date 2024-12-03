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
        console.log('Token:', token);

        if (!token) {
          Alert.alert('Error', 'No se ha encontrado el token de autenticación.');
          return;
        }

        const response = await fetch('http://192.168.100.3:5001/api/user/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Código de estado:', response.status); // Verifica el código de estado
        if (!response.ok) {
          throw new Error(`Error en la solicitud, código de estado: ${response.status}`);
        }

        const text = await response.text();
        console.log('Respuesta del servidor:', text);

        // Intentar parsear como JSON si es posible
        let data;
        try {
          data = JSON.parse(text);
        } catch (error) {
          console.error('No se pudo parsear como JSON:', error);
          Alert.alert('Error', 'La respuesta no es un JSON válido.');
          return;
        }

        if (data) {
          setNombre(data.nombre);
          setCorreo(data.correo);
          setTelefono(data.telefono);
        } else {
          Alert.alert('Error', 'No se pudo obtener la información del perfil.');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Ocurrió un problema al obtener los datos.');
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <View style={styles.formContainer}>
      {/* Campo de nombre no editable */}
      <Text style={textStyles.title3}>Nombre:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          value={nombre}
          editable={false}
          style={textStyles.cuerpo}
        />
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
      <TouchableOpacity style={styles.loginButton} onPress={() => { /* Lógica para guardar cambios */ }}>
        <Text style={textStyles.title3}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileForm;
