import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, TextInput, Modal, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SelectDropdown from 'react-native-select-dropdown';
import { useNavigation } from '@react-navigation/native'; // Importar useNavigation
import styles from '../styles/LoginScreenStyles';
import textStyles from '../styles/texto';
import { fetchPeriodos } from '../services/api-auth-service';

const LoginForm = ({ onLoginPress, navegarPress}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para alternar visibilidad de la contraseña
  const [periodos, setPeriodos] = useState([]);
  const [selectedPeriodo, setSelectedPeriodo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Usar el hook useNavigation para obtener el objeto navigation
  const navigation = useNavigation();

  useEffect(() => {
    const cargarPeriodos = async () => {
      try {
        const data = await fetchPeriodos();
        setPeriodos(data);
        console.log('Periodos obtenidos:', data);
      } catch (error) {
        setModalMessage(error.message || 'Error al cargar los períodos académicos');
        setModalVisible(true);
      } finally {
        setIsLoading(false); // Se actualiza el estado de carga
      }
    };

    cargarPeriodos();
  }, []);

  const handleLogin = async () => {
    const newErrors = {}; // Initialize empty errors object

    if (!email) {
      newErrors.email = 'El correo electrónico es obligatorio.';
    }

    if (!password) {
      newErrors.password = 'La contraseña es obligatoria.';
    }

    if (!selectedPeriodo) {
      newErrors.selectedPeriodo = 'Seleccione un período académico.';
    }

    setErrors(newErrors); // Update errors state

    if (Object.keys(newErrors).length === 0) { // Only proceed if no errors
      onLoginPress(email, password, selectedPeriodo);
    }
  };


  const handleNavegar = () => {
    navegarPress();
  };

  return (
    <View style={styles.formContainer}>
      {/* Etiqueta para el campo de Correo Electrónico */}
      <Text style={textStyles.title3}>Correo Electrónico</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="ejemplo@epn.edu.ec"
          style={[textStyles.cuerpo, { flex: 1, paddingRight: 50 }]}
          value={email}
          onChangeText={setEmail}
        />
        <Ionicons name="mail-outline" size={24} color="gray" style={styles.icon} />
      </View>

      {/* Etiqueta para el campo de Contraseña */}
      <Text style={textStyles.title3}>Contraseña</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="********"
          secureTextEntry={!showPassword} // Cambiar visibilidad de la contraseña
          style={[textStyles.cuerpo, { flex: 1, paddingRight: 50 }]} // Asegúrate de dar espacio para el ícono
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.iconContainer} // Contenedor para el icono
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons
            name={showPassword ? 'eye-outline' : 'eye-off-outline'}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      {/* Selección de Período Académico */}
      <Text style={textStyles.title3}>Período Académico</Text>
      <View>
        {isLoading ? (
          <Text>Cargando períodos...</Text> // Puedes poner un spinner o cualquier indicador de carga
        ) : (
          <SelectDropdown
            data={periodos}
            onSelect={(selectedItem) => setSelectedPeriodo(selectedItem)}
            renderButton={(selectedItem, isOpened) => {
              return (
                <View style={styles.dropdownButton}>
                  <Text style={textStyles.cuerpo}>
                    {(selectedItem) || 'Seleccione un período'}
                  </Text>
                </View>
              );
            }}
            renderItem={(item, isSelected) => {
              return (
                <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                  <Text style={textStyles.cuerpo}>{item}</Text>
                </View>
              );
            }}
            rowTextForSelection={(item) => item}
            buttonStyle={styles.dropdownButton}
            buttonTextStyle={textStyles.cuerpo}
            dropdownStyle={styles.inputContainer}
            showsVerticalScrollIndicator={false}
            rowTextStyle={styles.title3}
            rowStyle={{
              backgroundColor: '#f0f0f0',
              borderBottomWidth: 1,
              borderBottomColor: '#ccc',
            }}
          />
        )}
      </View>

      {/* Mostrar errores si hay */}
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      {errors.selectedPeriodo && <Text style={styles.errorText}>{errors.selectedPeriodo}</Text>}

      {/* Botón de Inicio de Sesión */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      {/* Opción de "¿Olvidaste tu contraseña?" */}
      <TouchableOpacity onPress={handleNavegar}>
        <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

      {/* Modal para mostrar errores o mensajes */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeModalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LoginForm;
