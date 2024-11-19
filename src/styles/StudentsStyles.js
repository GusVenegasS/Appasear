// src/styles/StudentsScreenStyles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,   
    padding: 10, // Espaciado interno
    marginHorizontal: 20, // Margen horizontal
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: "#008EB6",
    paddingVertical: 15,
    padding: 25,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  studentList: {
    marginTop: 20,
  },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  studentName: {
    fontSize: 16,
  },
});

export default styles;
