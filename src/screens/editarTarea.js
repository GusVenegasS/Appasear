import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EditarTarea = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>¡Hola! Estás editando una tarea.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default EditarTarea;