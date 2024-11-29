import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

const SuccessModal = ({ visible, message, onClose }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.successTitle}>¡Éxito!</Text>
                    <Text style={styles.successMessage}>{message}</Text>
                    <TouchableOpacity style={styles.okButton} onPress={onClose}>
                        <Text style={styles.okButtonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
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
    successTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4CAF50', // Verde para indicar éxito
        marginBottom: 10,
    },
    successMessage: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
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

export default SuccessModal;
