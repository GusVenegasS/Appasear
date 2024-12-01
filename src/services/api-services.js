function crearPeriodo(fechaInicio, fechaFin, periodo) {
    let b = {
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        periodoAcademico: periodo
    }
    let url = `http://172.16.0.208:50000/crearPeriodo`;
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
    let url = `http://172.16.0.208:50000/obtenerBrigadas?periodoAcademico=${periodo}`;
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
    let url = `http://172.16.0.208:50000/usuarios?periodoAcademico=${periodo}`;
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
    let url = `http://172.16.0.208:50000/verTarea?periodoAcademico=${periodo}&fechaQuery=${fecha}&brigada_id=${brigadaID}`;
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