import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import TextStyles from "../styles/texto";
import { red } from 'react-native-reanimated/lib/typescript/Colors';

const ErrorModal = ({ visible, message, onClose }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={[styles.errorTitle]}>¡Ups!</Text>
                    <Text style={styles.errorMessage}>{message}</Text>
                    <TouchableOpacity style={styles.okButton} onPress={onClose}>
                        <Text style={TextStyles.boton}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente para oscurecer el fondo
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    errorTitle: {
        fontSize: 20,
        color: '#ff0000', // Cambia el color según tus necesidades
        fontFamily: 'Nunito-SemiBold',
        marginBottom: 10,
    },
    errorMessage: {
       
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
       fontFamily: 'Nunito-Regular',
    },
    okButton: {
        backgroundColor: '#008EB6',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    okButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ErrorModal;
