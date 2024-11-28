// Obtener todas las brigadas de un periodo académico

const API_URL = 'http://192.168.3.69:50000/';

function obtenerBrigadas(periodo) {
    console.log("Obteniendo todas las brigadas para el periodo: " + periodo);
    let url = `http://localhost:50000/brigadas?periodoAcademico=${periodo}`;
    const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    };

    return new Promise((resolve, reject) => {
        fetch(url, requestOptions)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Error al obtener las brigadas');
                }
                return res.json();
            })
            .then(
                (respuesta) => {
                    resolve(respuesta);
                },
                (error) => reject(error)
            );
    });
}

// Obtener brigadas con cupos disponibles para un periodo académico
function obtenerBrigadasDisponibles(periodo) {
    console.log("Obteniendo brigadas disponibles para el periodo: " + periodo);
    let url = `http://192.168.3.69:50000/brigadas/disponibles?periodoAcademico=${periodo}`;
    console.log(url)
    const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    };

    return new Promise((resolve, reject) => {
        fetch(url, requestOptions)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Error al obtener las brigadas disponibles');
                }
                return res.json();
            })
            .then(
                (respuesta) => {
                    resolve(respuesta);
                },
                (error) => reject(error)
            );
    });
}

// Servicio para seleccionar brigadas
export async function seleccionarBrigadas(usuario_id, brigada_ids, periodoAcademico) {
    try {
        let url = `http://192.168.3.69:50000/brigadas/seleccionar`;
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuario_id,
                brigada_ids,
                periodoAcademico
            }),
        };

        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error al seleccionar brigadas:", error);
        throw error;
    }
}

function obtenerTareasPorBrigada(usuarioId, periodoAcademico) {
    console.log("Obteniendo tareas para la brigada del usuario: " + usuarioId + " en el periodo académico: " + periodoAcademico);
    let url = `${API_URL}/tareas/brigada?usuario_id=${usuarioId}&periodoAcademico=${periodoAcademico}`;
    console.log("URL:", url);

    const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    };

    return new Promise((resolve, reject) => {
        fetch(url, requestOptions)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Error al obtener las tareas de la brigada");
                }
                return res.json();
            })
            .then(
                (respuesta) => {
                    resolve(respuesta);
                },
                (error) => reject(error)
            );
    });
}


export { obtenerBrigadas, obtenerBrigadasDisponibles, obtenerTareasPorBrigada };