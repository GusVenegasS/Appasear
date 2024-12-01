import React from 'react';
import TextStyles from '../styles/texto';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

const PeriodoAcademico = ({ route }) => {
    const { tarea } = route.params; // Recibimos la tarea desde la navegación

    if (!tarea || tarea.length === 0) {
        return <Text>No hay tarea disponible para mostrar</Text>; // Manejo de error si no hay tarea
    }

    const tareaDetails = tarea[0]; // Asumiendo que tarea es un array y tomamos el primer elemento

    const { descripcion, estado, asistentes, evidencia_id, fechaRea, periodoAcademico } = tareaDetails;

    // Formatear la fecha (si existe) a una cadena legible
    const fechaRealizacion = fechaRea ? new Date(fechaRea).toLocaleDateString() : 'No disponible';

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                {/* Título de la tarjeta con la descripción de la tarea */}
                <Text style={[TextStyles.centeredText, TextStyles.title2]}>{descripcion}</Text>

                {/* Información adicional */}
                <View style={styles.detailsContainer}>
                    <Text style={TextStyles.title3}>Estado:</Text>
                    <Text style={[TextStyles.cuerpo, TextStyles.marginBottom]}>{estado}</Text>

                    <Text style={TextStyles.title3}>Fecha de realización:</Text>
                    <Text style={[TextStyles.cuerpo, TextStyles.marginBottom]}>{fechaRealizacion}</Text>

                    {/* Mostrar los asistentes, si los hay */}
                    <Text style={TextStyles.title3}>Asistentes:</Text>
                    {asistentes && asistentes.length > 0 ? (
                        <View style={styles.assistantsList}>
                            {asistentes.map((asistente, index) => (
                                <Text key={index} style={[TextStyles.cuerpo, TextStyles.marginBottom]}>{asistente}</Text>
                            ))}
                        </View>
                    ) : (
                        <Text style={[TextStyles.cuerpo, TextStyles.marginBottom]}>No hay asistentes</Text>
                    )}

                    {/* Mostrar la foto de la evidencia si existe */}
                    <Text style={TextStyles.title3}>Evidencia:</Text>
                    {evidencia_id ? (
                        <View style={styles.evidenceContainer}>
                            <Image source={{ uri: evidencia_id }} style={styles.evidenceImage} />
                        </View>
                    ) : (
                        <Text style={[TextStyles.cuerpo, TextStyles.marginBottom]}>No hay evidencia disponible</Text>
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderColor: '#008EB6',
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
    },
    detailsContainer: {
        marginTop: 8,
    },
    detailTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 8,
    },
    detailText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 8,
    },
    assistantsList: {
        marginLeft: 16,
    },
    evidenceContainer: {
        marginTop: 16,
    },
    evidenceImage: {
        width: 200,
        height: 200,
        borderRadius: 8,
        marginTop: 8,
    },
});

export default PeriodoAcademico;
