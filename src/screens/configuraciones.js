// src/screens/SettingsScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TextStyles from '../styles/texto';
import Icon from 'react-native-vector-icons/Feather';

const SettingsScreen = ({ navigation }) => {

  const handleLogout = async () => {
    try {
      // Limpia el token de AsyncStorage
      await AsyncStorage.removeItem('authToken');

      // Redirige al usuario a la pantalla de inicio de sesión
      navigation.navigate('Login');
    } catch (e) {
      console.error('Error al cerrar sesión', e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity style={styles.row} onPress={() => { /* Navega a la pantalla de Perfil */ }}>
          <View style={styles.rowContent}>
            <Icon name="user" size={24} color="#008EB6" />
            <Text style={[TextStyles.cuerpo, styles.rowText]}>Perfil</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#008EB6" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Período académico')}>
          <View style={styles.rowContent}>
            <Icon name="calendar" size={24} color="#008EB6" />
            <Text style={[TextStyles.cuerpo, styles.rowText]}>Período Académico</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#008EB6" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.row} onPress={handleLogout}>
          <View style={styles.rowContent}>
            <Icon name="log-out" size={24} color="#008EB6" />
            <Text style={[TextStyles.cuerpo, styles.rowText]}>Cerrar Sesión</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#008EB6" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 16,
    borderColor: '#008EB6',
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    height: 200
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowText: {
    marginLeft: 10,
  },
});

export default SettingsScreen;
