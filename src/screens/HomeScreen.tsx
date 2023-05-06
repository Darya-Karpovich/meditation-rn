/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {Image, StyleSheet, View} from 'react-native';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text, BottomNavigation} from 'react-native-paper';
import {CommonActions} from '@react-navigation/native';
import {MainScreen} from './MainScreen';
import { ProfileScreen } from './ProfileScreen';

const Tab = createBottomTabNavigator();

export const HomeScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({navigation, state, descriptors, insets}) => (
        <BottomNavigation.Bar
          navigationState={state}
          safeAreaInsets={insets}
          style={styles.bottomNavigation}
          onTabPress={({route, preventDefault}) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
              navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({route, focused, color}) => {
            const {options} = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({focused, color, size: 24});
            }

            return null;
          }}
          activeColor="#F7EDE2"
          inactiveColor="#2F3A38"
          getLabelText={({route}) => {
            const {options} = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

            return label;
          }}
        />
      )}>
      <Tab.Screen
        name="Home"
        component={MainScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => {
            return (
              <Image
                style={styles.icon}
                source={require('../../assets/images/home.png')}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Favorites',
          tabBarIcon: ({color, size}) => {
            return (
              <Image
                style={styles.icon}
                source={require('../../assets/images/heart.png')}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => {
            return (
              <Image
                style={styles.icon}
                source={require('../../assets/images/profile.png')}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Profile!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNavigation: {
    backgroundColor: '#84A59D',
    fontSize: 30,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: 30,
    width: 30,
  },
});
