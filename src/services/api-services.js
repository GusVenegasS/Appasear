import RNFS from 'react-native-fs';
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

function obtenerUsuarios(periodo) {
    console.log("body: " + periodo);
    let url = `http://192.168.1.64:50000/usuarios?periodoAcademico=${periodo}`;
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

function verificarPeriodo(periodo) {
    console.log("periodo: " + periodo);
    let url = `http://192.168.1.64:50000/verificarPeriodo?periodo=${periodo}`;
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

function finalizarPeriodo(periodo) {
    console.log("periodo: " + periodo);
    let url = `http://192.168.1.64:50000/finalizarPeriodo?periodo=${periodo}`;
    const requestOptions = {
        method: "PUT",
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

function descargarReporte(periodo) {
    console.log("aquiiiiiiiiii")

    let url = `http://192.168.1.64:50000/reporteAsistencia?periodoAcademico=${periodo}`;
    const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
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