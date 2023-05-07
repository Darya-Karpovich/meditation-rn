import {Formik} from 'formik';
import React from 'react';
import {Alert, ImageBackground, StyleSheet, Text, View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import * as Yup from 'yup';
import {fireAuth, fireStore} from '../lib/firebase';
import {NavigationScreenProps, Routes} from '../types';
import {useCreateUserWithEmailAndPassword} from 'react-firebase-hooks/auth';
import {doc, setDoc} from 'firebase/firestore';

const SignupSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .min(6, 'Too Short')
    .max(20, 'Too Long')
    .required('Required'),
  passwordConfirm: Yup.string().oneOf(
    [Yup.ref('password'), ''],
    'Passwords must match',
  ),
});

export const SignupScreen = ({
  navigation,
}: NavigationScreenProps<Routes.Signup>) => {
  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(fireAuth);

  const handleSignUp = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const res = await createUserWithEmailAndPassword(email, password);
    if (!res) {
      Alert.alert('Error', 'Something went wrong', [{text: 'OK'}]);
      return;
    }

    try {
      const userRef = doc(fireStore, 'users', res.user.uid);
      await setDoc(userRef, {
        email: res.user.email,
        uid: res.user.uid,
      });

      Alert.alert('Success ✅', 'You are signed in!', [{text: 'OK'}]);
      navigation.reset({
        routes: [{name: Routes.Home}],
        index: 0,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/flower.png')}
        resizeMode="cover"
        style={styles.image}>
        <View style={styles.card}>
          <Text style={styles.title}> Sign up</Text>
          <Formik
            initialValues={{email: '', password: '', passwordConfirm: ''}}
            validationSchema={SignupSchema}
            onSubmit={values => handleSignUp(values)}>
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
                <Text style={styles.label}>Confirm password</Text>
                <TextInput
                  mode="outlined"
                  secureTextEntry
                  onBlur={handleBlur('passwordConfirm')}
                  value={values.passwordConfirm}
                  outlineStyle={styles.inputOutline}
                  onChangeText={handleChange('passwordConfirm')}
                />
                {errors.passwordConfirm && touched.passwordConfirm ? (
                  <Text style={styles.errorText}>{errors.passwordConfirm}</Text>
                ) : null}
                <Button
                  mode="contained"
                  buttonColor="#506962"
                  textColor="#F7EDE2"
                  style={styles.button}
                  labelStyle={styles.buttonLabel}
                  onPress={handleSubmit}>
                  Sign up
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
            onPress={() => navigation.navigate(Routes.Login)}>
            Log in
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
