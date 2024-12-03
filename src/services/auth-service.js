import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";

const getRol = async () => {
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
  
      return decodedToken.rol;
    } catch (error) {
      console.error('Error al obtener el rol del token:', error);
      return null;
    }
  };
export default {
    getRol
}