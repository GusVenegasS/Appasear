// src/config/routes.js
import Brigadas from '../screens/brigadas';
import Usuarios from '../screens/usuarios';
import Configuracion from '../screens/configuraciones';
import Usuario from '../screens/usuario'
export const screens = [
  {
    name: 'Brigadas',
    component: Brigadas,
    options: {
      tabBarIcon: 'home', // Nombre del icono para Home
    },
    rol: 'admin'
  },
  {
    name: 'Usuarios',
    component: Usuarios,
    options: {
      tabBarIcon: 'users', // Nombre del icono para Usuarios
    },
    rol: 'admin'
  },
  {
    name: 'Configuración',
    component: Configuracion,
    options: {
      tabBarIcon: 'settings',
    },
    rol: 'admin'
  },
  {
    name: 'Información estudiante',
    component: Usuario,
    options: {
      tabBarButton: () => null, tabBarIcon: 'info'
    },
    rol: 'admin'
  }
];
