import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNBlobUtil from 'react-native-blob-util';
import * as XLSX from 'xlsx';
import styles from '../styles/StudentsStyles';
import textstyles from '../styles/texto';
import {uploadStudentsData} from '../services/api-auth-service';

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
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.xlsx],
      });

      if (res && res[0]) {
        const fileUri = res[0].uri;

        if (!fileUri) {
          Alert.alert('Error', 'No se pudo obtener la URI del archivo.');
          return;
        }

        const fileContent = await RNBlobUtil.fs.readFile(fileUri, 'base64');

        const workbook = XLSX.read(fileContent, { type: 'base64' });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const studentsData = jsonData.slice(1).map((row) => ({
          usuarioId: row[1],
          name: row[2],
          email: row[4],
          telefono: row[5],
          password: generateRandomPassword(),
          rol: 'user',
        }));

        await uploadStudentsData(studentsData);

        Alert.alert('Éxito', 'Los estudiantes fueron agregados correctamente.');
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
        <Text style={styles.buttonText}>Mediante Excel</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('NuevoEstudianteScreen')}>
        <Text style={styles.buttonText}>Manualmente</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AnadirEstudiantesScreen;
