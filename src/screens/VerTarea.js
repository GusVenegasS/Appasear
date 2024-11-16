import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colores from '../styles/colores';

const { width } = Dimensions.get('window');

const VerTarea = ({ route, navigation }) => {
  const { tarea } = route.params;

  // Condición para el botón de editar o ver según el estado de la tarea
  const esEditable = tarea.estado === 'Por Completar';

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Tarea</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Descripción</Text>
        <Text style={styles.textValue}>{tarea.titulo}</Text>

        <Text style={styles.label}>Observaciones</Text>
        <Text style={styles.textValue}>{tarea.observaciones || "Sin observaciones"}</Text>

        <Text style={styles.label}>Asistentes</Text>
        {tarea.asistentes && tarea.asistentes.length > 0 ? (
          tarea.asistentes.map((asistente, index) => (
            <View key={index} style={styles.asistenteContainer}>
              <Icon name="checkmark-circle" size={20} color={Colores.primary} />
              <Text style={styles.asistenteText}>{asistente.nombre}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.textValue}>No hay asistentes</Text>
        )}

        <Text style={styles.label}>Evidencia</Text>
        {tarea.evidencia ? (
          <Image source={{ uri: tarea.evidencia }} style={styles.previewImage} />
        ) : (
          <Text style={styles.textValue}>No hay evidencia</Text>
        )}

        {/* Botón de Editar o Ver */}
    
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F8F8F8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colores.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 20,
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colores.primary,
  },
  textValue: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  asistenteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  asistenteText: {
    fontSize: 16,
    marginLeft: 8,
  },
  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 16,
    borderRadius: 8,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  editButton: {
    backgroundColor: '#008EB6',
  },
  viewButton: {
    backgroundColor: '#D3D3D3',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VerTarea;
