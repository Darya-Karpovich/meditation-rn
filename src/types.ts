import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type Meditation = {
  title: string;
  duration: number;
  image: string;
};

export type User = {
  uid: string;
  username: string;
};

export enum Routes {
  Welcome = 'Welcome',
  Home = 'Home',
  Login = 'Login',
  Signup = 'Signup',
}

export type RootStackParamList = {
  [Routes.Home]: undefined;
  [Routes.Welcome]: undefined;
  [Routes.Login]: undefined;
  [Routes.Signup]: undefined;
};

export type NavigationScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
