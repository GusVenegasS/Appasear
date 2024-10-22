import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet,  Dimensions  } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/Ionicons';
import Colores from '../styles/colores';

const { width } = Dimensions.get('window');
const HomeStudent = () => {
    const tareas = [
        { id: '1', titulo: 'Pasear Perros', fecha: '2024-10-01', estado: 'Por Completar' },
        { id: '2', titulo: 'Limpiar Perrera', fecha: '2024-10-02', estado: 'Completada' },
        { id: '3', titulo: 'Alimentar Perros', fecha: '03/02/2024', estado: 'Completada' },
        { id: '4', titulo: 'Alimentar Perros', fecha: '03/02/2024', estado: 'Completada' },
        { id: '5', titulo: 'Alimentar Perros', fecha: '03/02/2024', estado: 'Completada' },
        
    ];

    const [filteredTareas, setFilteredTareas] = useState(tareas); // Estado para almacenar las tareas filtradas
    const [showCalendar, setShowCalendar] = useState(false)

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
            <Text style={styles.title}>{item.titulo}</Text>
            <Text style={styles.date}>{item.fecha}</Text>
          </View>
    
          {/* Fila 2: Estado e Íconos */}
          <View style={styles.stateIconsContainer}>
            <Text style={[styles.status, { color: item.estado === 'Completada' ? 'green' : 'red' }]}>{item.estado}</Text>
            <View style={styles.iconsContainer}>
              <TouchableOpacity>
                <Icon name="eye-outline" size={24} color="gray" />
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
           <TouchableOpacity style={styles.filterButton} onPress={() => setShowCalendar(!showCalendar)}>
                <Icon name="calendar-outline" size={20} color={Colores.primary} />
                <Text style={styles.filterText}>Filtrar por fechas</Text>
            </TouchableOpacity>
            {/* Botón "Ver Todo" */}
            <TouchableOpacity style={styles.filterButton} onPress={handleVerTodo}>
                <Icon name="eye-outline" size={20} color={Colores.primary} />
                <Text style={styles.filterText}>Ver Todo</Text>
            </TouchableOpacity>
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
        filterButton: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
        },
        filterText: {
            color: Colores.primary,
            marginLeft: 8,
        },
        card: {
            backgroundColor: Colores.background,
            borderRadius: 8,
            padding: 16,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 4,
            elevation: 3,
            borderWidth: 1,
            borderColor: '#5FBDD6',
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

