import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { addStudent } from '../services/api-auth-service'; // Importamos el servicio
import Icon from 'react-native-vector-icons/Feather';
import textStyles from '../styles/texto';
import LottieView from 'lottie-react-native';

const NuevoEstudianteScreen = ({ navigation }) => {
  const [usuarioId, setUsuarioId] = useState('');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAnimation, setModalAnimation] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [isError, setIsError] = useState(false);

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
      setMensaje('Por favor completa todos los campos');
      setIsError(true);
      setModalAnimation(require('../assets/animaciones/error_500.json'));
      setModalVisible(true);
      return;
    }

    try {
      // Llamamos al servicio para agregar al estudiante
      await addStudent(usuarioId, nombre, correo, telefono, generateRandomPassword());

      setMensaje('Estudiante agregado correctamente');
      setIsError(false);
      setModalAnimation(require('../assets/animaciones/check.json'));
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        navigation.goBack();
      }, 3000);
    } catch (error) {
      setMensaje(error.message || 'Ocurrió un problema al agregar el estudiante');
      setIsError(true);
      setModalAnimation(require('../assets/animaciones/error_500.json'));
      setModalVisible(true);
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
  button: {
    backgroundColor: "#008EB6",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
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
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 100,
    height: 100,
  },
  modalText: {
    fontSize: 16,
    color: 'black',
    marginTop: 15,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
},
};

export default NuevoEstudianteScreen;
