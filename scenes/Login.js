import React from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import { ButtonGroup, Icon, Button } from 'react-native-elements';
import { View } from '@shoutem/ui'

import c from '../assets/palette.js';
import io from 'socket.io-client'
const socket = io('http://localhost:8080');

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userType: null,
      email: 'evakillenberg@gmail.com',
      password: '1234',
      valid: true,
      userSelected: true,
    }
  }

  login(){
    var self = this;
    switch(this.state.userType) {
      case 0 :
      fetch('http://localhost:8080/auth/login/owner', {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          username: this.state.email,
          password: this.state.password,
        }),
      })
      .then(function(response) {
        return response.json();
      })
      .catch(error => {
        console.log('fetch err', error);
        self.setState({valid:false});
      })
      .then(function(json) {
        if(json){
          socket.emit('get campaigns', json);
          socket.on('found campaigns', function(campaigns){
            self.props.navigation.navigate('OwnerProf', {owner: json, campaigns: campaigns});
          });
        }
      });
      break;
      case 1 :
      fetch('http://localhost:8080/auth/login/ambassador', {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          username: this.state.email,
          password: this.state.password,
        }),
      })
      .then(function(response) {
        return response.json();
      })
      .catch(error => {
        console.log('fetch err', error);
        self.setState({valid:false});
      })
      .then(function(json) {
        if(json){
          socket.emit('populate campaigns', json);
          socket.on('populated campaigns', function(campaigns){
            self.props.navigation.navigate('AmbassadorProf', {ambassador: json, campaigns: campaigns})
          });
        }
      });
      break;
      default :
      self.setState({userSelected: false});
      break;
    }
  }

  render() {

    return (
      <View style={{backgroundColor: c.purple3}} styleName="fill-parent">
        <View style={styles.container}>
          <Text style={styles.title}>Grapevine</Text>
          <ButtonGroup
            onPress={(index)=> this.setState({userType: index, userSelected: true})}
            buttons={['Owner', 'Ambassador']}
            selectedBackgroundColor={c.gray5}
            selectedIndex={this.state.userType}
            containerStyle={styles.buttonGroup}
            textStyle={styles.text}
            innerBoarderStyle={{borderColor:"#fff"}}
          />
          <Text style={styles.text}>{this.state.userSelected ? "" : "Please Select User Type"}</Text>
          <View style={styles.inputContainer}>
            <Icon name="user" type="font-awesome" color="#F9F9F9" iconStyle={styles.icon}/>
            <TextInput style={styles.textInput}
              autoCapitalize="none"
              placeholder={'Email'}
              onChangeText={(text)=>this.setState({email: text})}
              value={this.state.email}
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon name="lock" type="font-awesome" color="#F9F9F9" iconStyle={styles.icon}/>
            <TextInput style={styles.textInput}
              autoCapitalize="none"
              placeholder={'Password'}
              secureTextEntry
              onChangeText={(text)=>this.setState({password: text})}
              value={this.state.password}
              selectionColor="white"
            />
          </View>
          <Text style={styles.text}>{this.state.valid ? "" : "Invalid Login Information"}</Text>
          <ButtonGroup
            onPress={(index)=>this.login()}
            containerStyle={styles.button}
            buttons={["Login"]}

            textStyle={styles.text}
            //raised
            //outline
          />
        </View>
      </View>
      )
    }
  }

const styles = {
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 54,
    fontFamily: 'Muli-Bold',
    shadowColor: c.purple4,
    color: '#f9f9f9',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 1,
    shadowRadius: 0,
    alignSelf: "center",
    marginBottom: 20,
  },
  buttonGroup: {
    width: 300,
    height: 40,
    margin: 10,
    backgroundColor: c.purple4,
    borderColor: c.purple2,
    borderRadius: 2,
    borderWidth: 0,
  },
  inputContainer: {
    flexDirection: "row",
    height: 40,
    width: 300,
    margin: 5,
    alignSelf: "center",
  },
  textInput: {
    height: 40,
    flex: 1,
    borderColor: c.purple2,
    borderRadius: 2,
    borderWidth: 0,
    backgroundColor: c.purple4,
    padding: 10,
    fontFamily: 'Heebo',
    fontSize: 16,
    color: c.gray1,
  },
  icon: {
    marginRight: 10,
    width: 20,
  },
  button: {
    width: 300,
    height: 40,
    margin: 20,
    backgroundColor: c.purple1,
    borderColor: c.purple4,
    borderRadius: 2,
    borderWidth: 0,
    padding: 0,
  },
  text: {
    //fontFamily: "Heebo",
    //fontSize: 15,
    color: c.gray1,
  }
}
