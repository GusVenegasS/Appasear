import RNFS from 'react-native-fs';
import AUTH from "../services/auth-service";

const API_URL = 'http://192.168.1.34:50000';

const crearPeriodo = async (fechaInicio, fechaFin, periodo) => {
    let b = {
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        periodoAcademico: periodo
    }
    let url = `${API_URL}/crearPeriodo`;
    const token = await AUTH.getToken();

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
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

const obtenerBrigadas = async (periodo) => {
    console.log("bodyBrigadas: " + periodo);
    let url = `${API_URL}/obtenerBrigadas?periodoAcademico=${periodo}`;
    const token = await AUTH.getToken();
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
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

const obtenerUsuarios = async (periodo) => {
    console.log("body: " + periodo);
    let url = `${API_URL}/usuarios?periodoAcademico=${periodo}`;
    const token = await AUTH.getToken();

    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
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

const verTarea = async (fecha, brigadaID, periodo) => {
    console.log("body: " + fecha);
    let url = `${API_URL}/verTarea?periodoAcademico=${periodo}&fechaQuery=${fecha}&brigada_id=${brigadaID}`;
    const token = await AUTH.getToken();

    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
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

const verificarPeriodo = async (periodo) => {
    console.log("periodo: " + periodo);
    let url = `${API_URL}/verificarPeriodo?periodo=${periodo}`;
    const token = await AUTH.getToken();

    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
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

const finalizarPeriodo = async (periodo) => {
    console.log("periodo: " + periodo);
    let url = `${API_URL}/finalizarPeriodo?periodo=${periodo}`;
    const token = await AUTH.getToken();

    const requestOptions = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
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

const descargarReporte = async (periodo) => {
    console.log("aquiiiiiiiiii")

    let url = `${API_URL}/reporteAsistencia?periodoAcademico=${periodo}`;
    const token = await AUTH.getToken();

    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Authorization": "Bearer " + token
        },
    };


    return new Promise((resolve, reject) => {
        fetch(url, requestOptions)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Error al descargar el archivo');
                }
                return res.blob(); // Obtener el archivo como un blob
            })
            .then((blob) => {
                const reader = new FileReader();
                reader.onloadend = async () => {
                    const base64data = reader.result.split(',')[1];
                    const RNFS = require('react-native-fs'); // Importa react-native-fs para acceder a la escritura en el dispositivo

                    const path = `${RNFS.DownloadDirectoryPath}/reporte_asistencias.xlsx`;

                    try {
                        await RNFS.writeFile(path, base64data, 'base64');
                        resolve(path); // Devuelve la ruta del archivo descargado
                    } catch (err) {
                        reject(err); // Error al guardar el archivo
                    }
                };
                reader.readAsDataURL(blob);
            })
            .catch((error) => {
                reject(error); // Si ocurre algún error en la solicitud o en el procesamiento
            });
    });
}

export default {
    crearPeriodo,
    obtenerBrigadas,
    obtenerUsuarios,
    verTarea,
    verificarPeriodo,
    finalizarPeriodo,
    descargarReporte
}