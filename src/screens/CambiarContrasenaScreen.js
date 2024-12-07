import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, ScrollView } from 'react-native';
import styles from '../styles/LoginScreenStyles';
import textStyles from '../styles/texto';
import {changePassword} from '../services/api-auth-service';

const CambiarContrasenaScreen = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const cambiarContrasena = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    try {
      await changePassword(newPassword);
      Alert.alert('Éxito', 'Contraseña cambiada correctamente.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message || 'Ocurrió un problema al cambiar la contraseña.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          {/* Campo para nueva contraseña */}
          <Text style={textStyles.title3}>Nueva Contraseña:</Text>
          <View style={styles.inputContainer}>
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Ingresa tu nueva contraseña"
              secureTextEntry
              style={[textStyles.cuerpo, { flex: 1, paddingRight: 50 }]}
            />
          </View>

          {/* Campo para confirmar nueva contraseña */}
          <Text style={textStyles.title3}>Confirmar Contraseña:</Text>
          <View style={styles.inputContainer}>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirma tu nueva contraseña"
              secureTextEntry
              style={[textStyles.cuerpo, { flex: 1, paddingRight: 50 }]}
            />
          </View>

          {/* Botón para cambiar la contraseña */}
          <TouchableOpacity style={styles.loginButton} onPress={cambiarContrasena}>
            <Text style={textStyles.title3}>Cambiar Contraseña</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default CambiarContrasenaScreen;
