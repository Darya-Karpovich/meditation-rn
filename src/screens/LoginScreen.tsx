import React from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {firebase} from '../../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .min(6, 'Too Short')
    .max(20, 'Too Long')
    .required('Required'),
});
const storeData = async value => {
  try {
    await AsyncStorage.setItem('userId', value);
  } catch (e) {
    // saving error
  }
};

export const LoginScreen = ({navigation}) => {
  const handleLogin = ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(response => {
        const uid = response.user.uid;
        const usersRef = firebase.firestore().collection('users');
        usersRef
          .doc(uid)
          .get()
          .then(firestoreDocument => {
            if (!firestoreDocument.exists) {
              alert('User does not exist anymore.');
              return;
            }

            const user = firestoreDocument.data();
            // user && AsyncStorage.setItem('userId', user.id);
            user && storeData(user.id);
            navigation.navigate('HomeScreen', {user});
          })
          .catch(error => {
            alert(error);
          });
      })
      .catch(error => {
        alert(error);
      });
  };
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/flower.png')}
        resizeMode="cover"
        style={styles.image}>
        <View style={styles.card}>
          <Text style={styles.title}>Log in</Text>
          <Formik
            initialValues={{email: '', password: ''}}
            validationSchema={LoginSchema}
            onSubmit={values => handleLogin(values)}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  mode="outlined"
                  onBlur={handleBlur('email')}
                  value={values.email}
                  outlineStyle={styles.inputOutline}
                  onChangeText={handleChange('email')}
                />
                {errors.email && touched.email ? (
                  <Text style={styles.errorText}>{errors.email}</Text>
                ) : null}
                <Text style={styles.label}>Password</Text>
                <TextInput
                  mode="outlined"
                  secureTextEntry
                  onBlur={handleBlur('password')}
                  value={values.password}
                  outlineStyle={styles.inputOutline}
                  onChangeText={handleChange('password')}
                />
                {errors.password && touched.password ? (
                  <Text style={styles.errorText}>{errors.password}</Text>
                ) : null}
                <Button
                  mode="contained"
                  buttonColor="#506962"
                  textColor="#F7EDE2"
                  style={styles.button}
                  labelStyle={styles.buttonLabel}
                  onPress={handleSubmit}>
                  Log in
                </Button>
              </View>
            )}
          </Formik>
          <Text style={styles.text}>or</Text>
          <Button
            mode="contained"
            textColor="#F7EDE2"
            style={styles.buttonSecondary}
            labelStyle={styles.buttonSecondaryLabel}
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
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(247, 237, 226 ,0.8)',
    padding: 40,
    borderRadius: 20,
  },
  title: {
    fontSize: 36,
    fontFamily: 'judson',
    fontWeight: 'bold',
    alignSelf: 'center',
    lineHeight: 42,
    marginBottom: 20,
    color: '#84A59D',
  },
  inputOutline: {
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#84A59D',
    width: '100%',
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 16,
    marginTop: 20,
    marginLeft: 20,
    color: '#84A59D',
  },
  text: {
    color: '#84A59D',
    fontSize: 16,
    marginVertical: 10,
    fontFamily: 'judson',
    alignSelf: 'center',
  },
  button: {
    marginTop: 40,
  },
  buttonLabel: {
    fontSize: 22,
    fontFamily: 'judson',
  },
  buttonSecondaryLabel: {
    fontSize: 16,
    fontFamily: 'judson',
    paddingHorizontal: 10,
  },
  buttonSecondary: {
    alignSelf: 'center',
  },
  errorText: {
    color: '#B75755',
    paddingLeft: 20,
  },
});
