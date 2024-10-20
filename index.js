import { AppRegistry } from 'react-native';
import App from './src/App'; // Asegúrate de que la ruta sea correcta
import { name as appName } from './app.json'; // Asegúrate de que esta ruta sea correcta

AppRegistry.registerComponent(appName, () => App);