import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, PermissionsAndroid, Platform, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colores from '../styles/colores';
import { launchCamera } from 'react-native-image-picker';
import { guardarTarea } from '../servicesStudent/api-servicesStuden';
import { useNavigation } from '@react-navigation/native';

const EditarTarea = ({ route }) => {
  const { tarea } = route.params;
  const navigation = useNavigation();
  const [observaciones, setObservaciones] = useState('');
  const [evidencia, setEvidencia] = useState(null);
  const [loading, setLoading] = useState(false);

  // Utilizamos la lista de asistentes que ya está en la tarea
  const [asistentes, setAsistentes] = useState(
    tarea.listaAsistentes.map(asistente => ({
      ...asistente,
      seleccionado: false, // Añadir el estado de selección
    }))
  );

  const toggleSeleccionAsistente = (id) => {
    setAsistentes(asistentes.map(asistente => 
      asistente.usuario_id === id ? { ...asistente, seleccionado: !asistente.seleccionado } : asistente
    ));
  };

  const handleGuardar = async () => {
    const idsAsistentesSeleccionados = asistentes
      .filter(asistente => asistente.seleccionado)
      .map(asistente => asistente.usuario_id);

    try {
      setLoading(true);
      await guardarTarea(
        tarea.tarea_id,
        observaciones,
        idsAsistentesSeleccionados,
        evidencia ? evidencia.base64 : null
      );
      Alert.alert("Éxito", "La tarea se completó correctamente.");
      navigation.goBack(); // Regresar a HomeStudent
    } catch (err) {
      console.error("Error al guardar la tarea:", err);
      Alert.alert("Error", "No se pudo completar la tarea. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const solicitarPermisoCamara = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Permiso de Cámara",
            message: "Esta aplicación necesita acceso a tu cámara.",
            buttonNeutral: "Preguntar luego",
            buttonNegative: "Cancelar",
            buttonPositive: "Aceptar"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          abrirCamara();
        } else {
          Alert.alert("Permiso denegado", "No puedes acceder a la cámara sin permiso.");
        }
      } else {
        abrirCamara();
      }
    } catch (err) {
      console.warn("Error al solicitar permiso de cámara:", err);
    }
  };

  const abrirCamara = () => {
    const options = {
      mediaType: 'photo',
      cameraType: 'back',
      includeBase64: true, // Asegúrate de incluir la imagen en base64
      quality: 0.1,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('Usuario canceló la cámara');
      } else if (response.errorCode) {
        console.log('Error al abrir la cámara:', response.errorMessage);
        Alert.alert('Error', 'No se pudo acceder a la cámara. Verifica los permisos.');
      } else if (response.assets && response.assets.length > 0) {
        const { uri, base64 } = response.assets[0];
        setEvidencia({ uri, base64 });
        console.log('Imagen capturada: ', uri);
      console.log(base64)
      } else {
        console.log('No se recibió imagen');
      }
    });
  };

  if (loading) {
    return <ActivityIndicator size="large" color={Colores.primary} style={{ marginTop: 20 }} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={Colores.primary} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>Completar Tarea</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={styles.input}
          value={tarea.descripcion}
          editable={false}
        />

        <Text style={styles.label}>Observaciones:</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={observaciones}
          onChangeText={setObservaciones}
          placeholder="Escribe observaciones..."
          multiline
        />

        <Text style={styles.label}>Asistentes:</Text>
        {asistentes.map((asistente) => (
          <TouchableOpacity
            key={asistente.usuario_id}
            style={styles.checkboxContainer}
            onPress={() => toggleSeleccionAsistente(asistente.usuario_id)}
          >
            <Icon
              name={asistente.seleccionado ? "checkbox" : "square-outline"}
              size={24}
              color={Colores.primary}
            />
            <Text style={styles.checkboxLabel}>{asistente.nombre}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.label}>Subir Evidencia:</Text>
        <View style={styles.evidenciaContainer}>
          <TextInput
            style={styles.evidenciaInput}
            value={evidencia ? 'Imagen capturada' : ''}
            placeholder="Selecciona un archivo..."
            editable={false}
          />
          <TouchableOpacity onPress={solicitarPermisoCamara}>
            <Icon name="camera-outline" size={24} color={Colores.primary} />
          </TouchableOpacity>
        </View>

        {evidencia && (
          <Image source={{ uri: evidencia.uri }} style={styles.previewImage} />
        )}

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.guardarButton} onPress={handleGuardar}>
            <Text style={styles.guardarButtonText}>Guardar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelarButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelarButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // Añadir el estilo para los botones y otros componentes
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelarButton: {
    backgroundColor: 'gray',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    width: '45%',
  },
  cancelarButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
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
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
    marginBottom: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
  evidenciaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 16,
  },
  evidenciaInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 16,
    borderRadius: 8,
  },
  guardarButton: {
    backgroundColor: '#008EB6',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  guardarButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditarTarea;
