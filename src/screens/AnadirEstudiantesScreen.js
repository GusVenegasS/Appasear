import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNBlobUtil from 'react-native-blob-util';
import * as XLSX from 'xlsx';
import styles from '../styles/StudentsStyles';
import Icon from 'react-native-vector-icons/Feather';
import textstyles from '../styles/texto';
import { uploadStudentsData } from '../services/api-auth-service';
import LottieView from 'lottie-react-native';

const AnadirEstudiantesScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAnimation, setModalAnimation] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [isError, setIsError] = useState(false);

  const generateRandomPassword = (length = 12) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleExcelUpload = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.xlsx],
      });

      if (res && res[0]) {
        const fileUri = res[0].uri;

        if (!fileUri) {
          setMensaje('No se pudo obtener la URI del archivo.');
          setIsError(true);
          setModalAnimation(require('../assets/animaciones/errorPerro.json'));
          setModalVisible(true);
          return;
        }

        const fileContent = await RNBlobUtil.fs.readFile(fileUri, 'base64');

        const workbook = XLSX.read(fileContent, { type: 'base64' });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const studentsData = jsonData.slice(1).map((row) => ({
          usuarioId: row[1],
          name: row[2],
          email: row[4],
          telefono: row[5],
          password: generateRandomPassword(),
          rol: 'user',
        }));

        await uploadStudentsData(studentsData);

        setMensaje('Los estudiantes fueron agregados correctamente.');
        setIsError(false);
        setModalAnimation(require('../assets/animaciones/check.json'));
        setModalVisible(true);
      } else {
        setMensaje('No se seleccionó ningún archivo.');
        setIsError(true);
        setModalAnimation(require('../assets/animaciones/errorPerro.json'));
        setModalVisible(true);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        setMensaje('Operación cancelada. No se seleccionó ningún archivo.');
      } else {
        setMensaje('No se pudo cargar el archivo');
      }
      setIsError(true);
      setModalAnimation(require('../assets/animaciones/errorPerro.json'));
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={handleExcelUpload}>
        <Text style={styles.buttonText}>Mediante Excel</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('NuevoEstudianteScreen')}>
        <Text style={styles.buttonText}>Manualmente</Text>
      </TouchableOpacity>

      {/* Modal para mostrar el mensaje de éxito o error */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <LottieView
              source={modalAnimation}
              autoPlay
              loop={!isError}
              style={styles.lottie}
            />
            <Text style={[textstyles.cuerpo, styles.modalText]}>{mensaje}</Text>
            {isError && (
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Icon name="x" size={30} color="black" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AnadirEstudiantesScreen;
