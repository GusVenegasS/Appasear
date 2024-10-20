import React from 'react';
import { View, Text } from 'react-native';
import TextStyles from '../styles/texto'; 
import HeaderStyle from '../styles'

const   
 CustomHeader = ({ title }) => {
  return (
    <View style={HeaderStyle.headerContainer}>
      <Text style={TextStyles.title1}>{title}</Text>
    </View>
  );
};

export default CustomHeader;