import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type Meditation = {
  id: string;
  title: string;
  duration: number;
  image: string;
  url: string;
  createdAt: number;
};

export type User = {
  uid: string;
  username: string;
  favorites: string[];
};

export enum Routes {
  Welcome = 'Welcome',
  Home = 'Home',
  Login = 'Login',
  Signup = 'Signup',
  Meditation = 'Meditation',
}

export type RootStackParamList = {
  [Routes.Home]: undefined;
  [Routes.Welcome]: undefined;
  [Routes.Login]: undefined;
  [Routes.Signup]: undefined;
  [Routes.Meditation]: {id: string; nextId?: string; prevId?: string};
};

export type NavigationScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
