import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, Modal } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import styles from '../styles/LoginScreenStyles';
import textStyles from '../styles/texto';
import { fetchUserProfile, updatePhoneNumber } from '../services/api-auth-service';

const ProfileForm = ({ navegarPress }) => {
  const [telefono, setTelefono] = useState('');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAnimation, setModalAnimation] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profile = await fetchUserProfile();
        setNombre(profile.nombre);
        setCorreo(profile.correo);
        setTelefono(profile.telefono);
      } catch (error) {
        console.error(error);
        setMensaje('Ocurrió un problema al obtener los datos.');
        setIsError(true);
        setModalAnimation(require('../assets/animaciones/errorPerro.json'));
        setModalVisible(true);
      }
    };

    loadUserProfile();
  }, []);

  const guardarTelefono = async () => {
    try {
      await updatePhoneNumber(telefono);
      setMensaje('Número de teléfono actualizado correctamente.');
      setIsError(false);
      setModalAnimation(require('../assets/animaciones/check.json'));
      setModalVisible(true);
      setTimeout(() => {
        setRefresh(!refresh);
        setModalVisible(false);
      }, 3000);
    } catch (error) {
      console.error(error);
      setMensaje('Ocurrió un problema al guardar los cambios.');
      setIsError(true);
      setModalAnimation(require('../assets/animaciones/errorPerro.json'));
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.formContainer}>
      {/* Campo de nombre no editable */}
      <Text style={textStyles.title3}>Nombre:</Text>
      <View style={styles.inputContainer2}>
        <TextInput value={nombre} editable={false} style={[textStyles.cuerpo, { flex: 1, paddingRight: 50 }]} />
        <Ionicons name="person-outline" size={24} color="gray" style={styles.icon} />
      </View>

      {/* Campo de correo no editable */}
      <Text style={textStyles.title3}>Correo Electrónico:</Text>
      <View style={styles.inputContainer2}>
        <TextInput
          value={correo}
          editable={false}
          style={[textStyles.cuerpo, { flex: 1, paddingRight: 50 }]}
          keyboardType="email-address"
        />
        <Ionicons name="mail-outline" size={24} color="gray" style={styles.icon} />
      </View>

      {/* Campo de número de celular */}
      <Text style={textStyles.title3}>Número de celular:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          value={telefono}
          onChangeText={setTelefono}
          placeholder="Número de celular"
          style={[textStyles.cuerpo, { flex: 1, paddingRight: 50 }]}
          keyboardType="phone-pad"
        />
        <Ionicons name="call-outline" size={24} color="gray" style={styles.icon} />
      </View>

      {/* Botón de guardar */}
      <TouchableOpacity style={styles.loginButton} onPress={guardarTelefono}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={navegarPress}>
        <Text style={styles.buttonText}>Cambiar Contraseña</Text>
      </TouchableOpacity>

      {/* Modal de resultado */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
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
                <Ionicons name="close-circle" size={30} color="black" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileForm;
