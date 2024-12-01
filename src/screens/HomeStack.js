import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeStudent from './HomeStudent';
import EditarTarea from './editarTarea';
import { TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colores from '../styles/colores';
import VerTarea from './VerTarea';
const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="HomeStudent" screenOptions={{ headerShown: false }}>
      <Stack.Screen 
      name="HomeStudent" 
      component={HomeStudent}
        />

      <Stack.Screen 
      name="EditarTarea" 
      component={EditarTarea} 
      

      />
      <Stack.Screen 
        name="VerTarea" 
        component={VerTarea} 
       
      />

    </Stack.Navigator>
  );
};

export default HomeStack;
