import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import { Calendar } from "react-native-calendars";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Colores from "../styles/colores";
import TextStyles from "../styles/texto";
import { obtenerTareasPorBrigada } from "../servicesStudent/api-servicesStuden";
import ErrorModal from "../components/ErrorAlert";
import authService from "../services/auth-service";

const { width } = Dimensions.get("window");

const HomeStudent = () => {
    const navigation = useNavigation();
    const [tareas, setTareas] = useState([]);
    const [filteredTareas, setFilteredTareas] = useState([]);
    const [showCalendar, setShowCalendar] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);



    // Función para obtener tareas desde el servidor
    const fetchTareas = async () => {
        try {

            const userInfo = await authService.getUserDetails();
            if (!userInfo) {
                setError("Token inválido o expirado");
                setModalVisible(true);
                return;
            }
            const { id, periodo} = userInfo;
            console.log("aqui obteniendoooooooo")
            console.log(id)



            const data = await obtenerTareasPorBrigada(id, periodo);
            if (data.error) {
                setError(data.error);
                setModalVisible(true);
            } else {
                setTareas(data || []);
                setFilteredTareas(data || []);
                setError(null);
            }
        } catch (err) {
            console.error("Error al obtener las tareas:", err);
            setError("Error al obtener las tareas, intente de nuevo.");
            setModalVisible(true);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Actualizar datos al hacer "pull-to-refresh"
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchTareas();
    }, []);

    // Actualizar datos cuando la pantalla es enfocada
    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchTareas();
        }, [])
    );

    const formatFecha = (fecha) => {
        const dateObj = new Date(fecha);
        const utcDate = new Date(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate());
        return new Intl.DateTimeFormat("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
        }).format(utcDate);
    };

    const handleDayPress = (day) => {
        const selectedDate = day.dateString;
        const filtered = tareas.filter((tarea) => tarea.fecha.split("T")[0] === selectedDate);
        setFilteredTareas(filtered);
        setShowCalendar(false);
    };

    const handleVerTodo = () => {
        setFilteredTareas(tareas);
    };

    const handleEdit = (tarea) => {
        navigation.navigate("EditarTarea", { tarea }); // Navega a la pantalla de edición
    };

    const handleView = (tarea) => {
        if (tarea && tarea.tarea_id) {
            navigation.navigate("VerTarea", { tarea_id: tarea.tarea_id }); 
        } else {
            console.error("Tarea o tarea_id no están definidos correctamente", tarea);
        }
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const renderTarea = ({ item }) => (
        <View style={[styles.card, { width: width * 0.9 }]}>
            <View style={styles.header}>
                <Text style={[TextStyles.tituloCard]}>{item.brigada_id || "Sin título"}</Text>
            </View>
            <View style={styles.header}>
                <Text style={styles.date}>{formatFecha(item.fecha)}</Text>
            </View>
            <View style={styles.stateIconsContainer}>
                <Text
                    style={[
                        styles.status,
                        TextStyles.estadoCard,
                        {
                            color:
                            item.estado === "completada"
                            ? "green"
                            : item.estado === "por completar"
                            ? "orange"
                            : item.estado === "vencida"
                            ? "red"
                            : "gray",
                        },
                    ]}
                >
                    {item.estado}
                </Text>
                <View style={styles.iconsContainer}>
                    {/* Botón "Ver" */}
                    <TouchableOpacity
                        onPress={() => handleView(item)}
                        disabled={item.estado !== "completada"}
                        style={[styles.iconButton, item.estado !== "completada" && styles.disabledButton]}
                    >
                        <Icon name="eye" size={25} color={item.estado === "completada" ? Colores.colorIcon : "gray"} />
                    </TouchableOpacity>
                    {/* Botón "Editar" */}
                    <TouchableOpacity
                        onPress={() => handleEdit(item)}
                        disabled={item.estado !== "por completar"}
                        style={[styles.iconButton, item.estado !== "por completar" && styles.disabledButton]}
                    >
                        <Icon name="create" size={25} color={item.estado === "por completar" ? Colores.colorIcon : "gray"} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const renderSection = (estado, titulo) => {
        const tareasSeccion = filteredTareas.filter((tarea) => tarea.estado === estado);

        return (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{titulo}</Text>
                {tareasSeccion.length > 0 ? (
                    <FlatList
                        data={tareasSeccion}
                        renderItem={renderTarea}
                        keyExtractor={(item) => item.tarea_id}
                        contentContainerStyle={{ paddingBottom: 10 }}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <Text style={styles.emptyMessage}>No tienes tareas {titulo.toLowerCase()}.</Text>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.filterContainer}>
                <TouchableOpacity style={styles.verTodoButton} onPress={handleVerTodo}>
                    <Icon name="eye" size={25} color={Colores.colorIcon} />
                    <Text style={[styles.filterText, TextStyles.buttonText]}>Ver Todo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.calendarButton} onPress={() => setShowCalendar(!showCalendar)}>
                    <Icon name="calendar" size={25} color={Colores.colorIcon} />
                    <Text style={[styles.filterText, TextStyles.buttonText]}>Filtrar por Fechas</Text>
                </TouchableOpacity>
            </View>

            {showCalendar && (
                <Calendar
                    onDayPress={handleDayPress}
                    theme={{
                        selectedDayBackgroundColor: Colores.primary,
                        todayTextColor: Colores.primary,
                    }}
                />
            )}

            {loading ? (
                <ActivityIndicator size="large" color={Colores.primary} style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={[
                        { estado: "por completar", titulo: "Por Completar" },
                        { estado: "completada", titulo: "Completadas" },
                        { estado: "vencida", titulo: "Vencidas" },
                        { estado: "pendiente", titulo: "Pendientes" },
                    ]}
                    renderItem={({ item }) => renderSection(item.estado, item.titulo)}
                    keyExtractor={(item) => item.estado}
                    contentContainerStyle={styles.listContentContainer}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                />
            )}

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
    container: {
        flex: 1,
        backgroundColor: Colores.background,
        padding: 16,
    },
    filterContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    verTodoButton: {
        flexDirection: "row",
        alignItems: "center",
    },
    calendarButton: {
        flexDirection: "row",
        alignItems: "center",
    },
    filterText: {
        marginLeft: 8,
        marginRight: 8,
    },
    listContentContainer: {
        paddingBottom: 20,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        marginBottom: 10,
        fontFamily: 'Nunito-Bold',
        color: '#6c6462'
    },
    emptyMessage: {
        fontSize: 16,
        color: "gray",
        textAlign: "center",
        marginBottom: 10,
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
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
    },
    date: {
        fontSize: 14,
        color: "gray",
        fontFamily: 'Nunito-SemiBold',
    },
    stateIconsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    iconsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: 80,
    },
    messageContainer: {
        alignItems: "center",
        marginTop: 20,
    },
    error: {
        fontSize: 18,
        textAlign: "center",
        color: "red",
    },
});

export default HomeStudent;
