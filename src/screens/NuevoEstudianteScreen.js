import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import textStyles from '../styles/texto';

const NuevoEstudianteScreen = ({ navigation }) => {
  const [usuarioId, setusuarioId] = useState('');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');


  const handleAddStudent = async () => {
    if (!nombre || !correo || !telefono) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
  
    try {
      const token = await AsyncStorage.getItem('authToken'); // Recuperar el token
  
      const estudiante = {
        usuarioId: usuarioId,
        name: nombre,
        email: correo,
        telefono: telefono,
        password: 'defaultPassword123',
        rol: 'user',
      };
  
      const response = await axios.post('http://192.168.100.3:5001/api/students', [estudiante], {
        headers: {
          Authorization: `Bearer ${token}`, // Enviar el token
        },
      });
  
      if (response.status === 201) {
        Alert.alert('Éxito', 'Estudiante agregado correctamente');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un problema al agregar el estudiante');
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
              onChangeText={setusuarioId}
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
              maxLength={10} // Restringe la entrada a un máximo de 10 caracteres
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
