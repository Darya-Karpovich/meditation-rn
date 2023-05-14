import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {WelcomeScreen} from './screens/WelcomeScreen';
import {LoginScreen} from './screens/LoginScreen';
import {
  Provider as PaperProvider,
  MD3LightTheme as DefaultTheme,
} from 'react-native-paper';
import {SignupScreen} from './screens/SignupScreen';
import {NavBarScreen} from './screens/NavBarScreen';
import {useIdToken} from 'react-firebase-hooks/auth';
import {fireAuth} from './lib/firebase';
import {RootStackParamList, Routes} from './types';
import {storage} from './lib/mmkv';
import {ACCESS_TOKEN} from './lib/consts';
import {signInWithCustomToken} from 'firebase/auth';
import {MeditationScreen} from './screens/MeditationScreen';
import {setupPlayer} from './lib/player';

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
    <Stack.Screen name={Routes.Meditation} component={MeditationScreen} />
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

  useEffect(() => {
    setupPlayer();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer
        onStateChange={e => {
          e?.routes.map(route => {
            console.log(route.name, route.params);
          });
        }}>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          {user ? PROTECTED_ROUTES : GUEST_ROUTES}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
