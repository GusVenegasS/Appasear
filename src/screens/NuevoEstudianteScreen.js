import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import {addStudent} from '../services/api-auth-service'; // Importamos el servicio
import textStyles from '../styles/texto';

const NuevoEstudianteScreen = ({ navigation }) => {
  const [usuarioId, setUsuarioId] = useState('');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');

  const generateRandomPassword = (length = 12) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleAddStudent = async () => {
    if (!nombre || !correo || !telefono) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      // Llamamos al servicio para agregar al estudiante
      await addStudent(usuarioId, nombre, correo, telefono, generateRandomPassword());

      Alert.alert('Éxito', 'Estudiante agregado correctamente');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message || 'Ocurrió un problema al agregar el estudiante');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={textStyles.title3}>Nombre Completo</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={textStyles.cuerpo}
              value={nombre}
              onChangeText={setNombre}
              placeholder="Ingresa el nombre completo"
            />
          </View>

          <Text style={textStyles.title3}>Código Único</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={textStyles.cuerpo}
              value={usuarioId}
              onChangeText={setUsuarioId}
              keyboardType="numeric"
              placeholder="Ingresa el código único"
              maxLength={9} 
            />
          </View>

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

          <Text style={textStyles.title3}>Teléfono</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={textStyles.cuerpo}
              value={telefono}
              onChangeText={(text) => setTelefono(text.replace(/[^0-9]/g, '').slice(0, 10))}
              placeholder="Ingresa el número de teléfono"
              keyboardType="numeric"
              maxLength={10}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleAddStudent}>
            <Text style={styles.buttonText}>Agregar Estudiante</Text>
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

export default NuevoEstudianteScreen;
