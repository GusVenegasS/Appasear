import React from 'react';
import { View, TouchableOpacity, Text, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Asegúrate de tener Ionicons instalado
import styles from '../styles/LoginScreenStyles'; // O el estilo adecuado
import textStyles from '../styles/texto'; // O el estilo adecuado

const LoginForm = ({ onLoginPress }) => {
  return (
    <View style={styles.formContainer}>
      {/* Etiqueta para el campo de Correo Electrónico */}
      <Text style={textStyles.title3}>Correo Electrónico</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="ejemplo@epn.edu.ec"
          style={textStyles.cuerpo}
        />
        <Ionicons name="mail-outline" size={24} color="gray" style={styles.icon} />
      </View>

      {/* Etiqueta para el campo de Contraseña */}
      <Text style={textStyles.title3}>Contraseña</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="********"
          secureTextEntry={true}
          style={textStyles.cuerpo}
        />
        <Ionicons name="lock-closed-outline" size={24} color="gray" style={styles.icon} />
      </View>

      {/* Botón de Inicio de Sesión */}
      <TouchableOpacity style={styles.loginButton} onPress={onLoginPress}>
        <Text style={textStyles.title3}>Iniciar Sesión</Text>
      </TouchableOpacity>

      {/* Opción de "¿Olvidaste tu contraseña?" */}
      <TouchableOpacity onPress={() => {}}>
        <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginForm;
