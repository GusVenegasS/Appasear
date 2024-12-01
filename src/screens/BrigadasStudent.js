import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
    Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import Colores from "../styles/colores";
import { obtenerBrigadasDisponibles, seleccionarBrigadas, obtenerBrigadasAsignadas } from "../servicesStudent/api-servicesStuden";
import ErrorModal from "../components/ErrorAlert";
import SuccessModal from "../components/SuccesModal";
import TextStyles from "../styles/texto";

const { width } = Dimensions.get("window"); // Obtener el ancho de la pantalla

const BrigadasStudent = () => {
    const [expandedDay, setExpandedDay] = useState(null);
    const [selectedActivities, setSelectedActivities] = useState({});
    const [brigadas, setBrigadas] = useState([]);
    const [brigadasAsignadas, setBrigadasAsignadas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const periodoAcademico = "2024-B";
    const usuario_id = "201911115";

    // Función para mostrar el modal de error
    const showErrorModal = (message) => {
        setError(message);
        setModalVisible(true);
    };

    // Función para cerrar el modal
    const closeModal = () => {
        setModalVisible(false);
        setError(null);
    };

    // Función para mostrar el modal de éxito
    const showSuccessModal = (message) => {
        setSuccessMessage(message);
        setSuccessModalVisible(true);
    };

    // Función para cerrar el modal de éxito
    const closeSuccessModal = () => {
        setSuccessModalVisible(false);
        setSuccessMessage('');
    };

    // Función para obtener brigadas asignadas y disponibles
    const fetchBrigadas = async () => {
        setLoading(true);
        try {
            // Obtener las brigadas asignadas al usuario
            const asignadas = await obtenerBrigadasAsignadas(usuario_id);
            if (asignadas && asignadas.length > 0) {
                setBrigadasAsignadas(asignadas);
                setBrigadas([]); // Asegurarse de que las brigadas disponibles estén vacías si ya hay asignadas
            } else {
                // Si no hay brigadas asignadas, buscar las brigadas disponibles
                const disponibles = await obtenerBrigadasDisponibles(periodoAcademico);
                if (disponibles && disponibles.length > 0) {
                    setBrigadas(disponibles);
                } else {
                    setBrigadas([]);
                    setBrigadasAsignadas([]); // Asegurarse de que las brigadas asignadas estén vacías
                }
            }
        } catch (err) {
            console.error("Error al obtener las brigadas:", err);
            showErrorModal("Error al obtener las brigadas.");
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

    // Función para guardar la selección de brigadas
    const guardarSeleccion = async () => {
        const brigadaIdsSeleccionadas = Object.keys(selectedActivities).filter(key => selectedActivities[key]);

        // Verificar si se han seleccionado exactamente dos brigadas
        if (brigadaIdsSeleccionadas.length !== 2) {
            showErrorModal('Debe seleccionar exactamente dos brigadas.');
            return;
        }

        try {
            const response = await seleccionarBrigadas(usuario_id, brigadaIdsSeleccionadas, periodoAcademico);
            if (response && response.error) {
                showErrorModal(response.error);
            } else {
                showSuccessModal('Brigadas seleccionadas exitosamente.');
                setSelectedActivities({}); // Reiniciar la selección de brigadas
                fetchBrigadas(); // Recargar las brigadas para ver los cambios
            }
        } catch (err) {
            console.error("Error al seleccionar brigadas:", err);
            showErrorModal(err.message);
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

    // Renderizado si el usuario ya tiene brigadas asignadas
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#008EB6" />
                <Text style={styles.loadingText}>Cargando brigadas...</Text>
            </View>
        );
    }

    if (brigadasAsignadas.length > 0) {
        return (
            <ScrollView
                style={styles.assignedContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#008EB6']}
                        tintColor="#008EB6"
                    />
                }
            >
                <Text style={styles.assignedTitle}>Usted pertenece a las siguientes brigadas:</Text>
                {brigadasAsignadas.map((brigada, index) => (
                    <View key={index} style={[styles.card, { width: width * 0.9 }]}>
                        <Text style={[TextStyles.tituloCard]}>Nombre: {brigada.nombre}</Text>
                        <Text style={styles.assignedText}>Actividad: {brigada.actividad}</Text>
                        <Text style={styles.assignedText}>Día: {brigada.diaSemana}</Text>
                    </View>
                ))}
            </ScrollView>
        );
    }

    if (brigadas.length === 0) {
        return (
            <View style={styles.noBrigadasContainer}>
                <Text style={styles.noBrigadasText}>No hay brigadas disponibles para asignar.</Text>
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
                {brigadas.map((brigada, index) => (
                    <View key={index} style={[styles.card, { width: width * 0.9 }]}>
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
                ))}
            </ScrollView>
            <View style={styles.fixedButtonContainer}>
                <TouchableOpacity style={styles.saveButton} onPress={guardarSeleccion}>
                    <Text style={styles.saveButtonText}>Guardar</Text>
                </TouchableOpacity>
            </View>

            {/* Modal de Éxito */}
            <SuccessModal
                visible={successModalVisible}
                message={successMessage}
                onClose={closeSuccessModal}
            />

            {/* Modal de Error */}
            <ErrorModal
                visible={modalVisible}
                message={error}
                onClose={closeModal}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    assignedContainer: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    noBrigadasContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    assignedTitle: {
        fontSize: 20,
        marginBottom: 10,
        fontFamily: 'Nunito-Bold',
    },
    noBrigadasText: {
        fontSize: 18,
        color: "gray",
        textAlign: "center",
        marginTop: 20,
        fontFamily: 'Nunito-SemiBold',
    },
    card: {
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
        alignSelf: 'center',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "#008EB6",
        marginBottom: 8,
    },
    assignedText: {
        fontSize: 16,
        color: "#333",
        marginBottom: 4,
        fontFamily: 'Nunito-SemiBold',
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
    expandedContent: {
        marginTop: 16,
    },
    optionContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 8,
        marginBottom: 4,
    },
    customCheckbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: "#008EB6",
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
    },
    checkedBox: {
        backgroundColor: "#008EB6",
    },
    fixedButtonContainer: {
        padding: 16,
        backgroundColor: "#ffffff",
        borderTopWidth: 1,
        borderColor: "#dddddd",
    },
    saveButton: {
        backgroundColor: "#008EB6",
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    saveButtonText: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 16,
    },
});

export default BrigadasStudent;
