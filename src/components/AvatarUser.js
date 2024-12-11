import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNBlobUtil from 'react-native-blob-util';
import ImageResizer from 'react-native-image-resizer';
import { fetchImagenPerfil, uploadImagenPerfil } from '../services/api-auth-service';

const AvatarUser = () => {
  const [imagenPerfil, setImagenPerfil] = useState(null); // Estado para la imagen

  // Cargar la foto de perfil al montar el componente
  useEffect(() => {
    const cargarImagen = async () => {
      const imagen = await fetchImagenPerfil();
      if (imagen) {
        setImagenPerfil(imagen);
      }
    };

    cargarImagen();
  }, []);

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
        const success = await uploadImagenPerfil(fileContent); // Subir la imagen comprimida
        if (success) {
          Alert.alert('Éxito', 'Foto de perfil actualizada.');
          setImagenPerfil(fileContent); // Actualizar la imagen en el estado
        }
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('Operación cancelada', 'No se seleccionó ningún archivo.');
      } else {
        console.error('Error al seleccionar la imagen:', err);
      }
    }
  };

  return (
    <View style={styles.avatarContainer}>
      <TouchableOpacity onPress={pickImage}>
        <Image
          style={styles.avatar}
          source={
            imagenPerfil
              ? {
                  uri: imagenPerfil?.startsWith('data:image/')
                    ? imagenPerfil // Usa la imagen con prefijo existente.
                    : `data:image/png;base64,${imagenPerfil}`, // Agrega prefijo si falta.
                }
              : require('../assets/images/avatar_placeholder.png') // Imagen predeterminada.
          }
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
