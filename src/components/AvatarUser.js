import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNBlobUtil from 'react-native-blob-util';
import ImageResizer from 'react-native-image-resizer';

const AvatarUser = () => {
  const [imagenPerfil, setImagenPerfil] = useState(null); // Estado para la imagen

  // Función para obtener la imagenPerfil desde la base de datos
  const fetchImagenPerfil = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.error('No se encontró el token de autenticación');
        return;
      }

      const response = await fetch('http://192.168.100.3:5001/api/user/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setImagenPerfil(data.imagenPerfil); // Asignar la imagen de la base de datos
        console.log(imagenPerfil);
      } else {
        console.error('Error al obtener la imagen de perfil.');
      }
    } catch (error) {
      console.error('Error al cargar la imagen de perfil:', error);
    }
  };

  // Manejar la subida de una nueva imagen
  const uploadImagenPerfil = async (imageBase64) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'Token de autenticación no encontrado.');
        return;
      }

      const response = await fetch('http://192.168.100.3:5001/api/profile-photo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imagenPerfil: imageBase64 }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Éxito', 'Foto de perfil actualizada.');
        setImagenPerfil(imageBase64);
      } else {
        console.error('Error al subir la foto:', data.message);
      }
    } catch (error) {
      console.error('Error al subir la foto de perfil:', error);
    }
  };

  // Función para seleccionar una imagen
  const pickImage = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
  
      if (result && result[0]) {
        const fileUri = result[0].uri;
  
        // Comprimir la imagen antes de leerla
        const resizedImage = await ImageResizer.createResizedImage(
          fileUri, 
          800, // Ancho deseado
          800, // Alto deseado
          'JPEG', // Formato
          80, // Calidad (de 0 a 100)
          0, // Rotación en grados
          null // Salida del archivo
        );
  
        const fileContent = await RNBlobUtil.fs.readFile(resizedImage.uri, 'base64');
        uploadImagenPerfil(fileContent);  // Enviar la imagen comprimida
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('Operación cancelada', 'No se seleccionó ningún archivo.');
      } else {
        console.error('Error al seleccionar la imagen:', err);
      }
    }
  };

  // Cargar la foto de perfil al montar el componente
  useEffect(() => {
    fetchImagenPerfil();
  }, []);

  return (
    <View style={styles.avatarContainer}>
      <TouchableOpacity onPress={pickImage}>
        <Image
          style={styles.avatar}
          source={{
            uri: imagenPerfil?.startsWith('data:image/')
              ? imagenPerfil // Usa la imagen con prefijo existente.
              : `data:image/png;base64,${imagenPerfil}`, // Agrega prefijo si falta.
          }}
        />
      </TouchableOpacity>
    </View>
  );  
};

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: '#d3d3d3',
  },
});

export default AvatarUser;
