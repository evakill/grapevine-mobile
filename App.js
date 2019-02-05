import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createStackNavigator} from 'react-navigation';
import Login from './scenes/Login.js'
import OwnerProf from './scenes/owner/OwnerProf.js'
import AmbassadorProf from './scenes/ambassador/AmbassadorProf.js'
import CreateCampaign from './scenes/owner/CreateCampaign.js'
import SearchCampaigns from './scenes/ambassador/SearchCampaigns.js'
import EditOwnerProf from './scenes/owner/EditOwnerProf.js'
import EditAmbassadorProf from './scenes/ambassador/EditAmbassadorProf.js'
import OwnerViewCampaign from './scenes/owner/OwnerViewCampaign.js'
import AmbassadorViewCampaign from './scenes/ambassador/AmbassadorViewCampaign.js'

import { Font } from 'expo';

const RootStack = createStackNavigator({
  Login: { screen: Login },
  OwnerProf: { screen: OwnerProf },
  AmbassadorProf: { screen: AmbassadorProf },
  CreateCampaign: { screen: CreateCampaign },
  SearchCampaigns: { screen: SearchCampaigns },
  EditOwnerProf: { screen: EditOwnerProf },
  EditAmbassadorProf: { screen: EditAmbassadorProf },
  OwnerViewCampaign: { screen: OwnerViewCampaign },
  AmbassadorViewCampaign: { screen: AmbassadorViewCampaign },
},
{
  initialRouteName: 'Login',
});

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      fontLoaded: false,
    }
  }

  async componentDidMount() {
   await Font.loadAsync({
     'Muli': require('./assets/fonts/Muli-Regular.ttf'),
     'Heebo': require('./assets/fonts/Heebo-Regular.ttf'),
     'Heebo-Bold': require('./assets/fonts/Heebo-Bold.ttf'),
     'Muli-Bold': require('./assets/fonts/Muli-Bold.ttf'),
   });
   this.setState({ fontLoaded: true });
 }

  render() {
    return (
      this.state.fontLoaded ?
      <RootStack/> :
      <View><Text>Loading...</Text></View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: '#CDE0BE',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
