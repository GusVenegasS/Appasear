import React, { useState , useEffect, useCallback  } from "react";
import { Text, View, TouchableOpacity, StyleSheet, ScrollView,  ActivityIndicator, RefreshControl} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import Colores from '../styles/colores';
import { obtenerBrigadasDisponibles, seleccionarBrigadas } from '../servicesStudent/api-servicesStuden'

const BrigadasStudent = () => {
   
    const [expandedDay, setExpandedDay] = useState(null);
    const [selectedActivities, setSelectedActivities] = useState({});
    const [brigadas, setBrigadas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const periodoAcademico = "2024-B";
    const usuario_id="201911115"

    // Función para obtener brigadas disponibles
    const fetchBrigadas = async () => {
        setLoading(true);
        try {
            const respuesta = await obtenerBrigadasDisponibles(periodoAcademico);
            if (!respuesta || respuesta.length === 0) {
                setError("No hay brigadas disponibles para el periodo seleccionado.");
                setBrigadas([]);
            } else {
                setBrigadas(respuesta);
                setError('');
            }
        } catch (err) {
            console.error("Error al obtener las brigadas disponibles:", err);
            setError("Error al obtener las brigadas disponibles.");
            setBrigadas([]);
        } finally {
            setLoading(false);
        }
    };

    // Función para refrescar los datos (pull-to-refresh)
    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await fetchBrigadas();
        } finally {
            setRefreshing(false);
        }
    };

    // Efecto para cargar brigadas cuando la pantalla tiene el foco
    useFocusEffect(
        useCallback(() => {
            fetchBrigadas();
        }, [periodoAcademico])
    );

    // Expandir o contraer una brigada al hacer clic
    const toggleExpand = (day) => {
        setExpandedDay(expandedDay === day ? null : day);
    };

    // Marcar/desmarcar una actividad
    const toggleCheckbox = (brigadaId) => {
        setSelectedActivities(prevState => ({
            ...prevState,
            [brigadaId]: !prevState[brigadaId]
        }));
    };

    // Función para guardar la selección de brigadas
    const guardarSeleccion = async () => {
        const brigadaIdsSeleccionadas = Object.keys(selectedActivities).filter(key => selectedActivities[key]);

        // Verificar si se han seleccionado exactamente dos brigadas
        if (brigadaIdsSeleccionadas.length !== 2) {
            setError('Debe seleccionar exactamente dos brigadas.');
            return;
        }

        try {
            const response = await seleccionarBrigadas(usuario_id, brigadaIdsSeleccionadas, periodoAcademico);
            if (response.error) {
                setError(response.error);
            } else {
                console.log("Brigadas seleccionadas correctamente.");
                setError('');
                // Opcional: recargar las brigadas para ver los cambios
                fetchBrigadas();
            }
        } catch (err) {
            console.error("Error al seleccionar brigadas:", err);
            setError("Error al seleccionar brigadas.");
        }
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#008EB6" />
                <Text style={styles.loadingText}>Cargando brigadas...</Text>
            </View>
        );
    }

    return (
        <View style={styles.mainContainer}>
            <ScrollView
                style={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#008EB6']}
                        tintColor="#008EB6"
                    />
                }
            >
                {error ? (
                    <View style={styles.messageContainer}>
                        <Text style={styles.error}>{error}</Text>
                    </View>
                ) : (
                    brigadas.map((brigada) => (
                        <View key={brigada.brigada_id} style={styles.card}>
                            <TouchableOpacity onPress={() => toggleExpand(brigada.diaSemana)}>
                                <Text style={styles.cardTitle}>Brigada {brigada.diaSemana}</Text>
                            </TouchableOpacity>
                            {expandedDay === brigada.diaSemana && (
                                <View style={styles.expandedContent}>
                                    <View style={styles.optionContainer}>
                                        <Text style={styles.option}>{brigada.actividad} (Horario estimado)</Text>
                                        <TouchableOpacity
                                            onPress={() => toggleCheckbox(brigada.brigada_id)}
                                            style={[
                                                styles.customCheckbox,
                                                selectedActivities[brigada.brigada_id] && styles.checkedBox
                                            ]}
                                        >
                                            {selectedActivities[brigada.brigada_id] && (
                                                <Icon name="checkmark" size={18} color="#fff" />
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </View>
                    ))
                )}
            </ScrollView>
            <View style={styles.fixedButtonContainer}>
                <TouchableOpacity style={styles.saveButton} onPress={guardarSeleccion}>
                    <Text style={styles.saveButtonText}>Guardar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        flex: 1,
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#008EB6',
    },
    messageContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    error: {
        fontSize: 18,
        textAlign: 'center',
        color: 'red',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        borderColor: '#008EB6',
        borderWidth: 2,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    expandedContent: {
        marginTop: 16,
    },
    optionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 4,
    },
    option: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
    },
    customCheckbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#008EB6',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkedBox: {
        backgroundColor: '#008EB6',
    },
    fixedButtonContainer: {
        padding: 16,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderColor: '#dddddd',
    },
    saveButton: {
        backgroundColor: '#008EB6',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default BrigadasStudent;