import React, { useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Calendar, LocaleConfig } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/Feather';

LocaleConfig.locales['es'] = {
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

const Brigadas = () => {
    const [expandedDay, setExpandedDay] = useState(null);
    const [showCalendar, setShowCalendar] = useState({});

    const toggleExpand = (day) => {
        setExpandedDay(expandedDay === day ? null : day);
    };

    const toggleCalendar = (day, activity) => {
        setShowCalendar(prevState => ({
            ...prevState,
            [`${day}-${activity}`]: !prevState[`${day}-${activity}`]
        }));
    };

    const getDisabledDays = (day) => {
        const disabledDays = {};
        const weekDays = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        const targetDayIndex = weekDays.indexOf(day);

        // Deshabilitar todos los días excepto el día de la brigada
        let date = new Date();
        date.setUTCHours(date.getUTCHours() - 5)
        for (let i = 0; i < 365; i++) { // Ajusta 365 según tus necesidades
            const dateString = date.toISOString().split('T')[0];
            if (date.getDay() !== targetDayIndex) {
                disabledDays[dateString] = { disabled: true };
            }
            date.setDate(date.getDate() + 1);
        }

        return disabledDays;
    };

    return (
        <ScrollView style={styles.container}>
            {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"].map((day) => (
                <View key={day} style={styles.card}>
                    <TouchableOpacity onPress={() => toggleExpand(day)}>
                        <Text style={styles.cardTitle}>Brigada {day}</Text>
                    </TouchableOpacity>
                    {expandedDay === day && (
                        <View style={styles.expandedContent}>
                            <View style={styles.optionContainer}>
                                <Text style={styles.option}>Limpieza</Text>
                                <TouchableOpacity onPress={() => toggleCalendar(day, 'Limpieza')}>
                                    <Icon name="calendar" size={24} color="#008EB6" />
                                </TouchableOpacity>
                            </View>
                            {showCalendar[`${day}-Limpieza`] && (
                                <Calendar
                                    style={styles.calendar}
                                    onDayPress={(selectedDay) => console.log('Limpieza - Día seleccionado:', selectedDay)}
                                    markedDates={getDisabledDays(day)}
                                />
                            )}
                            <View style={styles.optionContainer}>
                                <Text style={styles.option}>Paseo</Text>
                                <TouchableOpacity onPress={() => toggleCalendar(day, 'Paseo')}>
                                    <Icon name="calendar" size={24} color="#008EB6" />
                                </TouchableOpacity>
                            </View>
                            {showCalendar[`${day}-Paseo`] && (
                                <Calendar
                                    style={styles.calendar}
                                    onDayPress={(selectedDay) => console.log('Paseo - Día seleccionado:', selectedDay)}
                                    markedDates={getDisabledDays(day)}
                                />
                            )}
                        </View>
                    )}
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
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
    },
    calendar: {
        marginBottom: 16,
    },
});

export default Brigadas;
