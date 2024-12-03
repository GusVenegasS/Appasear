import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import Auth from './services/auth-service';
import jwtDecode from 'jwt-decode';
// Pantallas
import LoginScreen from './screens/LoginScreen';
import Brigadas from './screens/brigadas';
import Usuarios from './screens/usuarios';
import Configuracion from './screens/configuraciones';
import BrigadasStudent from './screens/BrigadasStudent';
import ConfiguracionStudent from './screens/ConfiguracionStudent';
import Usuario from './screens/usuario';
import Periodo from './screens/periodo';
import Tarea from './screens/detalleTarea';
import Perfil from './screens/PerfilScreen';
import HomeStudent from './screens/HomeStudent';
import EditarTarea from './screens/editarTarea';
import VerTarea from './screens/VerTarea';

// Crear Stack Navigator y Bottom Tab Navigator
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AdminTabs = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Brigadas"
      component={Brigadas}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="home" color={color} size={size} />
        )
      }}
    />
    <Tab.Screen
      name="Usuario"
      component={Usuarios}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="users" color={color} size={size} />
        )
      }}
    />
    <Tab.Screen
      name="Configuración"
      component={Configuracion}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="settings" color={color} size={size} />
        )
      }}
    />
  </Tab.Navigator>
);

const UserTabs = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Tareas"
      component={HomeStudent}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="home" color={color} size={size} />
        )
      }}
    />
    <Tab.Screen
      name="BrigadaStudent"
      component={BrigadasStudent}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="user" color={color} size={size} />
        )
      }}
    />
    <Tab.Screen
      name="ConfiguracionStudent"
      component={Perfil}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="settings" color={color} size={size} />
        )
      }}
    />
  </Tab.Navigator>
);

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const rol = await Auth.getRol(); // Obtén el rol del usuario desde el token
        if (rol) {
          setIsLoggedIn(true);
          setRole(rol);
        } else {
          setIsLoggedIn(false);
          setRole(null);
        }
      } catch (error) {
        console.error('Error verificando el estado de autenticación:', error);
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {!isLoggedIn ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          role === 'admin' ? (
            <>
              <Stack.Screen
                name="AdminTabs" // Cambié el nombre a AdminTabs para que coincida con el llamado en LoginForm
                component={AdminTabs}
                options={{ headerTitle: 'Admin Dashboard' }}
              />
              <Stack.Screen
                name="InformaciónEstudiante"
                component={Usuario}
                options={{ headerTitle: 'Información estudiante' }}
              />
              <Stack.Screen
                name="PeriodoAcademico"
                component={Periodo}
                options={{ headerTitle: 'Período académico' }}
              />
              <Stack.Screen
                name="PerfilAdmin"
                component={Perfil}
                options={{ headerTitle: 'Perfil' }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="UserTabs" // Cambié el nombre a UserTabs para que coincida con el llamado en LoginForm
                component={UserTabs}
                options={{ headerTitle: 'User Dashboard' }}
              />
              <Stack.Screen
                name="EditarTarea"
                component={EditarTarea}
                options={{ headerTitle: 'Editar Tarea' }}
              />
              <Stack.Screen
                name="VerTarea"
                component={VerTarea}
                options={{ headerTitle: 'Ver Tarea' }}
              />
            </>
          )
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
