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
import Usuario from './screens/usuario';
import Tarea from './screens/detalleTarea';
import Configuracion from './screens/configuraciones';
import PerfilScreen from './screens/PerfilScreen';
import BrigadasStudent from './screens/BrigadasStudent';
import Perfil from './screens/PerfilScreen';
import HomeStudent from './screens/HomeStudent';
import EditarTarea from './screens/editarTarea';
import VerTarea from './screens/VerTarea';
import AnadirEstudiantesScreen from './screens/AnadirEstudiantesScreen';
import Periodo from './screens/periodo';
import NuevoEstudianteScreen from './screens/NuevoEstudianteScreen';
import Colores from './styles/colores.js';
import TextStyles from './styles/texto.js';
import CustomHeader from './components/header.js'; // El CustomHeader
import ConfiguracionStudent from './screens/ConfiguracionStudent.js';
import CambiarContrasenaScreen from './screens/CambiarContrasenaScreen.js';
import ContrasenaScreen from './screens/ContrasenaScreen.js';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const App = () => {
  const [rol, setRole] = useState(''); // Cambia según el rol

  const handleLogin = (userRole) => {
    console.log("esto llega al rol")
    console.log(userRole.user.rol)
    setRole(userRole.user.rol); // Guarda la información del usuario (incluido el rol)
  };

  const handleLogout = async () => {
    // Elimina el rol del estado
    setRole('');

    // Elimina cualquier dato persistente, por ejemplo, el token de usuario
    await AsyncStorage.removeItem('authToken'); // O el nombre de la clave que estés utilizando

    // Redirige a la pantalla de login
    console.log("Sesión cerrada");
  };

  if (!rol) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            options={{
              title: "Iniciar Sesión",
              headerStyle: { backgroundColor: Colores.color1 },
              headerTitleAlign: 'center',
              headerTitleStyle: TextStyles.title1
            }}
          >
            {props => <LoginScreen {...props} onLogin={handleLogin} />}
          </Stack.Screen>
          <Stack.Screen
          name="ContrasenaScreen"
          component={ContrasenaScreen}
          options={{
            title: 'Reestablecer contraseña',
            headerStyle: { backgroundColor: Colores.color1 },
            headerTitleAlign: 'center',
            headerTitleStyle: TextStyles.title1,
            headerLeft: null,
          }}
        />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  const AdminTabs = ({ navigation }) => {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: Colores.color2,
          },
          tabBarActiveTintColor: Colores.color1,
          tabBarInactiveTintColor: Colores.color3,
        }}
      >
        <Tab.Screen
          name="Brigadas"
          component={Brigadas}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name={"home"} size={size} color={color} />
            ),
            // Personalizar la cabecera
            headerStyle: {
              backgroundColor: Colores.color1,  // Fondo naranja
            },
            headerTitleStyle: TextStyles.title1,
            headerTitleAlign: 'center',  // Centrar el título
          }}
        />
        <Tab.Screen
          name="Usuarios"
          component={Usuarios}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name={"person"} size={size} color={color} />
            ),
            headerStyle: {
              backgroundColor: Colores.color1,  // Fondo naranja
            },
            headerTitleStyle: TextStyles.title1,
            headerTitleAlign: 'center',  // Centrar el título
          }}
        />
        <Tab.Screen
          name="Configuraciones"
          children={() => <Configuracion navigation={navigation} onLogout={handleLogout} />}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name={"settings"} size={size} color={color} />
            ),
            headerStyle: {
              backgroundColor: Colores.color1,  // Fondo naranja
            },
            headerTitleStyle: TextStyles.title1,
            headerTitleAlign: 'center',  // Centrar el título
          }}
        />
      </Tab.Navigator>
    )
  }

  const UserTabs = ({ navigation }) => {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: Colores.color2,
          },
          tabBarActiveTintColor: Colores.color1,
          tabBarInactiveTintColor: Colores.color3,
        }}
      >
        <Tab.Screen
          name="Tareas"
          component={HomeStudent}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name={"home"} size={size} color={color} />
            ),
            headerStyle: {
              backgroundColor: Colores.color1,  // Fondo naranja
            },
            headerTitleStyle: TextStyles.title1,
            headerTitleAlign: 'center',  // Centrar el título
          }}
        />
        <Tab.Screen
          name="Brigadas"
          component={BrigadasStudent}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name={"people-outline"} size={size} color={color} />
            ),
            headerStyle: {
              backgroundColor: Colores.color1,  // Fondo naranja
            },
            headerTitleStyle: TextStyles.title1,
            headerTitleAlign: 'center',  // Centrar el título
          }}
        />
        <Tab.Screen
          name="Configuración"
          children={() => <ConfiguracionStudent navigation={navigation} onLogout={handleLogout} />}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name={"settings"} size={size} color={color} />
            ),
            headerStyle: {
              backgroundColor: Colores.color1,  // Fondo naranja
            },
            headerTitleStyle: TextStyles.title1,
            headerTitleAlign: 'center',  // Centrar el título
          }}
        />
      </Tab.Navigator>
    )
  }

  return (
    <NavigationContainer>
      {console.log("rol que voy a verficiar")}
      {console.log(rol)}
      <Stack.Navigator>
        {rol === 'admin' ? (
          <Stack.Screen name="Admin" component={AdminTabs} options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="Student" component={UserTabs} options={{ headerShown: false }} />
        )}
        <Stack.Screen
          name="InfoEstudiante"
          component={Usuario}
          options={{
            title: 'Información estudiante',
            headerStyle: { backgroundColor: Colores.color1 },
            headerTitleAlign: 'center',
            headerTitleStyle: TextStyles.title1,
            headerLeft: null,
          }}
        />
        <Stack.Screen
          name="Detalle tarea"
          component={Tarea}
          options={{
            headerStyle: { backgroundColor: Colores.color1 },
            headerTitleAlign: 'center',
            headerTitleStyle: TextStyles.title1,
            headerLeft: null,
          }}
        />
        <Stack.Screen
          name="AnadirEstudiantesScreen"
          component={AnadirEstudiantesScreen}
          options={{
            title: 'Añadir Estudiante',
            headerStyle: { backgroundColor: Colores.color1 },
            headerTitleAlign: 'center',
            headerTitleStyle: TextStyles.title1,
            headerLeft: null,
          }}
        />
        <Stack.Screen
          name="NuevoEstudianteScreen"
          component={NuevoEstudianteScreen}
          options={{
            title: 'Añadir Estudiante',
            headerStyle: { backgroundColor: Colores.color1 },
            headerTitleAlign: 'center',
            headerTitleStyle: TextStyles.title1,
            headerLeft: null,
          }}
        />
        <Stack.Screen
          name="Período académico"
          component={Periodo}
          options={{
            headerStyle: { backgroundColor: Colores.color1 },
            headerTitleAlign: 'center',
            headerTitleStyle: TextStyles.title1,
            headerLeft: null,
          }}
        />
        <Stack.Screen
          name="Perfil"
          component={Perfil}
          options={{
            headerStyle: { backgroundColor: Colores.color1 },
            headerTitleAlign: 'center',
            headerTitleStyle: TextStyles.title1,
            headerLeft: null,
          }}
        />
        <Stack.Screen
          name="VerTarea"
          component={VerTarea}
          options={{
            headerStyle: { backgroundColor: Colores.color1 },
            headerTitleAlign: 'center',
            headerTitleStyle: TextStyles.title1,
            headerLeft: null,
          }}
        />
        <Stack.Screen
          name="EditarTarea"
          component={EditarTarea}
          options={{
            headerStyle: { backgroundColor: Colores.color1 },
            headerTitleAlign: 'center',
            headerTitleStyle: TextStyles.title1,
            headerLeft: null,
          }}
        />
        <Stack.Screen
          name="PerfilStudent"
          component={Usuario}
          options={{
            title: 'Información estudiante',
            headerStyle: { backgroundColor: Colores.color1 },
            headerTitleAlign: 'center',
            headerTitleStyle: TextStyles.title1,
            headerLeft: null,
          }}
        />
        <Stack.Screen
          name="CambiarContrasenaScreen"
          component={CambiarContrasenaScreen}
          options={{
            title: 'Nueva Contraseña',
            headerStyle: { backgroundColor: Colores.color1 },
            headerTitleAlign: 'center',
            headerTitleStyle: TextStyles.title1,
            headerLeft: null,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
