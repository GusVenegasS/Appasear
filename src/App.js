// src/App.js
import React, { useState } from 'react'; // Asegúrate de importar useState
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather.js';
import { screens } from './config/routes.js';
import Colores from './styles/colores.js'; 
import CustomHeader from './components/header.js';// Importa el nuevo componente

// Crear Tab Navigator
const App = () => {
  const Tab = createBottomTabNavigator();
  const [rol, setRol] = useState("admin"); // Puedes cambiar el rol aquí para probar

  // Define las pantallas para cada rol
  const adminScreens = screens.filter(screen => screen.rol === 'admin');
  const userScreens = screens.filter(screen => screen.rol === 'user');

  // Selecciona las pantallas en base al rol
  const screensToShow = rol === 'admin' ? adminScreens : userScreens;

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          header: ({ navigation, route }) => (
            <CustomHeader title={route.name} />
          ),
          tabBarStyle: {
            backgroundColor: Colores.color2, // Cambia el color de fondo de la barra de pestañas
          },
          tabBarActiveTintColor: Colores.color1, // Color de texto activo del tab
          tabBarInactiveTintColor: Colores.color3,
        }}
      >
        {screensToShow.map((screen, index) => (
          <Tab.Screen
            key={index}
            name={screen.name}
            component={screen.component}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name={screen.options.tabBarIcon} size={size} color={color} />
              ),
            }}
          />
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
