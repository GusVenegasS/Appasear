import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, Button, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Calendar } from 'react-native-calendars';
import API from "../services/api-services";

export default function VerificarPeriodo() {
    const [status, setStatus] = useState(null);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [isCalendarVisible, setCalendarVisible] = useState(false);
    const [currentDateField, setCurrentDateField] = useState('');
    const [refresh, setRefresh] = useState(false);
    const [data, setData] = useState(null);
    const periodo = "2024-B";

    // Verificar el periodo al iniciar el componente
    const verificar = async () => {
        try {
            const response = await API.verificarPeriodo(periodo);
            if (response.status === 200) {
                setStatus('valido');
                setData(response.data);
            } else if (response.status === 400) {
                setStatus('activo');
                setData(response.data);
            } else if (response.status === 410) {
                setStatus('finalizado');
                setData(response.data);
            }
        } catch (error) {
            console.error(error);
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
        setCurrentDateField(field);
        setCalendarVisible(prev => !prev || currentDateField !== field);
    };

    const crear = async () => {
        console.log("Clic en crear", { fechaInicio, fechaFin });
        setRefresh(prev => !prev);
    };

    const descargar = async () => {
        console.log("Clic en descargar");
        setRefresh(prev => !prev);
    };

    const finalizar = async () => {
        console.log("Clic en finalizar");
        setRefresh(prev => !prev);
    };

    const renderCalendars = (dateField) => (
        isCalendarVisible && currentDateField === dateField && (
            <View style={styles.calendarContainer}>
                <Calendar
                    onDayPress={handleDateSelect}
                    markedDates={{ [dateField === 'fechaInicio' ? fechaInicio : fechaFin]: { selected: true, selectedColor: 'blue' } }}
                    theme={{ selectedDayBackgroundColor: '#007BFF', selectedDayTextColor: '#ffffff', todayTextColor: '#007BFF' }}
                />
            </View>
        )
    );

    const renderInputField = (label, value, field) => (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>{label}:</Text>
            <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    placeholder="AAAA-MM-DD"
                    value={value}
                    editable={false}
                />
                <TouchableOpacity onPress={() => toggleCalendar(field)}>
                    <Icon name="calendar" size={20} />
                </TouchableOpacity>
            </View>
            {renderCalendars(field)}
        </View>
    );

    const renderButton = (title, onPress) => (
        <View style={styles.buttonContainer}>
            <Button title={title} onPress={onPress} color="#007BFF" />
        </View>
    );

    const renderCard = (extraContent) => (
        <View style={styles.container}>
            <View style={styles.card}>
                {renderInputField("Fecha Inicio", data?.fechaInicio || fechaInicio, 'fechaInicio')}
                {renderInputField("Fecha Fin", data?.fechaFin || fechaFin, 'fechaFin')}
                {extraContent}
            </View>
        </View>
    );

    return (
        <ScrollView>
            {status === 'valido' && data && (
                <TouchableWithoutFeedback onPress={handleOutsidePress}>
                    {renderCard(renderButton("Crear", crear))}
                </TouchableWithoutFeedback>
            )}
            {status === 'activo' && data && renderCard(renderButton("Finalizar", finalizar))}
            {status === 'finalizado' && data && renderCard(
                <>
                    {renderInputField("Fecha Finalización", data.fechaFinalización, 'fechaFinalización')}
                    <Text style={styles.label}>Este período ya fue finalizado, puedes descargar el reporte</Text>
                    {renderButton("Descargar reporte", descargar)}
                </>
            )}
            {status === 'error' && (
                <View>
                    <Text>Algo salió mal</Text>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: 16,
    },
    card: {
        padding: 16,
        marginVertical: 8,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#008EB6',
        borderRadius: 8,
    },
    inputContainer: {
        marginBottom: 20,
        position: 'relative',
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
        top: 50,
        left: 0,
        right: 0,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});
