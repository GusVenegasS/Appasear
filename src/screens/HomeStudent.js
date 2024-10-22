import React, { useState, useEffect} from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet,  Dimensions  } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/Ionicons';
import Colores from '../styles/colores';
import TextStyles from '../styles/texto';

const { width } = Dimensions.get('window');
const HomeStudent = () => {
    const [tareas, setTareas] = useState([]); // Inicialmente vacío, luego cargamos datos
    const [filteredTareas, setFilteredTareas] = useState([]); // Almacena tareas filtradas
    const [showCalendar, setShowCalendar] = useState(false);

    // Simulación de obtener las tareas (puede ser de una API en el futuro)
    useEffect(() => {
        // Aquí puedes poner la lógica de obtener tareas desde una base de datos o API
        const obtenerTareas = () => {
            const nuevasTareas = [
                { id: '1', titulo: 'Pasear Perros', fecha: '2024-10-01', estado: 'Por Completar' },
                { id: '2', titulo: 'Limpiar Perrera', fecha: '2024-10-02', estado: 'Completada' },
                { id: '3', titulo: 'Pasear Perros', fecha: '2024-02-03', estado: 'Completada' },
                { id: '4', titulo: 'Pasear Perros', fecha: '2024-02-03', estado: 'Completada' },
                { id: '5', titulo: 'Limpiar Perrera', fecha: '2024-02-03', estado: 'Completada' },
            ];

            setTareas(nuevasTareas); // Actualizamos el estado con las nuevas tareas
            setFilteredTareas(nuevasTareas); // Mostramos todas las tareas al inicio
        };

        obtenerTareas(); // Llamamos a la función para cargar las tareas al montar el componente
    }, []);

    const handleDayPress = (day) => {
        
        const selectedDate = day.dateString; // Fecha seleccionada en formato YYYY-MM-DD
        const filtered = tareas.filter(tarea => tarea.fecha === selectedDate); // Filtrar tareas por la fecha seleccionada
        console.log(selectedDate)
        setFilteredTareas(filtered);
        setShowCalendar(false); // Ocultar el calendario después de seleccionar la fecha
    };
    const handleVerTodo = () => {
        setFilteredTareas(tareas);
    };
    
  
    const renderTarea = ({ item }) => (
        <View style={[styles.card, { width: width * 0.9 }]}>
          {/* Fila 1: Título y Fecha */}
          <View style={styles.header}>
            <Text style={TextStyles.tituloCard}>{item.titulo}</Text>
            <Text style={styles.date}>{item.fecha}</Text>
          </View>
    
          {/* Fila 2: Estado e Íconos */}
          <View style={styles.stateIconsContainer}>
            <Text style={[styles.status,TextStyles.estadoCard, { color: item.estado === 'Completada' ? 'green' : 'red' }]}>{item.estado}</Text>
            <View style={styles.iconsContainer}>
              <TouchableOpacity>
                <Icon name="eye" size={24} color="gray" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Icon name="create-outline" size={24} color="gray" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    
      return (
        <View style={styles.container}>
            <View style={styles.filterContainer}>
          
            {/* Botón "Ver Todo" */}
            <TouchableOpacity style={styles.verTodoButton} onPress={handleVerTodo}>
            <Icon name="eye" size={25} color={Colores.colorIcon}  />
                <Text style={[styles.filterText, TextStyles.buttonText]}>Ver Todo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.calendarButton} onPress={() => setShowCalendar(!showCalendar)}>
                <Icon name="calendar" size={25} color={Colores.colorIcon}  />
                <Text style={[styles.filterText, TextStyles.buttonText]}>Filtrar por fechas</Text>
            </TouchableOpacity>
            </View>
              {/* Mostrar calendario cuando se presiona el botón */}
              {showCalendar && (
                <Calendar
                    onDayPress={handleDayPress} // Llamar a handleDayPress al seleccionar una fecha
                    markedDates={{}} // Aquí puedes marcar las fechas que desees
                    theme={{
                        selectedDayBackgroundColor: Colores.primary,
                        todayTextColor: Colores.primary,
                    }}
                />
            )}
            {/* FlatList para mostrar tareas filtradas */}
            <FlatList
                data={filteredTareas}
                renderItem={renderTarea}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContentContainer}
                showsVerticalScrollIndicator={false}
            />
    
        </View>
      );
    };
    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: Colores.background,
            padding: 16,
        },
        filterContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
        },
        verTodoButton: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        calendarButton: {
            flexDirection: 'row',
            alignItems: 'center',
        },

        /*filterButton: {
            flexDirection: 'row',
            alignItems: 'flex',
            marginBottom: 16,
        }*/
          
        filterText: {
            
            marginLeft: 8,
            marginRight: 8,
        },
        card: {
            backgroundColor: '#ffffff',
            borderRadius: 8,
            padding: 16,
            marginBottom: 16,
            shadowColor: '#000',
            borderColor: '#008EB6',
            borderWidth: 2,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 3,
            elevation: 5,
            
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
        },
        title: {
            fontSize: 16,
            fontWeight: 'bold',
        },
        date: {
            fontSize: 14,
            color: 'gray',
        },
        stateIconsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 8,
        },
        status: {
            fontSize: 14,
            marginRight: 16,
        },
        iconsContainer: {
            flexDirection: 'row',
        },
        listContentContainer: {
            paddingBottom: 20,
        },
    });
    
export default HomeStudent;

