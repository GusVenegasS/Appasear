import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Modal, Text } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNBlobUtil from 'react-native-blob-util';
import ImageResizer from 'react-native-image-resizer';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Importa Ionicons
import LottieView from 'lottie-react-native';
import TextStyles from '../styles/texto';
import Icon from 'react-native-vector-icons/Feather';
import { fetchImagenPerfil, uploadImagenPerfil } from '../services/api-auth-service';

const AvatarUser = () => {
  const [imagenPerfil, setImagenPerfil] = useState(null); // Estado para la imagen
  const [modalVisible, setModalVisible] = useState(false); // Estado para mostrar el modal
  const [modalAnimation, setModalAnimation] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [isError, setIsError] = useState(false);

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
          setModalAnimation(require('../assets/animaciones/check.json'));
          setIsError(false);
          setMensaje('Foto de perfil actualizada.');
          setModalVisible(true);
          setImagenPerfil(fileContent); // Actualizar la imagen en el estado
          setTimeout(() => {
            setRefresh(!refresh);
            setModalVisible(false);
          }, 3000);
        }
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        setModalAnimation(require('../assets/animaciones/errorPerro.json'));
        setMensaje('No se seleccionó ningún archivo.');
        setIsError(true);
        setModalVisible(true);
      } else {
        console.error('Error al seleccionar la imagen:', err);
      }
    }
  };

  return (
    <View style={styles.avatarContainer}>
      <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
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
        {/* Ícono de cámara en la esquina inferior derecha */}
        <View style={styles.cameraIconContainer}>
          <Ionicons name="camera" size={24} color="#fff" />
        </View>
      </TouchableOpacity>

      {/* Modal para mostrar el mensaje */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <LottieView
              source={modalAnimation}
              autoPlay
              loop={!isError}
              style={styles.lottie}
            />
            <Text style={[TextStyles.cuerpo, styles.modalText]}>{mensaje}</Text>
            {isError && (
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Icon name="x" size={30} color="black" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: '#d3d3d3',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#008EB6',
    borderRadius: 12,
    padding: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  lottie: {
    width: 150,
    height: 150,
  },
});

export default AvatarUser;
