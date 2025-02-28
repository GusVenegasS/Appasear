import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Modal, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Importa Ionicons
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/Feather';
import { requestPasswordReset } from '../services/api-auth-service'; // Importa el servicio de API
import textStyles from '../styles/texto';

const ContrasenaScreen = () => {
  const [correo, setCorreo] = useState('');
  const [modalVisible, setModalVisible] = useState(false); // Estado para mostrar el modal
  const [modalAnimation, setModalAnimation] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [isError, setIsError] = useState(false);

  const handleChangePassword = async () => {
    try {
      await requestPasswordReset(correo);
      setModalAnimation(require('../assets/animaciones/check.json'));
      setIsError(false);
      setMensaje('Se cambió la contraseña correctamente y se envió por correo electrónico.');
      setModalVisible(true); // Actualizar la imagen en el estado
      setTimeout(() => {
        setModalVisible(false);
      }, 3000);
    } catch (error) {
      setModalAnimation(require('../assets/animaciones/errorPerro.json'));
      setMensaje('Error, revise nuevamente el correo ingresado.');
      setIsError(true);
      setModalVisible(true);
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
              <Text style={[textStyles.cuerpo, styles.modalText]}>{mensaje}</Text>
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
  lottie: {
    width: 150,
    height: 150,
  },
};

export default ContrasenaScreen;
