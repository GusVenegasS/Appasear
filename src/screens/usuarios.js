import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import styles from '../styles/StudentsStyles';
import textStyles from '../styles/texto';

const UserScreen = ({ navigation }) => {
  return (
    <View>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AnadirEstudiantesScreen')}>
        <Text style={textStyles.title3}>Agregar estudiantes</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserScreen;