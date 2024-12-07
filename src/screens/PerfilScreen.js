import React from 'react';
import { View, ScrollView} from 'react-native';
import styles from '../styles/LoginScreenStyles';
import AvatarUser from '../components/AvatarUser';
import ProfileForm from '../components/ProfileForm';

const PerfilScreen = ({ navigation }) => {

  const navegarCambiarContrasena = () => {
    navigation.navigate('CambiarContrasenaScreen');  // Asegúrate de tener registrada esta pantalla en tu navigator
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar del usuario */}
        <AvatarUser />

        {/* Formulario de perfil */}
        <ProfileForm navegarPress={navegarCambiarContrasena}/>

      </ScrollView>


    </View>
  );
};

export default PerfilScreen;