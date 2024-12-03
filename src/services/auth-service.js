import AsyncStorage from '@react-native-async-storage/async-storage';

const getRol = async () => {
    const token = await AsyncStorage.getItem('authToken');
    if (!token || isTokenExpired()) {
        return null;
    }
    try {
        const decodedToken = jwtDecode(token);
        return decodedToken.rol;
    } catch (error) {
        console.error('Error al decodificar el token:', error.message);
        return null;
    }

}

export default {
    getRol
}