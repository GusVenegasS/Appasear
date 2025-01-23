import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, ScrollView, Modal, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../styles/LoginScreenStyles';
import textStyles from '../styles/texto';
import { changePassword } from '../services/api-auth-service';
import LottieView from 'lottie-react-native';

const CambiarContrasenaScreen = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAnimation, setModalAnimation] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [isError, setIsError] = useState(false);

  const cambiarContrasena = async () => {
    if (newPassword !== confirmPassword) {
      setMensaje('Las contraseñas no coinciden.');
      setModalAnimation(require('../assets/animaciones/errorPerro.json'));
      setIsError(true);
      setModalVisible(true);
      return;
    }

    try {
      await changePassword(newPassword);
      setMensaje('Contraseña cambiada correctamente.');
      setModalAnimation(require('../assets/animaciones/check.json'));
      setIsError(false);
      setModalVisible(true);
    } catch (error) {
      console.error(error);
      setMensaje(error.message || 'Ocurrió un problema al cambiar la contraseña.');
      setModalAnimation(require('../assets/animaciones/error_500.json'));
      setIsError(true);
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          {/* Campo para nueva contraseña */}
          <Text style={textStyles.title3}>Nueva Contraseña:</Text>
          <View style={styles.inputContainer}>
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Ingresa tu nueva contraseña"
              secureTextEntry={!showPassword}
              style={[textStyles.cuerpo, { flex: 1, paddingRight: 50 }]}
            />
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          {/* Campo para confirmar nueva contraseña */}
          <Text style={textStyles.title3}>Confirmar Contraseña:</Text>
          <View style={styles.inputContainer}>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirma tu nueva contraseña"
              secureTextEntry={!showPassword1}
              style={[textStyles.cuerpo, { flex: 1, paddingRight: 50 }]}
            />
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => setShowPassword1(!showPassword1)}
            >
              <Ionicons
                name={showPassword1 ? 'eye-outline' : 'eye-off-outline'}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          {/* Botón para cambiar la contraseña */}
          <TouchableOpacity style={styles.loginButton} onPress={cambiarContrasena}>
            <Text style={styles.buttonText}>Cambiar Contraseña</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de feedback */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
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

export default CambiarContrasenaScreen;
