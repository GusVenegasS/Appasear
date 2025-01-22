import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../styles/LoginScreenStyles';
import textStyles from '../styles/texto';
import {fetchUserProfile, updatePhoneNumber} from '../services/api-auth-service';

const ProfileForm = ({ navegarPress }) => {
  const [telefono, setTelefono] = useState('');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profile = await fetchUserProfile();
        setNombre(profile.nombre);
        setCorreo(profile.correo);
        setTelefono(profile.telefono);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Ocurrió un problema al obtener los datos.');
      }
    };

    loadUserProfile();
  }, []);

  const guardarTelefono = async () => {
    try {
      await updatePhoneNumber(telefono);
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
        <TextInput value={nombre} editable={false} style={[textStyles.cuerpo, { flex: 1, paddingRight: 50 }]} />
        <Ionicons name="person-outline" size={24} color="gray" style={styles.icon} />
      </View>

      {/* Campo de correo no editable */}
      <Text style={textStyles.title3}>Correo Electrónico:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          value={correo}
          editable={false}
          style={[textStyles.cuerpo, { flex: 1, paddingRight: 50 }]}
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
          style={[textStyles.cuerpo, { flex: 1, paddingRight: 50 }]}
          keyboardType="phone-pad"
        />
        <Ionicons name="call-outline" size={24} color="gray" style={styles.icon} />
      </View>

      {/* Botón de guardar */}
      <TouchableOpacity style={styles.loginButton} onPress={guardarTelefono}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={navegarPress}>
        <Text style={styles.buttonText}>Cambiar Contraseña</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileForm;
