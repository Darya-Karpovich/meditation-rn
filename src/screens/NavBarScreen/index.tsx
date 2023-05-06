import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomNavigation} from 'react-native-paper';
import {CommonActions} from '@react-navigation/native';
import {Home} from './Home';
import {Profile} from './Profile';
import {Favourites} from './Favourites';

const Tab = createBottomTabNavigator();

const BottomNavBar = ({navigation, state, descriptors, insets}: unknown) => (
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
);

export const NavBarScreen = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}} tabBar={BottomNavBar}>
      <Tab.Screen
        name="Meditations"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: () => (
            <Image
              style={styles.icon}
              source={require('../../../assets/images/home.png')}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={Favourites}
        options={{
          tabBarLabel: 'Favorites',
          tabBarIcon: () => (
            <Image
              style={styles.icon}
              source={require('../../../assets/images/heart.png')}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: () => (
            <Image
              style={styles.icon}
              source={require('../../../assets/images/profile.png')}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

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
