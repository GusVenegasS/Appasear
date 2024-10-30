import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const InfoEstudiante = ({ route }) => {
    const { user } = route.params;

    return (
        <View style={styles.container}>
            <Text>Nombre: {user.name}</Text>
            <Text>ID: {user.id}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
});

export default InfoEstudiante;
