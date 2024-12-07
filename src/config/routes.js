// src/config/routes.js
import Brigadas from '../screens/brigadas';
import Usuarios from '../screens/usuarios';
import Configuracion from '../screens/configuraciones';
import LoginScreen from '../screens/LoginScreen';
import HomeStudent from '../screens/HomeStudent';
import BrigadasStudent from '../screens/BrigadasStudent';
import ConfiguracionStudent from '../screens/ConfiguracionStudent';
import HomeStack from '../screens/HomeStack';
import Usuario from '../screens/usuario';
import Periodo from '../screens/periodo';
import Tarea from '../screens/detalleTarea';
import Perfil from '../screens/PerfilScreen';
import PerfilScreen from '../screens/PerfilScreen';
import CambiarContrasenaScreen from './screens/CambiarContrasenaScreen.js';
import ContrasenaScreen from './screens/ContrasenaScreen.js';


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
    component: PerfilScreen,
    options: {
      tabBarButton: () => null, tabBarIcon: 'info'
    },
    rol: 'admin'
  },
  {
    name: 'Tareas',
    component: HomeStudent,
    options: {
      tabBarIcon: 'home-outline',
    },
    rol: 'user'
  },
  {
    name: 'Brigadas',
    component: BrigadasStudent,
    options: {
      tabBarIcon: 'users',
    },
    rol: 'user'
  }
 ,

  {
    name: 'Configuración',
    component: ConfiguracionStudent,
    options: {
      tabBarIcon: 'settings-outline', // Nombre del icono home student
    },
    rol: 'user'
  },
  {
    name: 'PerfilStudent',
    component: PerfilScreen,
    options: {
      tabBarButton: () => null, tabBarIcon: 'info'
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
    name: 'CambiarContrasenaScreen',
    component: CambiarContrasenaScreen,
    options: {
      tabBarButton: () => null, tabBarIcon: 'info'
    },
  },
  {
    name: 'ContrasenaScreen',
    component: ContrasenaScreen,
    options: {
      tabBarButton: () => null, tabBarIcon: 'info'
    },
  },
];
