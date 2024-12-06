import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, TextInput, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SelectDropdown from 'react-native-select-dropdown';
import styles from '../styles/LoginScreenStyles';
import textStyles from '../styles/texto';
import authService from '../services/auth-service';

const LoginForm = ({ onLoginPress }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para alternar visibilidad de la contraseña
  const [periodos, setPeriodos] = useState([]);
  const [selectedPeriodo, setSelectedPeriodo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPeriodos = async () => {
      try {
        const response = await fetch('http://192.168.1.34:5001/api/periodos');
        const data = await response.json();
        if (response.status === 200) {
          setPeriodos(data);
          console.log('Periodos obtenidos:', data);
        } else {
          Alert.alert('Error', 'No se pudieron cargar los períodos académicos');
        }
      } catch (error) {
        Alert.alert('Error', 'Error al cargar los períodos académicos');
        console.error('Error al obtener períodos:', error);
      } finally {
        setIsLoading(false); // Se actualiza el estado de carga
      }
    };

    fetchPeriodos();
  }, []);

  const handleLogin = async () => {
    onLoginPress(email, password, selectedPeriodo);
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

      {/* Botón de Inicio de Sesión */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={textStyles.title3}>Iniciar Sesión</Text>
      </TouchableOpacity>

      {/* Opción de "¿Olvidaste tu contraseña?" */}
      <TouchableOpacity onPress={() => { }}>
        <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginForm;
