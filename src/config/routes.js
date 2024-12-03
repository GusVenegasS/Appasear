// src/config/routes.js
import Brigadas from '../screens/brigadas';
import Usuarios from '../screens/usuarios';
import Configuracion from '../screens/configuraciones';
import LoginScreen from '../screens/LoginScreen';
<<<<<<< Updated upstream
=======
import HomeStudent from '../screens/HomeStudent';
import BrigadasStudent from '../screens/BrigadasStudent';
import ConfiguracionStudent from '../screens/ConfiguracionStudent';
import HomeStack from '../screens/HomeStack';
import Usuario from '../screens/usuario';
import Periodo from '../screens/periodo';
import Tarea from '../screens/detalleTarea';
import Perfil from '../screens/PerfilScreen';
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
=======
  {
    name: 'Información estudiante',
    component: Usuario,
    options: {
      tabBarButton: () => null, tabBarIcon: 'info'
    },
    rol: 'admin'
  },
  {
    name: 'Período académico',
    component: Periodo,
    options: {
      tabBarButton: () => null, tabBarIcon: 'info'
    },
    rol: 'admin'
  },
  {
    name: 'Perfil',
    component: Perfil,
    rol: 'admin'
  },
/*
  {
    name: 'Home',
    component: HomeStudent,
    options: {
      tabBarIcon: 'home-outline', // Nombre del icono home student
    },
    rol: 'user'
  }*/
 {
  name: 'Tareas',
  component: HomeStack,
  options: {
    tabBarIcon: 'home-outline',
  },
  rol: 'user'
 },
  {
    name: 'Brigadas',
    component: BrigadasStudent,
    options: {
      tabBarIcon: 'person-outline', // Nombre del icono home student
    },
    rol: 'user'
  },
  {
    name: 'Configuración',
    component: ConfiguracionStudent,
    options: {
      tabBarIcon: 'settings-outline', // Nombre del icono home student
    },
    rol: 'user'
  },

  {
    name: 'Detalle tarea',
    component: Tarea,
    options: {
      tabBarButton: () => null, tabBarIcon: 'info'
    },
    rol: 'admin'
  },

  {
    name: 'Perfil',
    component: Perfil,
    rol: 'user'
  },
>>>>>>> Stashed changes
];
