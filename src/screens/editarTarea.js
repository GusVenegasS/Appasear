import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ScrollView, Image, Alert, PermissionsAndroid, Platform, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colores from '../styles/colores';
import { launchCamera } from 'react-native-image-picker';
import { guardarTarea } from '../servicesStudent/api-servicesStuden';
import { useNavigation } from '@react-navigation/native';
import TextStyles from "../styles/texto";
import ErrorModal from "../components/ErrorAlert";
import SuccessModal from "../components/SuccesModal";
import LottieView from 'lottie-react-native';
const EditarTarea = ({ route }) => {
  const { tarea } = route.params;
  const navigation = useNavigation();
  const [observaciones, setObservaciones] = useState('');
  const [evidencia, setEvidencia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState('');
   const [modalAnimation, setModalAnimation] = useState(null); 

  // Utilizamos la lista de asistentes que ya está en la tarea
  const [asistentes, setAsistentes] = useState(
    tarea.listaAsistentes.map(asistente => ({
      ...asistente,
      seleccionado: false, // Añadir el estado de selección
    }))
  );
  const showErrorModal = (message) => {
    setError(message);
        setModalAnimation(require('../assets/animaciones/errorPerro.json'));
        setModalVisible(true);
};

const closeModal = () => {
    setModalVisible(false);
    setError(null);
};

const showSuccessModal = (message) => {
  setSuccessMessage(message);
  setModalAnimation(require('../assets/animaciones/check.json')); // Animación para éxito
  setSuccessModalVisible(true);
};

const closeSuccessModal = () => {
    setSuccessModalVisible(false);
    setSuccessMessage('');
    navigation.goBack(); 
};

  const toggleSeleccionAsistente = (id) => {
    setAsistentes(asistentes.map(asistente => 
      asistente.usuario_id === id ? { ...asistente, seleccionado: !asistente.seleccionado } : asistente
    ));
  };

  const handleGuardar = async () => {
    const idsAsistentesSeleccionados = asistentes
      .filter(asistente => asistente.seleccionado)
      .map(asistente => asistente.usuario_id);

    if (!observaciones.trim()) {
      showErrorModal("La observación es obligatoria.");
      return;
    }
    if (idsAsistentesSeleccionados.length === 0) {
      showErrorModal("Debes seleccionar al menos un asistente.");
      return;
    }

    // Validar que la evidencia esté presente
    if (!evidencia || !evidencia.base64) {
      showErrorModal("Es obligatorio subir una evidencia.");
      return;
    }

    try {
      setLoading(true);
     
      await guardarTarea(
        tarea.tarea_id,
        observaciones,
        idsAsistentesSeleccionados,
        evidencia ? evidencia.base64 : null
      );
      showSuccessModal("La tarea se completó correctamente.");
      
    } catch (err) {
      console.error("Error al guardar la tarea:", err);
      showErrorModal("No se pudo completar la tarea. Intente nuevamente.");
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
      includeBase64: true,
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
       {successModalVisible || modalVisible ? (
        <View style={styles.overlay} />
      ) : null}

      <View style={styles.form}>
        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.noEditable, { color: 'gray' }]} 
          value={tarea.descripcion}
          editable={false}
        />

        <Text style={styles.label}>Observaciones:</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={observaciones}
          onChangeText={setObservaciones}
          placeholder="Ingresa las observaciones..."
          placeholderTextColor="gray"
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
              name={asistente.seleccionado ? "checkbox" : "square-outline" }
              size={24}
              color='#333'
             
            />
            <Text style={styles.checkboxLabel}>{asistente.nombre}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.label}>Subir Evidencia:</Text>
        <View style={[styles.input, styles.evidenciaContainer]}>
          <TextInput
            style={styles.evidenciaInput}
            value={evidencia ? 'Imagen capturada' : ''}
            placeholder="Captura la evidencia"
            placeholderTextColor="gray"
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
            <Text style={TextStyles.boton}>Guardar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelarButton} onPress={() => navigation.goBack()}>
            <Text style={TextStyles.boton}>Cancelar</Text>
          </TouchableOpacity>
        </View>
         {/* Modal de Éxito */}
         <Modal
                animationType="slide"
                transparent={true}
                visible={successModalVisible}
                onRequestClose={closeSuccessModal}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <LottieView
                            source={modalAnimation}
                            autoPlay
                            loop={false}
                            style={styles.lottie}
                        />
                        <Text style={[TextStyles.cuerpo, styles.modalText]}>{successMessage}</Text>
                        <TouchableOpacity onPress={closeSuccessModal} style={styles.closeButton}>
                            <Icon name="close" size={30} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal de Error */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <LottieView
                            source={modalAnimation}
                            autoPlay
                            loop={false}
                            style={styles.lottie}
                        />
                        <Text style={[TextStyles.cuerpo, styles.modalText]}>{error}</Text>
                        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                            <Icon name="close" size={30} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
      </View>
      
    
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // Añadir el estilo para los botones y otros componentes

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
},
modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxWidth: 300, // Limitar el tamaño del modal
    paddingBottom: 20,
},
lottie: {
    width: 150,
    height: 150,
    marginBottom: 20, // Aseguramos que haya espacio entre la animación y el texto
},
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 16,
},
  cancelarButton: {
    backgroundColor: 'gray',
    paddingVertical: 12,
    borderRadius: 8,
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
    marginBottom: 30,
  },
  form: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderColor: "#008EB6",
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',

    color: "black",
   
    marginBottom: 16,
  },
  noEditable: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    backgroundColor: '#F1F1F1',
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
    fontFamily: 'Nunito-SemiBold',
  },
  evidenciaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    borderRadius: 8,
    alignItems: 'center',
    width: '45%',
  },
  guardarButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
    zIndex: 999, // Asegura que esté encima del contenido
  },
});

export default EditarTarea;
