import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const UserScreen = ({ navigation }) => {
  const users = [
    { id: '1', name: 'Gustavo Venegas' },
    { id: '2', name: 'Carolina Bravo' },
    { id: '3', name: 'Daniel Vargas' },
    { id: '4', name: 'Samantha Vilaña' },
    { id: '5', name: 'Juan Pablo del Hierro' },
    { id: '6', name: 'Steeven Panchi' },
    { id: '7', name: 'Ronnie Gonzalez' },
    // Agrega más usuarios según sea necesario
  ];

  const navigateToDetails = (user) => {
    navigation.navigate('Información estudiante', { user });
  };

  return (
    <View style={styles.container}>
      {users.map((user) => (
        <View key={user.id} style={styles.card}>
          <Text style={styles.userName}>{user.name}</Text>
          <TouchableOpacity onPress={() => navigateToDetails(user)}>
            <Icon name="eye" size={24} color="#008EB6" />
          </TouchableOpacity>
        </View>
      ))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
  },
});

export default UserScreen;
