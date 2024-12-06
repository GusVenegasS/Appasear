import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import textStyles from '../styles/texto';

const ContrasenaScreen = ({ navigation }) => {

    const generateRandomPassword = (length = 12) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
        let password = '';
        for (let i = 0; i < length; i++) {
          password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
      };
    
      const handleExcelUpload = async () => {
        try {
          // Obtener el token del AsyncStorage
          const token = await AsyncStorage.getItem('authToken');
    
          if (!token) {
            Alert.alert('Error', 'No se encontró el token de autenticación');
            return;
          }
    
          const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.xlsx],
          });
    
          if (res && res[0]) {
            const fileUri = res[0].uri;
    
            if (!fileUri) {
              Alert.alert('Error', 'No se pudo obtener la URI del archivo.');
              return;
            }
    
            console.log('File URI:', fileUri);
    
            // Leer el archivo directamente desde la URI
            const fileContent = await RNBlobUtil.fs.readFile(fileUri, 'base64');
    
            const workbook = XLSX.read(fileContent, { type: 'base64' });
    
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    
            const studentsData = jsonData.slice(1).map((row) => ({
              name: row[2],
              email: row[4],
              telefono: row[5],
              password: generateRandomPassword(),
            }));
    
            // Enviar la solicitud con el token en los encabezados
            const response = await fetch('http://172.29.35.248:5001/api/students', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Aquí se agrega el token en los encabezados
              },
              body: JSON.stringify(studentsData),
            });
    
            if (response.ok) {
              Alert.alert('Éxito', 'Los estudiantes fueron agregados correctamente.');
            } else {
              const errorData = await response.json();
              Alert.alert('Error', errorData.message || 'Ocurrió un problema al enviar los datos al servidor.');
            }
          } else {
            Alert.alert('Error', 'No se seleccionó ningún archivo.');
          }
        } catch (err) {
          if (DocumentPicker.isCancel(err)) {
            Alert.alert('Operación cancelada', 'No se seleccionó ningún archivo.');
          } else {
            console.error('Error al cargar el archivo:', err);
            Alert.alert('Error', 'No se pudo cargar el archivo');
          }
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

export default ContrasenaScreen;
