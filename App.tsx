import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {WelcomeScreen} from './src/screens/WelcomeScreen';
import {LoginScreen} from './src/screens/LoginScreen';
import {
  Provider as PaperProvider,
  MD3LightTheme as DefaultTheme,
} from 'react-native-paper';
import {SignupScreen} from './src/screens/SignupScreen';
import {NavBarScreen} from './src/screens/NavBarScreen';
import {useIdToken} from 'react-firebase-hooks/auth';
import {fireAuth} from './src/lib/firebase';
import {RootStackParamList, Routes} from './src/types';
import {storage} from './src/lib/mmkv';
import {ACCESS_TOKEN} from './src/lib/consts';
import {signInWithCustomToken} from 'firebase/auth';

const Stack = createNativeStackNavigator<RootStackParamList>();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#84A59D',
    secondaryContainer: 'transparent',
  },
};

const PROTECTED_ROUTES = (
  <>
    <Stack.Screen name={Routes.Home} component={NavBarScreen} />
  </>
);

const GUEST_ROUTES = (
  <>
    <Stack.Screen name={Routes.Login} component={LoginScreen} />
    <Stack.Screen name={Routes.Signup} component={SignupScreen} />
    <Stack.Screen name={Routes.Welcome} component={WelcomeScreen} />
  </>
);

function App(): JSX.Element {
  const [user] = useIdToken(fireAuth);

  useEffect(() => {
    const token = storage.getString(ACCESS_TOKEN);

    console.log('old token', token, !!user);
    if (token && !user) {
      signInWithCustomToken(fireAuth, token);
      return;
    }

    if (!user) {
      return;
    }

    const newToken = (user as any).stsTokenManager.accessToken;
    storage.set(ACCESS_TOKEN, newToken);
  }, [user]);

  useEffect(() => {}, [user]);

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          {user ? PROTECTED_ROUTES : GUEST_ROUTES}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
