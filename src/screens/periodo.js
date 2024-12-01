import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Calendar } from 'react-native-calendars';
import API from "../services/api-services";
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';

const PeriodoAcademico = () => {
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [isCalendarVisible, setCalendarVisible] = useState(false);
    const [currentDateField, setCurrentDateField] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [animation, setAnimation] = useState('loading'); // 'loading', 'success', 'error'
    const [apiResponse, setApiResponse] = useState(null);
    const [periodoCreado, setPeriodoCreado] = useState(false); // Nuevo estado para controlar el estado del periodo
    const periodo = '2023-B';

    const toggleCalendar = (field) => {
        if (currentDateField === field && isCalendarVisible) {
            setCalendarVisible(false);
        } else {
            setCurrentDateField(field);
            setCalendarVisible(true);
        }
    };

    const handleDateSelect = (date) => {
        const formattedDate = date.dateString;
        if (currentDateField === 'fechaInicio') {
            setFechaInicio(formattedDate);
        } else if (currentDateField === 'fechaFin') {
            setFechaFin(formattedDate);
        }
        setCalendarVisible(false);
    };

    const handleOutsidePress = () => {
        setCalendarVisible(false);
        Keyboard.dismiss();
    };

    const crear = async (fechaInicio, fechaFin) => {
        console.log("clic en crear");
        setModalVisible(true);
        setAnimation('loading');

        try {
            const respuesta = await API.crearPeriodo(fechaInicio, fechaFin, periodo);
            console.log(respuesta);
            if (respuesta.status === 400 || respuesta.status === 401 || respuesta.status === 402 || respuesta.status === 500) {
                setApiResponse(respuesta.message);
                setAnimation('error-cat');
            } else {
                setApiResponse(respuesta.message);
                setAnimation('success');
                setPeriodoCreado(true); // Marca el periodo como creado si la respuesta es exitosa
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setApiResponse("Upss! Algo salió mal");
            setAnimation('server-error');
        }
    };

    const finalizar = async () => {
        console.log("Finalizar")
    };

    const handleModalClose = () => {
        setModalVisible(false);
    };

    return (
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
            <View style={styles.container}>
                <View style={styles.card}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Fecha Inicio:</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="AAAA-MM-DD"
                                value={fechaInicio}
                                onChangeText={setFechaInicio}
                                editable={false}
                            />
                            <TouchableOpacity onPress={() => toggleCalendar('fechaInicio')} disabled={periodoCreado}>
                                <Icon name="calendar" size={20} color={periodoCreado ? "#ccc" : "#333"} />
                            </TouchableOpacity>
                        </View>
                        {isCalendarVisible && currentDateField === 'fechaInicio' && (
                            <View style={styles.calendarContainer}>
                                <Calendar
                                    onDayPress={handleDateSelect}
                                    markedDates={{
                                        [fechaInicio]: { selected: true, selectedColor: 'blue' },
                                    }}
                                    theme={{
                                        selectedDayBackgroundColor: '#007BFF',
                                        selectedDayTextColor: '#ffffff',
                                        todayTextColor: '#007BFF',
                                    }}
                                />
                            </View>
                        )}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Fecha Fin:</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="AAAA-MM-DD"
                                value={fechaFin}
                                onChangeText={setFechaFin}
                                editable={false}
                            />
                            <TouchableOpacity onPress={() => toggleCalendar('fechaFin')} disabled={periodoCreado}>
                                <Icon name="calendar" size={20} color={periodoCreado ? "#ccc" : "#333"} />
                            </TouchableOpacity>
                        </View>
                        {isCalendarVisible && currentDateField === 'fechaFin' && (
                            <View style={styles.calendarContainer}>
                                <Calendar
                                    onDayPress={handleDateSelect}
                                    markedDates={{
                                        [fechaFin]: { selected: true, selectedColor: 'blue' },
                                    }}
                                    theme={{
                                        selectedDayBackgroundColor: '#007BFF',
                                        selectedDayTextColor: '#ffffff',
                                        todayTextColor: '#007BFF',
                                    }}
                                />
                            </View>
                        )}
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button
                            title={periodoCreado ? "Finalizar Período" : "Crear"}
                            onPress={periodoCreado ? finalizar : () => crear(fechaInicio, fechaFin)}
                            color="#007BFF"
                            disabled={false}
                        />
                    </View>
                </View>

                <Modal isVisible={isModalVisible} onBackdropPress={handleModalClose}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity onPress={handleModalClose} style={styles.closeButton}>
                            <Icon name="x" size={24} color="#000" />
                        </TouchableOpacity>
                        {animation === 'loading' && (
                            <LottieView
                                source={require('../assets/animaciones/cargando.json')}
                                autoPlay
                                loop
                                style={styles.animation}
                            />
                        )}
                        {animation === 'success' && (
                            <LottieView
                                source={require('../assets/animaciones/check.json')}
                                autoPlay
                                loop={false}
                                style={styles.animation}
                            />
                        )}
                        {animation === 'server-error' && (
                            <LottieView
                                source={require('../assets/animaciones/serverError.json')}
                                autoPlay
                                loop={false}
                                style={styles.animation}
                            />
                        )}
                        {animation === 'error-cat' && (
                            <LottieView
                                source={require('../assets/animaciones/error_500.json')}
                                autoPlay
                                loop={false}
                                style={styles.animation}
                            />
                        )}
                        <Text>{apiResponse ? `${apiResponse}` : 'Cargando...'}</Text>
                    </View>
                </Modal>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        padding: 16,
    },
    card: {
        flexDirection: 'column',
        padding: 16,
        marginVertical: 8,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#008EB6',
        borderRadius: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#008EB6',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        marginBottom: 5,
        fontSize: 16,
        color: '#333',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    input: {
        flex: 1,
        height: 40,
        color: '#000',
    },
    buttonContainer: {
        marginTop: 10,
        borderRadius: 5,
        overflow: 'hidden',
    },
    calendarContainer: {
        marginTop: 10,
        backgroundColor: 'white',
        zIndex: 100,
        position: 'absolute',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    animation: {
        width: 100,
        height: 100,
    },
});

export default PeriodoAcademico;
