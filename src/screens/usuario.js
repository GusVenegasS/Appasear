import React from 'react';
import TextStyles from '../styles/texto';
import { View, Text, StyleSheet, Image } from 'react-native';

const InfoEstudiante = ({ route }) => {
    const { user } = route.params;
    console.log(user.telefono);

    return (
        <View style={styles.container}>
            {/* Imagen del usuario */}
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: user.imagenPerfil }} // Usamos la cadena base64 directamente aquí
                    style={styles.userImage}
                />
            </View>

            {/* Tarjeta con la información del usuario */}
            <View style={styles.card}>
                <Text style={[TextStyles, styles.cardText]}>Nombre: {user.nombre}</Text>
                <Text style={[TextStyles, styles.cardText]}>Celular: {user.telefono}</Text>
                <Text style={[TextStyles, styles.cardText]}>Correo: {user.correo}</Text>
                <Text style={[TextStyles, styles.cardText]}>Periodo Académico: {user.periodoAcademico}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
        alignItems: 'center', // Para centrar la imagen y la tarjeta
    },
    imageContainer: {
        width: 120,
        height: 120,
        borderRadius: 60, // Haciendo la imagen circular
        overflow: 'hidden',
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#008EB6', // Borde azul
    },
    userImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover', // Asegura que la imagen cubra el área circular
    },
    card: {
        width: '100%',
        padding: 20,
        borderWidth: 2,
        borderColor: '#008EB6', // Borde azul
        borderRadius: 10,
        backgroundColor: '#fff', // Fondo blanco para la tarjeta
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    cardText: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333', // Color del texto
    },
});

export default InfoEstudiante;
