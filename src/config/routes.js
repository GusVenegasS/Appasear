// src/config/routes.js
import Brigadas from '../screens/brigadas';
import Usuarios from '../screens/usuarios';
import Configuracion from '../screens/configuraciones';

export const screens = [
  {
    name: 'Brigadas',
    component: Brigadas,
    options: {
      tabBarIcon: 'home-outline', // Nombre del icono para Home
    },
    rol: 'admin'
  },
  {
    name: 'Usuarios',
    component: Usuarios,
    options: {
      tabBarIcon: 'person-outline', // Nombre del icono para Usuarios
    },
    rol: 'admin'
  },
  {
    name: 'Configuración',
    component: Configuracion,
    options: {
      tabBarIcon: 'settings-outline', // Nombre del icono para Configuracion
    },
    rol: 'admin'
  },
];
