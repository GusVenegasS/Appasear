import React, { useState, useCallback } from "react";
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import LottieView from 'lottie-react-native';
import { useFocusEffect } from '@react-navigation/native';
import TextStyles from '../styles/texto';
import Icon from 'react-native-vector-icons/Feather';
import { Calendar, LocaleConfig } from 'react-native-calendars'; // Importamos el componente Calendar
import API from "../services/api-services";
import { Alert } from 'react-native';

// Configuración de locale para español (es)
LocaleConfig.locales['es'] = {
    monthNames: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    monthNamesShort: [
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ],
    dayNames: [
        'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
    ],
    dayNamesShort: [
        'Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'
    ],
    today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

const Brigadas = ({ navigation }) => {
    const [brigadas, setBrigadas] = useState([]);
    const [apiMessage, setApiMessage] = useState('');
    const [animationSource, setAnimationSource] = useState(require('../assets/animaciones/error.json'));
    const [loading, setLoading] = useState(false);
    const [expandedDays, setExpandedDays] = useState({}); // Guardamos el estado expandido por día
    const [selectedBrigada, setSelectedBrigada] = useState(null); // Guardamos la brigada seleccionada para mostrar el calendario
    const periodo = "2024-B";

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                setLoading(true); // Empieza la carga
                try {
                    const respuesta = await API.obtenerBrigadas(periodo);
                    if (respuesta.status === 404) {
                        setApiMessage(respuesta.message); // No hay brigadas
                        setAnimationSource(require('../assets/animaciones/error.json'));
                    } else if (respuesta.status === 500) {
                        setApiMessage(respuesta.message); // Error en el servidor
                        setAnimationSource(require('../assets/animaciones/error_500.json'));
                    } else {
                        setBrigadas(respuesta);
                        setApiMessage('');
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                    setApiMessage('Upss! Algo salió mal'); // Error al obtener datos
                    setAnimationSource(require('../assets/animaciones/serverError.json'));
                } finally {
                    setLoading(false); // Termina la carga
                }
            };

            fetchData();
        }, [])
    );

    const toggleExpand = (day) => {
        // Alterna el estado expandido para el día seleccionado
        setExpandedDays(prevState => ({
            ...prevState,
            [day]: !prevState[day]
        }));
    };

    const filterBrigadasByDay = (day) => {
        // Filtra las brigadas por el día de la semana
        return brigadas.filter((brigada) => brigada.diaSemana === day);
    };

    const daysOfWeek = ["lunes", "martes", "miércoles", "jueves", "viernes"];

    const handleCalendarToggle = (brigada) => {
        if (selectedBrigada === brigada) {
            setSelectedBrigada(null); // Si ya estaba seleccionado, lo cerramos
        } else {
            setSelectedBrigada(brigada); // Si no, lo seleccionamos
        }
    };

    const handleDaySelect = async ({ day, brigadaId, periodo }) => {
        console.log("Datos enviados:", { day, brigadaId, periodo });
        try {
            const response = await API.verTarea(day.dateString, brigadaId, periodo);
            console.log(response)
            if (response.status === 404) {
                Alert.alert(
                    "No existe tarea",
                    "No hay tarea para la fecha seleccionada.",
                    [{ text: "Cerrar", onPress: () => console.log("Alerta cerrada") }]
                );
            } else {
                navigation.navigate('Detalle tarea', { tarea: response });
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            Alert.alert(
                "Error",
                "Ocurrió un error al obtener la tarea. Por favor, inténtalo nuevamente.",
                [{ text: "Cerrar", onPress: () => console.log("Alerta cerrada") }]
            );
        }
    };


    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.animationContainer}>
                    <LottieView
                        source={require('../assets/animaciones/cargando.json')}
                        autoPlay
                        loop
                        style={styles.animation}
                    />
                </View>
            ) : apiMessage ? (
                <View style={styles.centeredView}>
                    <LottieView
                        source={animationSource}
                        autoPlay
                        loop
                        style={styles.animation}
                    />
                    <Text style={[TextStyles.title3, TextStyles.centeredText]}>{apiMessage}</Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {daysOfWeek.map((day) => (
                        <View key={day} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Text style={TextStyles.title3}>
                                    {`Brigadas ${day.charAt(0).toUpperCase() + day.slice(1)}`}
                                </Text>
                                <TouchableOpacity onPress={() => toggleExpand(day)}>
                                    <Icon
                                        name={expandedDays[day] ? "chevron-up" : "chevron-down"}
                                        size={24}
                                        color="#008EB6"
                                    />
                                </TouchableOpacity>
                            </View>

                            {expandedDays[day] && (
                                <View style={styles.expandedCard}>
                                    {filterBrigadasByDay(day).map((brigada) => (
                                        <View key={brigada._id} style={styles.brigadaItemContainer}>
                                            <View style={styles.brigadaInfo}>
                                                <Text style={styles.brigadaItem}>
                                                    {brigada.nombre}
                                                </Text>
                                                <TouchableOpacity onPress={() => handleCalendarToggle(brigada)}>
                                                    <Icon name="calendar" size={24} color="#008EB6" />
                                                </TouchableOpacity>
                                            </View>

                                            {selectedBrigada === brigada && (
                                                <View style={styles.calendarContainer}>
                                                    <Calendar
                                                        onDayPress={(day) => {
                                                            handleDaySelect({
                                                                day,  // Día seleccionado
                                                                brigadaId: brigada.brigada_id,  // ID de la brigada
                                                                periodo: brigada.periodoAcademico  // Periodo de la brigada
                                                            });
                                                        }}
                                                    />
                                                </View>
                                            )}
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    ))}
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        padding: 16,
    },
    animationContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    animation: {
        width: 200,
        height: 200,
    },
    scrollContainer: {
        paddingBottom: 20,
    },
    card: {
        flexDirection: 'column', // Cambié a columna para que el contenido expandido quede debajo
        padding: 16,
        marginVertical: 8,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#008EB6',
        borderRadius: 8,
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
        flexDirection: 'column', // Aseguramos que el calendario quede debajo del nombre de la brigada
        marginBottom: 8,
    },
    brigadaInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    brigadaItem: {
        fontSize: 16,
        color: '#333',
        marginRight: 10,
    },
    calendarContainer: {
        marginTop: 10,
        backgroundColor: '#f1f1f1',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    }
});

export default Brigadas;
