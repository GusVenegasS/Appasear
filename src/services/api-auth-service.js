import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BASE_URL = 'https://appbackauth.ashysea-2c880eb9.australiaeast.azurecontainerapps.io/api';

const getAuthToken = async () => {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
        throw new Error('No se ha encontrado el token de autenticación.');
    }
    return token;
};

// Obtener imagen de perfil
export const fetchImagenPerfil = async () => {
    try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
            console.error('No se encontró el token de autenticación');
            return null;
        }

        const response = await fetch(`${BASE_URL}/user/profile`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            return data.imagenPerfil;
        } else {
            console.error('Error al obtener la imagen de perfil.');
            return null;
        }
    } catch (error) {
        console.error('Error al cargar la imagen de perfil:', error);
        return null;
    }
};

// Subir una nueva imagen de perfil
export const uploadImagenPerfil = async (imageBase64) => {
    try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
            throw new Error('Token de autenticación no encontrado.');
        }

        const response = await fetch(`${BASE_URL}/profile-photo`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ imagenPerfil: imageBase64 }),
        });

        if (response.ok) {
            return true;
        } else {
            const data = await response.json();
            console.error('Error al subir la foto:', data.message);
            return false;
        }
    } catch (error) {
        console.error('Error al subir la foto de perfil:', error);
        return false;
    }
};

// Obtener períodos académicos
export const fetchPeriodos = async () => {
    try {
        const response = await fetch(`${BASE_URL}/periodos`);
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('No se pudieron cargar los períodos académicos.');
        }
    } catch (error) {
        console.error('Error al obtener períodos:', error);
        throw error;
    }
};

// Login de usuario
export const loginUser = async (email, password, periodo) => {
    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, periodo }),
        });

        if (response.ok) {
            const data = await response.json();
            return data; // Devuelve los datos del usuario, como el token de autenticación
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Error al iniciar sesión.');
        }
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        throw error;
    }
};

// Obtener perfil de usuario
export const fetchUserProfile = async () => {
    const token = await getAuthToken();
    const response = await fetch(`${BASE_URL}/user/profile`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Error en la solicitud, código de estado: ${response.status}`);
    }

    return await response.json();
};

// Actualizar teléfono del usuario
export const updatePhoneNumber = async (telefono) => {
    const token = await getAuthToken();
    const response = await fetch(`${BASE_URL}/telefono`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ telefono }),
    });

    if (!response.ok) {
        throw new Error(`Error al actualizar, código de estado: ${response.status}`);
    }

    return await response.json();
};

// Enviar datos de estudiantes al servidor
export const uploadStudentsData = async (studentsData) => {
    const token = await getAuthToken();

    const response = await fetch(`${BASE_URL}/students`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(studentsData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ocurrió un problema al enviar los datos.');
    }

    return await response.json();
};

export const changePassword = async (newPassword) => {
    const token = await getAuthToken();

    const response = await fetch(`${BASE_URL}/cambiar-contrasena`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword }),
    });

    if (!response.ok) {
        throw new Error(`Error al cambiar la contraseña, código de estado: ${response.status}`);
    }

    return await response.json();
};

export const requestPasswordReset = async (correo) => {
    try {
        const response = await axios.post(`${BASE_URL}/olvidar-contrasena`, { correo });
        return response.data; // Asume que la respuesta incluye un mensaje
    } catch (error) {
        throw error.response?.data?.message || 'Ocurrió un error al solicitar el cambio de contraseña.';
    }
};

export const login = async (email, password, periodo) => {
    try {
        const response = await axios.post(`${BASE_URL}/login`, { email, password, periodo });

        // Guardar el token en AsyncStorage
        await AsyncStorage.setItem('authToken', response.data.token);

        return response.data; // Devuelve los datos del usuario
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error al conectar con el servidor.';
        throw new Error(errorMessage);
    }
};

export const addStudent = async (usuarioId, nombre, correo, telefono) => {
    try {
        const token = await AsyncStorage.getItem('authToken'); // Recuperar el token

        const estudiante = {
            usuarioId,
            name: nombre,
            email: correo,
            telefono,
            password: 'defaultPassword123',
            rol: 'user',
        };

        const response = await axios.post(`${BASE_URL}/students`, [estudiante], {
            headers: {
                Authorization: `Bearer ${token}`, // Enviar el token en el header
            },
        });

        return response.data; // Devuelve la respuesta, que puede incluir el mensaje de éxito
    } catch (error) {
        throw new Error('Ocurrió un problema al agregar el estudiante');
    }
};
