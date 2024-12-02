import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import LottieView from 'lottie-react-native';
import { useFocusEffect } from '@react-navigation/native';
import TextStyles from '../styles/texto';
import Icon from 'react-native-vector-icons/Feather';
import API from "../services/api-services";

const UserScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState('');
  const [animationSource, setAnimationSource] = useState(require('../assets/animaciones/errorPerro.json'));
  const periodo = "2024-B";

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const respuesta = await API.obtenerUsuarios(periodo);  // Aquí va la URL de tu API
          console.log(respuesta);
          if (respuesta.status === 404) {
            setApiMessage(respuesta.message); // no hay brigadas
            setAnimationSource(require('../assets/animaciones/errorPerro.json'));
          } else if (respuesta.status === 500) {
            setApiMessage(respuesta.message); // esta levantado pero no se obtuvo respuesta
            setAnimationSource(require('../assets/animaciones/error_500.json'));
          } else {
            setUsers(respuesta);
            setApiMessage('');
          }
        } catch (error) {
          console.error('Error fetching users:', error);
          setApiMessage('Upss! Algo salió mal'); // el servidor está caído
          setAnimationSource(require('../assets/animaciones/serverError.json'));
        } finally {
          setLoading(false);  // Finalizamos la carga cuando obtenemos los datos
        }
      };
      fetchData();
    }, [])
  );

  const navigateToDetails = (user) => {
    navigation.navigate('Información estudiante', { user });
  };

  const navigateToNewScreen = () => {
    navigation.navigate('AnadirEstudiantesScreen'); // Ajusta el nombre de la pantalla a la que quieres navegar
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.animationContainer}>
          <LottieView
            source={require('../assets/animaciones/cargando.json')}
            autoPlay
            loop
            style={styles.animation}
          />
        </View>
      ) : apiMessage ? (
        <View style={styles.centeredView}>
          <LottieView
            source={animationSource}
            autoPlay
            loop
            style={styles.animation}
          />
          <Text style={[TextStyles.title3, TextStyles.centeredText]}>{apiMessage}</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {users.map((user) => (
            <View key={user._id} style={styles.card}>
              <Text style={[TextStyles.cuerpo, styles.cardText]}>{user.nombre}</Text>
              <TouchableOpacity onPress={() => navigateToDetails(user)}>
                <Icon name="eye" size={24} color="#008EB6" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Botón flotante */}
      <TouchableOpacity style={styles.fab} onPress={navigateToNewScreen}>
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Aseguramos que los elementos no estén centrados
    alignItems: 'stretch', // Alineamos todos los elementos a lo largo de la pantalla
  },
  animationContainer: {
    flex: 1,
    justifyContent: 'center', // Centramos la animación de carga
    alignItems: 'center',
    marginTop: 20, // Margen superior para evitar que se pegue al borde
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20, // Evitar que se quede pegado a la parte superior
  },
  animation: {
    width: 200,
    height: 200,
  },
  scrollContainer: {
    padding: 20, // Agregamos padding general a las tarjetas
    paddingBottom: 20, // Espacio extra al final
  },
  card: {
    flexDirection: 'row', // Alineación horizontal
    justifyContent: 'space-between', // Espacio entre el texto y el ícono
    alignItems: 'center', // Alineación vertical
    width: '100%',
    padding: 15,
    marginVertical: 10,
    borderWidth: 2,
    borderColor: '#008EB6', // Borde azul
    borderRadius: 10,
    backgroundColor: '#fff', // Fondo blanco
  },
  cardText: {
    flex: 1, // El texto ocupa todo el espacio disponible
    marginRight: 10, // Espacio entre el texto y el ícono
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
    backgroundColor: '#008EB6',
    borderRadius: 30,
    elevation: 8,
  },
});

export default UserScreen;
