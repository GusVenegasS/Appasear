import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import Auth from './services/auth-service';
import { screens } from './config/routes'; 

// Pantallas
import LoginScreen from './screens/LoginScreen';
import Brigadas from './screens/brigadas';
import Usuarios from './screens/usuarios';
import Configuracion from './screens/configuraciones';
import BrigadasStudent from './screens/BrigadasStudent';
import Perfil from './screens/PerfilScreen';
import HomeStudent from './screens/HomeStudent';
import EditarTarea from './screens/editarTarea';
import VerTarea from './screens/VerTarea';
import AnadirEstudiantesScreen from './screens/AnadirEstudiantesScreen';
import NuevoEstudianteScreen from './screens/NuevoEstudianteScreen';
import Colores from './styles/colores.js';
import CustomHeader from './components/header.js'; // El CustomHeader

const App = () => {
  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();
  const [rol, setRole] = useState(''); // Cambia según el rol

  // Filtra las pantallas según el rol
  const screensToShow = screens.filter(screen => screen.rol === rol);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const rol = await Auth.getRol();
        setIsLoggedIn(!!rol);
        setRole(rol || null);
      } catch (error) {
        console.error('Error verificando el rol:', error);
        setIsLoggedIn(false);
        setRole(null);
      }
    };
    checkLoginStatus();
  }, []);


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
          name="Home"
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
