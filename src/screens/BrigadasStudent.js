import React, { useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import Colores from '../styles/colores';

const BrigadasStudent = () => {
    const [expandedDay, setExpandedDay] = useState(null);
    const [selectedActivities, setSelectedActivities] = useState({});

    const toggleExpand = (day) => {
        setExpandedDay(expandedDay === day ? null : day);
    };

    const toggleCheckbox = (day, activity) => {
        setSelectedActivities(prevState => ({
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
                                <Text style={styles.option}>Limpieza (11:00 - 13:00)</Text>
                                <TouchableOpacity
                                    onPress={() => toggleCheckbox(day, 'Limpieza')}
                                    style={[
                                        styles.customCheckbox,
                                        selectedActivities[`${day}-Limpieza`] && styles.checkedBox
                                    ]}
                                >
                                    {selectedActivities[`${day}-Limpieza`] && (
                                        <Icon name="checkmark" size={18} color="#fff" />
                                    )}
                                </TouchableOpacity>
                            </View>
                            <View style={styles.optionContainer}>
                                <Text style={styles.option}>Paseo (14:00 - 16:00)</Text>
                                <TouchableOpacity
                                    onPress={() => toggleCheckbox(day, 'Paseo')}
                                    style={[
                                        styles.customCheckbox,
                                        selectedActivities[`${day}-Paseo`] && styles.checkedBox
                                    ]}
                                >
                                    {selectedActivities[`${day}-Paseo`] && (
                                        <Icon name="checkmark" size={18} color="#fff" />
                                    )}
                                </TouchableOpacity>
                            </View>
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
        borderColor: '#008EB6', // Mismo color de borde que en `EditarTarea`
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkedBox: {
        backgroundColor: '#008EB6', // Mismo color de fondo cuando está marcado
    },
});

export default BrigadasStudent;
