// src/components/LoginScreen.js
import React, { useState } from 'react';
import { View, ScrollView, Modal, Text, StyleSheet, TouchableOpacity } from 'react-native';
import styles from '../styles/LoginScreenStyles';
import Logo from '../components/Logo';
import LoginForm from '../components/LoginForm';
import { login } from '../services/api-auth-service';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/Feather';

const LoginScreen = ({ navigation, onLogin }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAnimation, setModalAnimation] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [isError, setIsError] = useState(false);

  const handleLogin = async (email, password, periodo) => {
    try {
      // Llamar al servicio de autenticación
      const data = await login(email, password, periodo);

      // Pasamos los datos del usuario a AppNavigator
      onLogin(data);

      // Redirigir dependiendo del rol
      if (data.user.rol === 'admin') {
        setMensaje('Inicio de sesión exitoso');
        setModalAnimation(require('../assets/animaciones/check.json'));
        setIsError(false);
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
          navigation.navigate('Admin'); // Pantalla de Admin
        }, 3000);
      } else if (data.user.rol === 'user') {
        setMensaje('Inicio de sesión exitoso');
        setModalAnimation(require('../assets/animaciones/check.json'));
        setIsError(false);
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
          navigation.navigate('Student'); // Pantalla de Estudiante
        }, 3000);
      }
    } catch (error) {
      setMensaje("Usuario o contraseña incorrectos");
      setModalAnimation(require('../assets/animaciones/errorPerro.json'));
      setIsError(true);
      setModalVisible(true);
    }
  };

  const navegarCambiarContrasena = () => {
    navigation.navigate('ContrasenaScreen');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo de la App */}
        <Logo />

        {/* Formulario de Login */}
        <LoginForm onLoginPress={handleLogin} navegarPress={navegarCambiarContrasena} />
      </ScrollView>

      {/* Modal de Login */}
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
            <Text style={[styles.modalText, styles.textStyle]}>{mensaje}</Text>
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

export default LoginScreen;