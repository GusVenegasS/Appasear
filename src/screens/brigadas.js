import React, { useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/Feather';

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
                                    <Icon name="calendar" size={24} color="#000" />
                                </TouchableOpacity>
                            </View>
                            {showCalendar[`${day}-Limpieza`] && (
                                <Calendar
                                    style={styles.calendar}
                                    onDayPress={(day) => console.log('Limpieza - Día seleccionado:', day)}
                                />
                            )}
                            <View style={styles.optionContainer}>
                                <Text style={styles.option}>Paseo</Text>
                                <TouchableOpacity onPress={() => toggleCalendar(day, 'Paseo')}>
                                    <Icon name="calendar" size={24} color="#000" />
                                </TouchableOpacity>
                            </View>
                            {showCalendar[`${day}-Paseo`] && (
                                <Calendar
                                    style={styles.calendar}
                                    onDayPress={(day) => console.log('Paseo - Día seleccionado:', day)}
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
