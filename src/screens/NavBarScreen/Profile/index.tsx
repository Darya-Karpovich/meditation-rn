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
import {
  useAuthState,
  useUpdateEmail,
  useUpdatePassword,
} from 'react-firebase-hooks/auth';
import {fireAuth, fireStore} from '../../../lib/firebase';
import {useDocument} from 'react-firebase-hooks/firestore';
import {DocumentReference, doc, setDoc} from 'firebase/firestore';
import {User} from '../../../types';

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

  const [currentUser, isCurrentUserLoading] = useAuthState(fireAuth);
  const [updateEmail] = useUpdateEmail(fireAuth);
  const [updatePassword] = useUpdatePassword(fireAuth);

  const [userDoc, isUserDataLoading] = useDocument<User>(
    doc(fireStore, 'users', currentUser?.uid ?? '') as DocumentReference<User>,
    {snapshotListenOptions: {includeMetadataChanges: true}},
  );

  const userData = userDoc?.data();
  const updateUser = ({
    email,
    username,
    password,
  }: {
    email: string;
    username: string;
    password: string;
  }) => {
    if (email !== currentUser?.email) {
      updateEmail(email).catch(error => {
        console.log(error);
      });
    }

    if (password) {
      updatePassword(password);
    }

    if (username !== userData?.username) {
      setDoc(doc(fireStore, 'users', currentUser?.uid ?? ''), {username});
    }
  };

  if (isCurrentUserLoading || isUserDataLoading) {
    return <Text>Loading...</Text>;
  }

  if (!currentUser || !userDoc?.exists || !userData) {
    return <Text>Not logged in or profile was not created</Text>;
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Avatar.Image
          size={140}
          style={styles.avatar}
          source={
            currentUser.photoURL ??
            require('../../../../assets/images/flower.png')
          }
        />
        <Text variant="headlineMedium" style={styles.usernameTitle}>
          {userData.username}
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
              username: userData.username ?? '',
              email: currentUser.email ?? '',
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
                {errors.email && touched.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}

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
