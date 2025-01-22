import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import {requestPasswordReset} from '../services/api-auth-service'; // Importa el servicio de API
import textStyles from '../styles/texto';

const ContrasenaScreen = () => {
  const [correo, setCorreo] = useState('');

  const handleChangePassword = async () => {
    try {
      const result = await requestPasswordReset(correo);
      Alert.alert('Éxito', result.message);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error || 'Ocurrió un error al cambiar la contraseña.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={textStyles.title3}>Correo Electrónico</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={textStyles.cuerpo}
              value={correo}
              onChangeText={setCorreo}
              placeholder="Ingresa el correo electrónico"
              keyboardType="email-address"
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
            <Text style={styles.buttonText}>Cambiar Contraseña</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 1,
    justifyContent: 'center',
  },
  scrollContainer: {
    paddingHorizontal: 30,
    paddingVertical: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    backgroundColor: 'white',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingLeft: 10,
    paddingRight: 40,
    height: 50,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#008EB6",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#008EB6',
    padding: 20,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
};

export default ContrasenaScreen;
