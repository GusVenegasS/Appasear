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
    let url = `http://192.168.1.64:50000//verTarea?periodoAcademico=${periodo}&fechaQuery=${fecha}&brigada_id=${brigadaID}`;
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
    obtenerBrigadas,
    obtenerUsuarios,
    verTarea
}