import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    console.log("token devuelvo", token);
    return token;
  } catch (e) {
    console.error('Error obteniendo el token', e);
    return null;
  }
}

const getUserDetails = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      return null;
    }

    // Decodificar el token y verificar la expiración
    const decodedToken = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTime) {
      await AsyncStorage.removeItem('authToken'); // Elimina el token expirado
      return null; // Token expirado
    }

    // Extraer información del token
    const { id, periodo } = decodedToken;

    return {
      id,
      periodo,
    };
  } catch (error) {
    console.error('Error al obtener la información del token:', error);
    return null;
  }
};

export default {
  getToken,
  getUserDetails
}