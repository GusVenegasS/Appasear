// Obtener todas las brigadas de un periodo académico

import authService from "../services/auth-service";
import {getToken} from "../services/auth-service"

const API_URL = 'https://appbackstudent.ashysea-2c880eb9.australiaeast.azurecontainerapps.io';



async function obtenerBrigadas(periodo) {
    console.log("Obteniendo todas las brigadas para el periodo: " + periodo);

    try {
        // Obtener el token con getToken
        const token = await getToken();
        if (!token) {
            throw new Error("Token no disponible en el almacenamiento.");
        }

        console.log("Token obtenido:", token);

        // Definir la URL
        const url = `${API_URL}/brigadas?periodoAcademico=${periodo}`;
        console.log("URL de la solicitud:", url);

        // Configurar las opciones de la solicitud
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token, // Añadir el token al encabezado
            },
        };

        // Realizar la solicitud
        const response = await fetch(url, requestOptions);

        // Verificar si la respuesta es válida
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error en la respuesta del servidor:", errorData);
            throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
        }

        // Parsear la respuesta
        const respuesta = await response.json();
        console.log("Brigadas obtenidas:", respuesta);
        return respuesta; // Devolver los datos

    } catch (error) {
        console.error("Error al obtener las brigadas:", error.message);
        throw error; // Propagar el error para que sea manejado por el llamador
    }
}

// Obtener brigadas con cupos disponibles para un periodo académico
async function obtenerBrigadasDisponibles(periodo) {
    console.log("Obteniendo todas las brigadas para el periodo: " + periodo);

    try {
        // Obtener el token
        const token = await authService.getToken(); // Asegúrate de que authService.getToken es asíncrono
        if (!token) {
            throw new Error("Token no disponible.");
        }
        console.log("Token obtenido:", token);

        // Definir la URL
        const url = `${API_URL}/brigadas/disponibles?periodoAcademico=${periodo}`;
        console.log("URL de la solicitud:", url);

        // Configurar las opciones de la solicitud
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, // Añadir el token en la cabecera
            },
        };

        // Realizar la solicitud
        const response = await fetch(url, requestOptions);

        // Verificar si la respuesta es válida
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error en la respuesta del servidor:", errorData);
            throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
        }

        // Parsear la respuesta
        const respuesta = await response.json();
        console.log("Brigadas disponibles obtenidas:", respuesta);
        return respuesta; // Devolver los datos
    } catch (error) {
        console.error("Error al obtener las brigadas disponibles:", error.message);
        throw error; // Propagar el error para que sea manejado por el llamador
    }
}

// Servicio para seleccionar brigadas
export async function seleccionarBrigadas(usuario_id, brigada_ids, periodoAcademico) {
    try {
        const token = await authService.getToken();
        let url = `${API_URL}/brigadas/seleccionar`;
        console.log("URL de solicitud:", url);
        console.log("Datos enviados:", { usuario_id, brigada_ids, periodoAcademico });

        const requestOptions = {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
                
             },

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
async function obtenerTareasPorBrigada(usuarioId, periodoAcademico) {
    console.log("Obteniendo tareas para la brigada del usuario: " + usuarioId + " en el periodo académico: " + periodoAcademico);

    try {
        // Construir la URL
        const url = `${API_URL}/tareas/brigada?usuario_id=${usuarioId}&periodoAcademico=${periodoAcademico}`;
        console.log("URL:", url);

        // Obtener el token utilizando authService.getToken()
        const token = await authService.getToken(); // Asegúrate de que `getToken` sea una función asíncrona si no lo es
        if (!token) {
            throw new Error("Token no disponible.");
        }
        console.log("Token obtenido:", token);

        // Configurar las opciones de la solicitud
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        };

        // Realizar la solicitud
        const response = await fetch(url, requestOptions);

        // Verificar si la respuesta es válida
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error en la respuesta del servidor:", errorData);
            throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
        }

        // Parsear la respuesta
        const respuesta = await response.json();
        console.log("Tareas obtenidas:", respuesta);
        return respuesta; // Devolver los datos
    } catch (error) {
        console.error("Error al obtener las tareas de la brigada:", error.message);
        throw error; // Propagar el error para que sea manejado por el llamador
    }
}
export async function obtenerTareaPorId(tareaId) {
    console.log("Obteniendo tarea con ID:", tareaId);
    const token = await authService.getToken()
    let url = `${API_URL}/tareas/completada/${tareaId}`;
    console.log("URL:", url);

    const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" ,
            "Authorization": `Bearer ${token}`
        },
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
        const token = await authService.getToken()
        const url = `${API_URL}/tareas/completar`;
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
             },
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
        const token = await authService.getToken()
        let url = `${API_URL}/brigadas/estudiantes?brigada_id=${brigadaId}&periodoAcademico=${periodoAcademico}`;
        const requestOptions = {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
             },
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
        console.log("aqui viendo birgadas del usurio " + periodoAcademico)
        console.log(url)

        const token = await authService.getToken();

    
        const url = `${API_URL}/usuarios/${usuario_id}/brigadas/${periodoAcademico}`;
        console.log(url)
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
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