import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Modal,
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
import authService from "../services/auth-service";
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get("window"); // Obtener el ancho de la pantalla

const BrigadasStudent = () => {
    const [expandedDays, setExpandedDays] = useState({});
    const [selectedActivities, setSelectedActivities] = useState({});
    const [brigadas, setBrigadas] = useState([]);
    const [brigadasAsignadas, setBrigadasAsignadas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [modalAnimation, setModalAnimation] = useState(null); 

    const daysOfWeek = ["lunes", "martes", "miércoles", "jueves", "viernes"];

    // Función para mostrar el modal de error
    const showErrorModal = (message) => {
        setError(message);
        setModalAnimation(require('../assets/animaciones/errorPerro.json'));
        setModalVisible(true);
    };

    // Función para cerrar el modal de error
    const closeModal = () => {
        setModalVisible(false);
        setError(null);
        setSelectedActivities({}); // Deseleccionar todas las actividades al cerrar el modal
    };

    // Función para mostrar el modal de éxito
    const showSuccessModal = (message) => {
        setSuccessMessage(message);
    setModalAnimation(require('../assets/animaciones/check.json')); // Animación para éxito
    setSuccessModalVisible(true);
    };

    // Función para cerrar el modal de éxito
    const closeSuccessModal = () => {
        setSuccessModalVisible(false);
        setSuccessMessage('');
        fetchBrigadas(); // Recargar las brigadas después de cerrar el modal de éxito
    };

    // Función para obtener brigadas asignadas y disponibles
    // Función para obtener brigadas asignadas y disponibles
const fetchBrigadas = async () => {
    setLoading(true);
    try {
        const userDetails = await authService.getUserDetails();
        if (!userDetails) {
            throw new Error("No se pudo obtener la información del usuario. El token es inválido o ha expirado.");
        }
        const { id, periodo } = userDetails;
        console.log(periodo)
        const asignadas = await obtenerBrigadasAsignadas(id, periodo);
        if (asignadas && asignadas.length > 0) {
            setBrigadasAsignadas(asignadas);
            setBrigadas([]); // Asegurarse de que las brigadas disponibles estén vacías si ya hay asignadas
        } else {
            const disponibles = await obtenerBrigadasDisponibles(periodo);
            if (disponibles && disponibles.length > 0) {
                setBrigadas(disponibles);
            } else {
                setBrigadas([]);
                setBrigadasAsignadas([]); // Asegurarse de que las brigadas asignadas estén vacías
                
            }
        }
    } catch (err) {
        // Mostrar el mensaje de error que proviene del backend
        if (err.message) {
            showErrorModal(err.message);
        } else {
            showErrorModal("Ocurrió un error inesperado. Inténtelo nuevamente.");
        }
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
            setSelectedActivities({}); // Deseleccionar todas las actividades al refrescar
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
            const userDetails = await authService.getUserDetails();
            if (!userDetails) {
                throw new Error("No se pudo obtener la información del usuario. El token es inválido o ha expirado.");
            }
            const { id, periodo } = userDetails;

            const response = await seleccionarBrigadas(id, brigadaIdsSeleccionadas, periodo);
            if (response && response.error) {
                showErrorModal(response.error);
            } else {
                showSuccessModal('Brigadas seleccionadas exitosamente.');
                setSelectedActivities({}); // Reiniciar la selección de brigadas
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
        }, [])
    );

    // Expandir o contraer las brigadas para un día específico
    const toggleExpand = (day) => {
        setExpandedDays(prevState => ({
            ...prevState,
            [day]: !prevState[day]
        }));
    };

    // Marcar/desmarcar una actividad
    const toggleCheckbox = (brigadaId) => {
        setSelectedActivities(prevState => ({
            ...prevState,
            [brigadaId]: !prevState[brigadaId]
        }));
    };

    // Filtrar brigadas por el día de la semana
    const filterBrigadasByDay = (day) => {
        return brigadas.filter((brigada) => brigada.diaSemana === day);
    };

    // Renderizado si el usuario ya tiene brigadas asignadas
    if (loading) {
        return (
            <ActivityIndicator size="large" color={Colores.primary} style={{ marginTop: 30}} />
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
                    <View key={index} style={[styles.card]}>
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
                <Text style={styles.noBrigadasText}>No existen brigadas disponibles para el periodo académico proporcionado.</Text>
            </View>
        );
    }

    // Renderizado de brigadas disponibles organizadas por días de la semana
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
             {daysOfWeek.map((day) => {
    // Filtramos las brigadas por día
    const brigadasPorDia = filterBrigadasByDay(day);

    // Si no hay brigadas disponibles para este día, no renderizamos nada
    if (brigadasPorDia.length === 0) {
        return null;
    }

    return (
        <View key={day} style={styles.card}>
            <TouchableOpacity
                style={styles.cardHeader}
                onPress={() => toggleExpand(day)}
            >
                <Text style={TextStyles.title3}>
                    {`Brigadas ${day.charAt(0).toUpperCase() + day.slice(1)}`}
                </Text>
                <Icon
                    name={expandedDays[day] ? "chevron-up" : "chevron-down"}
                    size={24}
                    color="#008EB6"
                />
            </TouchableOpacity>

            {expandedDays[day] && (
                <View style={styles.expandedCard}>
                    {brigadasPorDia.map((brigada) => (
                        <View key={brigada.brigada_id} style={styles.brigadaItemContainer}>
                            <View style={styles.brigadaInfo}>
                                <Text style={styles.brigadaItem}>
                                    {brigada.nombre}
                                </Text>
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
                    ))}
                </View>
            )}
        </View>
    );
})}
            </ScrollView>
            <View style={styles.fixedButtonContainer}>
                <TouchableOpacity style={styles.saveButton} onPress={guardarSeleccion}>
                    <Text style={TextStyles.boton}>Guardar</Text>
                </TouchableOpacity>
            </View>

            {/* Modal de Éxito */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={successModalVisible}
                onRequestClose={closeSuccessModal}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <LottieView
                            source={modalAnimation}
                            autoPlay
                            loop={false}
                            style={styles.lottie}
                        />
                        <Text style={[TextStyles.cuerpo, styles.modalText]}>{successMessage}</Text>
                        <TouchableOpacity onPress={closeSuccessModal} style={styles.closeButton}>
                            <Icon name="close" size={30} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal de Error */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <LottieView
                            source={modalAnimation}
                            autoPlay
                            loop={false}
                            style={styles.lottie}
                        />
                        <Text style={[TextStyles.cuerpo, styles.modalText]}>{error}</Text>
                        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                            <Icon name="close" size={30} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        maxWidth: 300, // Limitar el tamaño del modal
        paddingBottom: 20,
    },
    lottie: {
        width: 150,
        height: 150,
        marginBottom: 20, // Aseguramos que haya espacio entre la animación y el texto
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 16,
    },
    closeButton: {
        marginTop: 10,
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
      color: 'gray' 
    },
    noBrigadasText: {
        fontSize: 18,
        color: "gray",
        textAlign: "center",
        marginTop: 20,
        fontFamily: 'Nunito-SemiBold',
    },
    card: {
        flexDirection: 'column',
        padding: 16,
        marginVertical: 8,
        backgroundColor: '#ffffff',
        borderWidth: 2,
        borderColor: '#008EB6',
        borderRadius: 8,
        marginBottom: 16,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    expandedCard: {
        marginTop: 10,
        backgroundColor: '#f1f1f1',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    brigadaItemContainer: {
        flexDirection: 'column',
        marginVertical: 4,
    },
    brigadaInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    brigadaItem: {
        fontSize: 16,
        color: '#333',
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
        borderTopWidth: 1,
        borderColor: "#dddddd",
    },
    saveButton: {
        backgroundColor: "#008EB6",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: "center",
    },
    saveButtonText: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 16,
    },
    assignedText:{
        fontSize: 16,
        color: "gray",
        fontFamily: 'Nunito-SemiBold',

    },
});

export default BrigadasStudent;
