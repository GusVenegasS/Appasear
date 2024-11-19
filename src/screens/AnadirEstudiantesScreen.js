import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, PermissionsAndroid, Linking, Platform } from 'react-native';
import { ContextCompat, ActivityCompat } from 'androidx.core.app';
import DocumentPicker from 'react-native-document-picker';
import * as XLSX from 'xlsx';
import styles from '../styles/StudentsStyles';
import textstyles from '../styles/texto';

const AnadirEstudiantesScreen = ({ navigation }) => {
  // Función para solicitar permiso de almacenamiento
  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: "Permiso de almacenamiento",
          message: "Esta aplicación necesita acceso al almacenamiento para subir archivos.",
          buttonNeutral: "Preguntar más tarde",
          buttonNegative: "Cancelar",
          buttonPositive: "Aceptar",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error("Error al solicitar permisos:", err);
      return false;
    }
  };
  
  useEffect(() => {
    requestStoragePermission().then(hasPermission => {
      if (hasPermission) {
        console.log("Permiso concedido");
      } else {
        Alert.alert("Permiso denegado", "Necesitas el permiso de almacenamiento para continuar.");
      }
    });
  }, []);

  // Función para generar contraseñas aleatorias
  const generateRandomPassword = (length = 12) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // Función para procesar y enviar el archivo Excel
  const handleExcelUpload = async () => {
    // Verificar permisos antes de continuar
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert("Permiso denegado", "No puedes subir archivos sin este permiso.");
      return;
    }

    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.spreadsheet],
      });

      if (res) {
        const fileUri = res[0].uri; // Ruta del archivo seleccionado

        // Leer el archivo Excel
        const response = await fetch(fileUri);
        const blob = await response.blob();
        const reader = new FileReader();

        reader.onload = async (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });

          // Tomar la primera hoja del archivo
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];

          // Convertir los datos de la hoja a JSON
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Array bidimensional

          // Eliminar la primera fila (encabezados)
          const studentsData = jsonData.slice(1).map((row) => ({
            name: row[1], // Segunda columna
            email: row[2], // Tercera columna
            password: generateRandomPassword(),
          }));

          // Enviar datos al backend
          const response = await fetch('http://localhost:5001/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentsData),
          });

          if (response.ok) {
            Alert.alert('Éxito', 'Los estudiantes fueron agregados correctamente.');
          } else {
            Alert.alert('Error', 'Ocurrió un problema al enviar los datos al servidor.');
          }
        };

        reader.readAsArrayBuffer(blob);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('Operación cancelada', 'No se seleccionó ningún archivo.');
      } else {
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
