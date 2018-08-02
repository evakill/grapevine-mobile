import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { ButtonGroup, Input } from 'react-native-elements';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    console.log('constructor')
    this.state = {
      userType: '',
      email: '',
      password: '',
    }
    this.selectUserType = this.selectUserType.bind(this)
  }

  selectUserType(index){
    this.setState({userType: index});
  }

  login(){
    console.log('login', this.state);
    switch(this.state.userType) {
      case 0 :
        console.log('validate owner');
        fetch('http://localhost:8080/auth/login/owner', {
          method:'POST',
          body: JSON.stringify({
            username: this.state.email,
            password: this.state.password,
          })
        })
        .then(function(err, resp){
          if(err) console.log('Error with the fetch', err)
          else console.log(resp.json())
        });
        break;
      case 1 :
        console.log('validate ambassador');
        fetch('http://localhost:8080/auth/login/ambassador', {
          method: 'POST',
          body: JSON.stringify({
            username: this.state.email,
            password: this.state.password,
          })
        })
        .then(function(response){
          return response.json();
        })
        .then(function(json){
          console.log('fetch response', json)
        })
        .catch(function(err){
          console.log('Fetch error,', err)
        })
        break;
      case '' :
        console.log('choose user type');
        break;
    }
  }

  render() {
    console.log('rendering', this.state)
    return (
      <View>
        <View style={styles.header}><Text style={styles.headerText}>Login</Text></View>

        <ButtonGroup
          onPress={this.selectUserType}
          buttons={['Owner', 'Ambassador']}
        />
        <FormLabel>Email</FormLabel>
        <FormInput onChangeText={(text)=>this.setState({email: text})} value={this.state.email}/>
        <FormLabel>Password</FormLabel>
        <FormInput onChangeText={(text)=>this.setState({password: text})} value={this.state.password}/>
        <Button
          title="Login"
          onPress={(e)=> this.login()}/>
        </View>
      )
    }
  }

  const styles = {
    header: {
      display: "flex",
      alignContent: "center",
      justifyContent: "center",
      height: 70,
      backgroundColor: "#695171",
      textAlign: "center",
    },
    headerText: {
      color: "rgba(235, 235, 235, 1)",
      fontFamily: 'Muli',
      fontSize: 50,
    },
    subtitle: {
      color: "#B3A2B9",
      fontFamily: 'Heebo',
      fontSize: 24,
    }
  }
