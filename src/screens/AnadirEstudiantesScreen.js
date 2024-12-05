import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNBlobUtil from 'react-native-blob-util';
import * as XLSX from 'xlsx';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Asegúrate de tener AsyncStorage
import styles from '../styles/StudentsStyles';
import textstyles from '../styles/texto';

const AnadirEstudiantesScreen = ({ navigation }) => {
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
        const response = await fetch('http://192.168.1.34:5001/api/students', {
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
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={handleExcelUpload}>
        <Text style={textstyles.title3}>Mediante Excel</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('NuevoEstudianteScreen')}>
        <Text style={textstyles.title3}>Manualmente</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AnadirEstudiantesScreen;
