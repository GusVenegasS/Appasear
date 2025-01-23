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
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Nunito-Bold',
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  lottie: {
    width: 150,
    height: 150,
},
});

export default styles;
