import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { obtenerTareaPorId } from '../servicesStudent/api-servicesStuden';
import Icon from 'react-native-vector-icons/Ionicons';
import TextStyles from '../styles/texto';
import Colores from '../styles/colores';

const PeriodoAcademico = ({ route }) => {
    const { tarea_id } = route.params;
    console.log("tareaid", tarea_id)
    const [tarea, setTarea] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTarea = async () => {
            try {
                const data = await obtenerTareaPorId(tarea_id);
                setTarea(data);
                setError(null);
            } catch (err) {
                console.error("Error al obtener la tarea:", err);
                setError("Error al obtener los detalles de la tarea.");
            } finally {
                setLoading(false);
            }
        };

        fetchTarea();
    }, [tarea_id]);

    if (loading) {
        return <ActivityIndicator size="large" color={Colores.primary} style={{ marginTop: 20 }} />;
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    const evidenciaUri = tarea.evidencia && !tarea.evidencia.startsWith('data:image/')
        ? `data:image/jpeg;base64,${tarea.evidencia}`
        : tarea.evidencia;

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.form}>
                <Text style={[TextStyles.centeredText, TextStyles.title2]}>{tarea.descripcion}</Text>

                <Text style={styles.label}>Descripción</Text>
                <Text style={styles.textValue}>{tarea.descripcion}</Text>

                <Text style={styles.label}>Estado:</Text>
                <Text style={styles.textValue}>{tarea.estado}</Text>

                <Text style={styles.label}>Observaciones</Text>
                <Text style={styles.textValue}>{tarea.observacion || "Sin observaciones"}</Text>

                <Text style={styles.label}>Asistentes</Text>
                {tarea.asistentes && tarea.asistentes.length > 0 ? (
                    tarea.asistentes.map((asistente, index) => (
                        <View key={index} style={styles.asistenteContainer}>
                            <Icon name="checkmark-circle" size={20} color={Colores.color1} />
                            <Text style={styles.asistenteText}>{asistente.nombre}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.textValue}>No hay asistentes</Text>
                )}

                <Text style={styles.label}>Evidencia</Text>
                {evidenciaUri ? (
                    <Image source={{ uri: evidenciaUri }} style={styles.previewImage} />
                ) : (
                    <Text style={styles.textValue}>No hay evidencia</Text>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#F8F8F8',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backIcon: {
        marginRight: 10,

    },
    title: {

        fontSize: 16,
        color: Colores.primary,
        fontFamily: 'Nunito-Semibold',
    },
    form: {
        backgroundColor: "#ffffff",
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        borderColor: "#008EB6",
        borderWidth: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    label: {
        fontSize: 16,
        fontFamily: 'Nunito-Bold',
        marginBottom: 8,
        color: '#333',

    },
    textValue: {
        fontSize: 16,
        borderRadius: 8,
        marginBottom: 16,
        color: "gray",
        fontFamily: 'Nunito-SemiBold',


    },
    asistenteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,

    },
    asistenteText: {
        fontSize: 16,
        marginLeft: 8,

        color: "gray",
        fontFamily: 'Nunito-SemiBold',
    },
    previewImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        marginBottom: 16,
        borderRadius: 8,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
    },
});

export default PeriodoAcademico;
