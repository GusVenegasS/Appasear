// src/components/ProfileForm.js
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../styles/LoginScreenStyles';
import textStyles from '../styles/texto';

const ProfileForm = () => {
  const [phone, setPhone] = useState('');

  return (
    <View style={styles.formContainer}>
      {/* Campo de nombre no editable */}
      <Text style={textStyles.title3}>Nombre:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          value="Nombre"
          editable={false}
          style={textStyles.cuerpo}
        />
        <Ionicons name="person-outline" size={24} color="gray" style={styles.icon} />
      </View>

      {/* Campo de correo no editable */}
      <Text style={textStyles.title3}>Correo Electrónico:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          value="usuario@correo.com"
          editable={false}
          style={textStyles.cuerpo}
          keyboardType="email-address"
        />
        <Ionicons name="mail-outline" size={24} color="gray" style={styles.icon} />
      </View>

      <Text style={textStyles.title3}>Brigada:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          value="Brigada"
          editable={false}
          style={textStyles.cuerpo}
        />
        <Ionicons name="people-outline" size={24} color="gray" style={styles.icon} />
      </View>

      {/* Campo de número de celular */}
      <Text style={textStyles.title3}>Número de celular:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          value={phone}
          onChangeText={setPhone}
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
