import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createStackNavigator} from 'react-navigation';
import Login from './scenes/Login.js'

const RootStack = createStackNavigator({
  Login: { screen: Login },
  // OwnerProf: { screen: OwnerProf },
  // AmbassadorProf: { screen: AmbassadorProf },
},
{
  initialRouteName: 'Login',
});

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
