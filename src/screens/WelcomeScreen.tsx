import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Button} from 'react-native-paper';

export const WelcomeScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/flower.png')}
        resizeMode="cover"
        style={styles.image}>
        <Text style={styles.text}>Welcome to super app</Text>
        <View style={styles.buttonsGroup}>
          <Button
            mode="contained"
            buttonColor="#B75755"
            textColor="#F7EDE2"
            labelStyle={styles.button}
            contentStyle={styles.buttonHeight}
            onPress={() => navigation.navigate('LoginScreen')}>
            Log in
          </Button>
          <Button
            mode="contained"
            buttonColor="#F7EDE2"
            textColor="#B75755"
            labelStyle={styles.button}
            contentStyle={styles.buttonHeight}
            onPress={() => navigation.navigate('SignupScreen')}>
            Sign up
          </Button>
        </View>
      </ImageBackground>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  text: {
    color: '#B75755',
    fontFamily: 'judson',
    fontSize: 48,
    lineHeight: 84,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 100,
  },
  button: {
    fontSize: 24,
    fontFamily: 'judson',
    lineHeight: 28,
  },
  buttonsGroup: {
    gap: 10,
    marginBottom: 50,
  },
  buttonHeight: {
    height: 50,
  },
});
