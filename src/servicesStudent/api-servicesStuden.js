// Obtener todas las brigadas de un periodo académico

const API_URL = 'http://172.20.10.8:50002/';

function obtenerBrigadas(periodo) {
    console.log("Obteniendo todas las brigadas para el periodo: " + periodo);
    let url = `${API_URL}/brigadas?periodoAcademico=${periodo}`;
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
  
    let url = `${API_URL}/brigadas/disponibles?periodoAcademico=${periodo}`;
   
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
        let url = `${API_URL}brigadas/seleccionar`;
        console.log("URL de solicitud:", url);
        console.log("Datos enviados:", { usuario_id, brigada_ids, periodoAcademico });

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

        // Leer la respuesta JSON incluso si hay un error
        const data = await response.json();

        if (!response.ok) {
            console.error("Error en la respuesta del servidor:", data);
            throw new Error(data.error || `Error ${response.status}: ${response.statusText}`);
        }

        return data;
    } catch (error) {
        console.error("Error al seleccionar brigadas:", error.message);
        throw error; // Lanzar el error para manejarlo donde se esté utilizando esta función
    }
}
function obtenerTareasPorBrigada(usuarioId, periodoAcademico) {
    console.log("Obteniendo tareas para la brigada del usuario: " + usuarioId + " en el periodo académico: " + periodoAcademico);
    let url = `${API_URL}tareas/brigada?usuario_id=${usuarioId}&periodoAcademico=${periodoAcademico}`;
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
export async function obtenerTareaPorId(tareaId) {
    console.log("Obteniendo tarea con ID:", tareaId);
    let url = `${API_URL}/tareas/completada/${tareaId}`;
    console.log("URL:", url);

    const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: 'no-store'
    };

    try {
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al obtener la tarea:", error);
        throw error;
    }
}

export async function guardarTarea(tareaId, observacion, asistentes, evidencia) {
    try {
        const url = `${API_URL}/tareas/completar`;
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                tarea_id: tareaId,
                observacion,
                asistentes,
                evidencia,
            }),
        };

        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error al guardar la tarea:", error);
        throw error;
    }
}

export async function obtenerEstudiantesPorBrigada(brigadaId, periodoAcademico) {
    try {
        let url = `${API_URL}/brigadas/estudiantes?brigada_id=${brigadaId}&periodoAcademico=${periodoAcademico}`;
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        };

        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error al obtener estudiantes por brigada:", error);
        throw error;
    }
}
export async function obtenerBrigadasAsignadas(usuario_id, periodoAcademico) {
    try {
        const url = `${API_URL}usuarios/${usuario_id}/brigadas?periodoAcademico=${periodoAcademico}`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                cache: 'no-store',
            },
        });

        // Capturar el mensaje de error del backend
        const data = await response.json();

        if (!response.ok) {
            console.error("Error en la respuesta del servidor:", data);
            throw new Error(data.error || `Error ${response.status}: ${response.statusText}`);
        }

        return data;
    } catch (error) {
        console.error("Error al obtener las brigadas asignadas:", error.message);
        throw error;
    }
}



export { obtenerBrigadas, obtenerBrigadasDisponibles, obtenerTareasPorBrigada };