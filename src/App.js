import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather.js';
import { screens } from './config/routes.js';
import Colores from './styles/colores.js';
import CustomHeader from './components/header.js'; // El CustomHeader
import LoginScreen from './screens/LoginScreen';
import AnadirEstudiantesScreen from './screens/AnadirEstudiantesScreen';
import NuevoEstudianteScreen from './screens/NuevoEstudianteScreen';

const App = () => {
  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();
  const [rol, setRol] = useState("admin"); // Cambia según el rol

  // Filtra las pantallas según el rol
  const screensToShow = screens.filter(screen => screen.rol === rol);

  const TabNavigator = () => (
    <Tab.Navigator
      screenOptions={{
        header: ({ route }) => (
          <CustomHeader title={route.name} />
        ),
        tabBarStyle: {
          backgroundColor: Colores.color2,
        },
        tabBarActiveTintColor: Colores.color1,
        tabBarInactiveTintColor: Colores.color3,
      }}
    >
      {screensToShow.map((screen, index) => (
        <Tab.Screen
          key={index}
          name={screen.name}
          component={screen.component}
          options={{
            tabBarButton: screen.options.tabBarButton,
            tabBarIcon: ({ color, size }) => (
              <Icon name={screen.options.tabBarIcon} size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Iniciar Sesión">
        {/* Pantalla de Login con CustomHeader */}
        <Stack.Screen
          name="Iniciar Sesión"
          component={LoginScreen}
          options={{
            header: () => <CustomHeader title="Iniciar Sesión" />, // CustomHeader en la pantalla de login
          }}
        />
        {/* Pantalla Principal con el TabNavigator */}
        <Stack.Screen
          name="Brigadas"
          component={TabNavigator}
          options={{ headerShown: false }} // Ya no se necesita header aquí porque el TabNavigator tiene su propio header
        />
        <Stack.Screen
          name="AnadirEstudiantesScreen"
          component={AnadirEstudiantesScreen}
          options={{
            header: () => <CustomHeader title="Añadir Estudiantes" />, // CustomHeader en la pantalla de login
          }}
        />
        <Stack.Screen
          name="NuevoEstudianteScreen"
          component={NuevoEstudianteScreen}
          options={{
            header: () => <CustomHeader title="Nuevo Estudiante" />, // CustomHeader en la pantalla de login
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
