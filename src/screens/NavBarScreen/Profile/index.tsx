import {ScrollView, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import * as Yup from 'yup';
import {
  Avatar,
  Button,
  SegmentedButtons,
  Text,
  TextInput,
} from 'react-native-paper';
import {Formik} from 'formik';
import {useAuthState} from 'react-firebase-hooks/auth';
import {fireAuth} from '../../../lib/firebase';

const ProfileSchema = Yup.object().shape({
  username: Yup.string().min(3, 'Too short'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Too Short').max(20, 'Too Long'),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref('password'), ''],
    'Passwords must match',
  ),
});

export const Profile = () => {
  const [currentTab, setCurrentTab] = useState('statistics');

  const [user, loading] = useAuthState(fireAuth);

  const [userInfo, setUserInfo] = useState({email: '', username: ''});

  const updateUser = (values: {
    email: string;
    username: string;
    password: string;
  }) => {
    //
  };

  if (loading || !user) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Avatar.Image
          size={140}
          style={styles.avatar}
          source={require('../../../../assets/images/flower.png')}
        />
        <Text variant="headlineMedium" style={styles.usernameTitle}>
          {userInfo.username}
        </Text>
        <SegmentedButtons
          value={currentTab}
          onValueChange={setCurrentTab}
          theme={{roundness: 0, border: 'none', fontSize: 40}}
          buttons={[
            {
              value: 'statistics',
              label: 'STATISTICS',
              checkedColor: '#F28482',
              uncheckedColor: '#B75755',
              style: {
                borderColor: '#F7EDE2',
                borderBottomColor:
                  currentTab === 'statistics' ? '#F28482' : '#B75755',
                borderBottomWidth: 5,
              },
            },
            {
              value: 'profile-edit',
              label: 'EDIT PROFILE',
              checkedColor: '#F28482',
              uncheckedColor: '#B75755',
              style: {
                borderColor: '#F7EDE2',
                borderBottomColor:
                  currentTab === 'profile-edit' ? '#F28482' : '#B75755',
                borderBottomWidth: 5,
              },
            },
          ]}
        />
        <View style={styles.userForm}>
          <Formik
            enableReinitialize
            initialValues={{
              username: user.displayName ?? '',
              email: user.email ?? '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={ProfileSchema}
            onSubmit={updateUser}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View>
                <Text style={styles.label}>Username</Text>
                <TextInput
                  mode="outlined"
                  onBlur={handleBlur('username')}
                  value={values.username}
                  outlineStyle={styles.inputOutline}
                  onChangeText={handleChange('username')}
                  style={styles.input}
                />
                {errors.email && touched.email ? (
                  <Text style={styles.errorText}>{errors.email}</Text>
                ) : null}
                <Text style={styles.label}>Email</Text>
                <TextInput
                  mode="outlined"
                  onBlur={handleBlur('email')}
                  value={values.email}
                  outlineStyle={styles.inputOutline}
                  onChangeText={handleChange('email')}
                  style={styles.input}
                />
                {errors.email && touched.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}

                <Text style={styles.label}>Password</Text>
                <TextInput
                  mode="outlined"
                  secureTextEntry
                  onBlur={handleBlur('password')}
                  value={values.password}
                  outlineStyle={styles.inputOutline}
                  onChangeText={handleChange('password')}
                  style={styles.input}
                />
                {errors.password && touched.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}

                <Text style={styles.label}>Confirm password</Text>
                <TextInput
                  mode="outlined"
                  secureTextEntry
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                  outlineStyle={styles.inputOutline}
                  onChangeText={handleChange('confirmPassword')}
                  style={styles.input}
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}

                <Button
                  mode="contained"
                  buttonColor="#B75755"
                  textColor="#F7EDE2"
                  onPress={handleSubmit}>
                  Update profile
                </Button>
              </View>
            )}
          </Formik>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F7EDE2',
    paddingBottom: 30,
  },
  avatar: {
    marginTop: 30,
  },
  usernameTitle: {
    fontFamily: 'Judson',
    fontWeight: 'bold',
    fontSize: 32,
    lineHeight: 37,
    color: '#B75755',
  },
  inputOutline: {
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#84A59D',
    width: '100%',
    height: 40,
    backgroundColor: 'transparent',
  },
  input: {
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginLeft: 20,
    color: '#84A59D',
  },
  userForm: {
    width: '60%',
    marginTop: 20,
  },
  errorText: {
    color: '#B75755',
    paddingLeft: 20,
  },
});
