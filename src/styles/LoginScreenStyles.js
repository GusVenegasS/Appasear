// src/styles/LoginScreenStyles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,                  // Ocupa todo el espacio disponible
    padding: 1,
    justifyContent: 'center',  // Centra verticalmente
  },
  scrollContainer: {
    paddingHorizontal: 30,
    paddingVertical: 20,
    flexGrow: 1,               // Asegura que el ScrollView pueda crecer si es necesario
    justifyContent: 'center',  // Cambia a 'center' para centrar el contenido verticalmente
  },
  header: {
    width: '100%',
    paddingVertical: 20,
    backgroundColor: 'orange', // Fondo color naranja
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white', // Letras en blanco
  },
  logoContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 100, // Hace que la imagen sea circular
    borderWidth: 2, // Grosor del contorno
    borderColor: '#008EB6', // Color del contorno
    resizeMode: 'cover', // Ajusta el contenido para cubrir el área del logo
  },
  inputContainer: {
    marginBottom: 20,
    paddingHorizontal: 7,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    backgroundColor: 'white',
    flexDirection: 'row',  // Asegura que los elementos estén alineados horizontalmente
    alignItems: 'center',  // Centra el contenido verticalmente
  },
  textInput: {
    flex: 1,  // Hace que el TextInput ocupe todo el espacio disponible
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingLeft: 10,
    paddingRight: 40, // Para dejar espacio para el ícono
    height: 50,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#008EB6", // Color de fondo del botón
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  loginButtonText: {
    color: 'white', // Color del texto
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    color: 'grey',
    textAlign: 'center',
  },
  icon: {
    position: 'absolute',
    right: 10,  // Alinea el ícono a la derecha del TextInput
    top: '50%',  // Alinea verticalmente al centro
    transform: [{ translateY: -12 }], // Ajuste fino para centrar verticalmente
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  formContainer: {
    backgroundColor: 'white', // Fondo blanco
    borderRadius: 10, // Bordes redondos
    borderWidth: 2, // Grosor del contorno
    borderColor: '#008EB6', // Color del contorno
    padding: 20, // Espaciado interno
    marginHorizontal: 10, // Margen horizontal
    shadowColor: '#000', // Color de sombra
    shadowOffset: { width: 0, height: 2 }, // Offset de la sombra
    shadowOpacity: 0.2, // Opacidad de la sombra
    shadowRadius: 3, // Radio de la sombra
    elevation: 3, // Para Android, sombra
  },
  dropdownButton: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    height: 50,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 7,
  },
  dropdown: {
    borderRadius: 10,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
});

export default styles;
