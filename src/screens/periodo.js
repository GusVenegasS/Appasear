import React, { useEffect, useState } from 'react';
import {
    View, Text, ScrollView, RefreshControl, TextInput, Button, StyleSheet, TouchableOpacity,
    TouchableWithoutFeedback, Keyboard, Modal, Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Calendar } from 'react-native-calendars';
import TextStyles from '../styles/texto';
import AUTH from "../services/auth-service";
import API from "../services/api-services";
import LottieView from 'lottie-react-native';

export default function VerificarPeriodo() {
    const [status, setStatus] = useState(null);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [isCalendarVisible, setCalendarVisible] = useState(false);
    const [currentDateField, setCurrentDateField] = useState('');
    const [refresh, setRefresh] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [data, setData] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalAnimation, setModalAnimation] = useState(null);
    const [isError, setIsError] = useState(false);

    // Verificar el periodo al iniciar el componente
    const verificar = async () => {
        try {
            const { periodo } = await AUTH.getUserDetails();
            const response = await API.verificarPeriodo(periodo);
            console.log(response)
            if (response.status === 200) {
                setStatus('valido');  // Estado 200: periodo válido
                setData(response.data);
            } else if (response.status === 400) {
                setStatus('activo');  // Estado 400: estado activo
                setData(response.data);
            } else if (response.status === 410) {
                setStatus('finalizado');  // Estado 410: estado finalizado
                setData(response.data);
            }
        } catch (error) {
            console.error(error);
            setMensaje("Upss! Algo salió mal")
            setStatus('error');
        }
    };

    useEffect(() => {
        verificar();
    }, [refresh]);

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

    const toggleCalendar = (field) => {
        if (currentDateField === field && isCalendarVisible) {
            setCalendarVisible(false);
        } else {
            setCurrentDateField(field);
            setCalendarVisible(true);
        }
    };

    const crear = async (fechaInicio, fechaFin) => {
        try {
            const respuestaCrear = await API.crearPeriodo(fechaInicio, fechaFin, periodo);
            setMensaje(respuestaCrear.message);

            if (respuestaCrear.status === 200) {
                setModalAnimation(require('../assets/animaciones/check.json'));
                setIsError(false);
                setModalVisible(true);
                setTimeout(() => {
                    setRefresh(!refresh);
                    setModalVisible(false);
                }, 3000); // Duración de la animación en milisegundos
            } else {
                setModalAnimation(require('../assets/animaciones/errorPerro.json'))
                setIsError(true);
                setModalVisible(true);
            }
        } catch (error) {
            console.log(error);
            setMensaje('Error al crear el periodo');
            setModalAnimation(require('../assets/animaciones/error_500.json'));
            setIsError(true);
            setModalVisible(true);
        }
    };

    const finalizar = async () => {
        try {
            const respuestaFinalizar = await API.finalizarPeriodo(periodo);
            setMensaje(respuestaFinalizar.message);
            if (respuestaFinalizar.status === 200) {
                setModalAnimation(require('../assets/animaciones/check.json'));
                setIsError(false);
                setModalVisible(true);
                setTimeout(() => {
                    setRefresh(!refresh);
                    setModalVisible(false);
                }, 3000); // Duración de la animación en milisegundos
            } else {
                setModalAnimation(require('../assets/animaciones/errorPerro.json'))
                setIsError(true);
                setModalVisible(true);
            }
        } catch (error) {
            console.error(error);
            setMensaje('Error al finalizar el periodo');
            setModalAnimation(require('../assets/animaciones/error_500.json'));
            setIsError(true);
            setModalVisible(true);
        }
    };

    const descargar = async () => {
        try {
            const path = await API.descargarReporte(periodo);
            console.log(path)// Usar la función que descargará el archivo
            Alert.alert('Descarga completa', `El archivo se ha descargado en: ${path}`);
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'No se pudo descargar el archivo.');
        }
    };

    // Componente de campo de fecha reutilizable
    const FechaInput = ({ label, value, editable, onPress, calendarVisible }) => {
        return (
            <View style={styles.inputContainer}>
                <Text style={[styles.label, TextStyles.tituloCard]}>{label}</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={[styles.input, TextStyles.cuerpo]}
                        value={value}
                        editable={editable}
                    />
                    {editable && (
                        <TouchableOpacity onPress={onPress}>
                            <Icon name="calendar" size={20} />
                        </TouchableOpacity>
                    )}
                </View>
                {calendarVisible && (
                    <View style={styles.calendarContainer}>
                        <Calendar
                            onDayPress={handleDateSelect}
                            markedDates={{
                                [value]: { selected: true, selectedColor: 'blue' },
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
        );
    };

    return (
        <ScrollView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <LottieView
                            source={modalAnimation}
                            autoPlay
                            loop={!isError}
                            style={styles.lottie}
                        />
                        <Text style={[TextStyles.cuerpo, styles.modalText]}>{mensaje}</Text>
                        {isError && (
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Icon name="x" size={30} color="black" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Modal>
            {status === 'valido' && data != null && (
                <TouchableWithoutFeedback onPress={handleOutsidePress}>
                    <View style={styles.container}>
                        <View style={styles.card}>
                            {/* Renderizar los campos de fecha solo cuando no están en estado 'activo' o 'finalizado' */}
                            <FechaInput
                                label="Fecha Inicio:"
                                value={fechaInicio}
                                editable={true}
                                onPress={() => toggleCalendar('fechaInicio')}
                                calendarVisible={isCalendarVisible && currentDateField === 'fechaInicio'}
                            />
                            <FechaInput
                                label="Fecha Fin:"
                                value={fechaFin}
                                editable={true}
                                onPress={() => toggleCalendar('fechaFin')}
                                calendarVisible={isCalendarVisible && currentDateField === 'fechaFin'}
                            />
                            <View style={styles.buttonContainer}>
                                <Button
                                    title="Crear"
                                    onPress={() => crear(fechaInicio, fechaFin)}
                                    color="#007BFF"
                                />
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            )}
            {status === 'activo' && data != null && (
                <View style={styles.container}>
                    <View style={styles.card}>
                        <FechaInput
                            label="Fecha Inicio:"
                            value={data.fechaInicio}
                            editable={false}
                            onPress={() => { }}
                            calendarVisible={false}
                        />
                        <FechaInput
                            label="Fecha Fin:"
                            value={data.fechaFin}
                            editable={false}
                            onPress={() => { }}
                            calendarVisible={false}
                        />
                        <View style={styles.buttonContainer}>
                            <Button
                                title="Finalizar"
                                styles={TextStyles.buttonText}
                                onPress={finalizar}
                                color="#007BFF"
                            />
                        </View>
                    </View>
                </View>
            )}
            {status === 'finalizado' && data != null && (
                <View style={styles.container}>
                    <View style={styles.card}>
                        <FechaInput
                            label="Fecha Inicio:"
                            value={data.fechaInicio}
                            editable={false}
                            onPress={() => { }}
                            calendarVisible={false}
                        />
                        <FechaInput
                            label="Fecha Fin:"
                            value={data.fechaFin}
                            editable={false}
                            onPress={() => { }}
                            calendarVisible={false}
                        />
                        <FechaInput
                            label="Fecha Finalización:"
                            value={data.fechaFinalización}
                            editable={false}
                            onPress={() => { }}
                            calendarVisible={false}
                        />
                        <Text style={[styles.label, TextStyles.cuerpo]}>Este período ya fue finalizado, puedes descargar el reporte</Text>
                        <View style={styles.buttonContainer}>
                            <Button
                                title="Descargar reporte"
                                onPress={descargar}
                                color="#007BFF"
                            />
                        </View>
                    </View>
                </View>
            )}
            {status === 'error' && (
                <View style={styles.centeredView}>
                    <LottieView
                        source={require('../assets/animaciones/serverError.json')}
                        autoPlay
                        loop
                        style={styles.lottie}
                    />
                    <Text style={[styles.modalText, TextStyles.cuerpo]}>{mensaje}</Text>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginRight: 10,
    },
    calendarContainer: {
        marginTop: 10,
        position: 'absolute',
        zIndex: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    buttonContainer: {
        marginTop: 20,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
    },
    lottie: {
        width: 150,
        height: 150,
    },
    button: {
        padding: 10,
        marginTop: 20,
        backgroundColor: '#007BFF',
        borderRadius: 5,
    },
    buttonClose: {
        backgroundColor: '#FF3B30',
    },
    textStyle: {
        color: 'white',
        textAlign: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 5,
    },
});
