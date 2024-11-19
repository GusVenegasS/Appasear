// src/components/AvatarUser.js
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const AvatarUser = () => {
  return (
    <View style={styles.avatarContainer}>
      <Image
        style={styles.avatar}
        source={require('../assets/images/avatar_placeholder.png')} // Ruta del avatar
      />
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: '#d3d3d3',
  },
});

export default AvatarUser;
