import AsyncStorage from '@react-native-async-storage/async-storage';

const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem('authToken');
        return token;
    } catch (e) {
        console.error('Error obteniendo el token', e);
        return null;
    }
};

function crearPeriodo(fechaInicio, fechaFin, periodo) {
    let b = {
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        periodoAcademico: periodo
    }
    let url = `http://192.168.1.64:50000/crearPeriodo`;
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(b)
    };

    return new Promise((resolve, reject) => {
        fetch(url, requestOptions)
            .then((res) => res.json())
            .then(
                (respuesta) => {
                    resolve(respuesta);
                },
                (error) => reject(error)
            );
    });
}

function obtenerBrigadas(periodo) {
    console.log("bodyBrigadas: " + periodo);
    let url = `http://192.168.1.64:50000/obtenerBrigadas?periodoAcademico=${periodo}`;
    const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    };

    return new Promise((resolve, reject) => {
        fetch(url, requestOptions)
            .then((res) => res.json())
            .then(
                (respuesta) => {
                    resolve(respuesta);
                },
                (error) => reject(error)
            );
    });
}

const obtenerUsuarios = async (periodo) => {
    console.log("body: " + periodo);
    let url = `http://192.168.1.64:50000/usuarios?periodoAcademico=${periodo}`;
    const token = await getToken();
    console.log("token: " + token);
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    };

    return new Promise((resolve, reject) => {
        fetch(url, requestOptions)
            .then((res) => res.json())
            .then(
                (respuesta) => {
                    resolve(respuesta);
                },
                (error) => reject(error)
            );
    });
}

function verTarea(fecha, brigadaID, periodo) {
    console.log("body: " + fecha);
    let url = `http://192.168.1.64:50000/verTarea?periodoAcademico=${periodo}&fechaQuery=${fecha}&brigada_id=${brigadaID}`;
    const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    };

    return new Promise((resolve, reject) => {
        fetch(url, requestOptions)
            .then((res) => res.json())
            .then(
                (respuesta) => {
                    resolve(respuesta);
                },
                (error) => reject(error)
            );
    });
}

export default {
    crearPeriodo,
    obtenerBrigadas,
    obtenerUsuarios,
    verTarea
}