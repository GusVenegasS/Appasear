import React from 'react';
import { View, ScrollView,Text, TouchableOpacity, StyleSheet  } from 'react-native';
import styles from '../styles/LoginScreenStyles';
import AvatarUser from '../components/AvatarUser';
import ProfileForm from '../components/ProfileForm';
import Icon from 'react-native-vector-icons/Feather';
import TextStyles from '../styles/texto';
import AsyncStorage from '@react-native-async-storage/async-storage';


const PerfilScreen = ({ navigation })  => {
  const handleLogout = async () => {
    try {
      // Limpia el token de AsyncStorage
      await AsyncStorage.removeItem('authToken');

      // Redirige al usuario a la pantalla de inicio de sesión
      navigation.navigate('Iniciar Sesión');
    } catch (e) {
      console.error('Error al cerrar sesión', e);
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.row} onPress={handleLogout}>
          <View style={styles.rowContent}>
            <Icon name="log-out" size={24} color="#008EB6" />
            <Text style={[TextStyles.cuerpo, styles.rowText]}>Cerrar Sesión</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#008EB6" />
        </TouchableOpacity>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar del usuario */}
        <AvatarUser />

        {/* Formulario de perfil */}
        <ProfileForm />
        
      </ScrollView>

      
    </View>
  );
};

export default PerfilScreen;