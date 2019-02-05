import React from 'react';
import { StyleSheet, Text, TextInput, ScrollView, Dimensions, Button } from 'react-native';
import { ButtonGroup, Icon, FormLabel } from 'react-native-elements';
import { View } from '@shoutem/ui'
import { Textarea } from 'native-base'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import c from '../../assets/palette.js';

import io from 'socket.io-client'
const socket = io('http://localhost:8080');

import Header from '../../components/header.js'

export default class EditOwnerProf extends React.Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.state = navigation.getParam('owner', '');
  }

  componentDidMount(){
    const self = this;
    socket.on('new owner profile', function(owner){
      self.props.navigation.navigate('OwnerProf', {owner: owner});
    });
  }

  render() {
    return (
      <View style={styles.screen} styleName="fill-parent">
        <Header toProfile={(e)=>this.props.navigation.navigate('AmbassadorProf')}></Header>
        <ScrollView
          style={{flex:1}}>
            <View style={styles.form}>
              <Text style={styles.h1}>Edit Profile</Text>
              <FormLabel labelStyle={styles.h2}>First Name</FormLabel>
              <TextInput style={styles.input}
                multiline = {false}
                placeholder='First Name'
                onChangeText={(text)=>this.setState({firstName: text})}
                value={this.state.firstName}
              />
              <FormLabel labelStyle={styles.h2}>Last Name</FormLabel>
              <TextInput style={styles.input}
                multiline = {false}
                placeholder='Last Name'
                onChangeText={(text)=>this.setState({lastName: text})}
                value={this.state.lastName}
              />
              <FormLabel labelStyle={styles.h2}>Email</FormLabel>
              <TextInput style={styles.input}
                multiline = {false}
                placeholder='Email'
                onChangeText={(text)=>this.setState({email: text})}
                value={this.state.email}
              />
              <FormLabel labelStyle={styles.h2}>Business Name</FormLabel>
              <TextInput style={styles.input}
                multiline = {false}
                placeholder='Business Name'
                onChangeText={(text)=>this.setState({businessName: text})}
                value={this.state.businessName}
              />
              <FormLabel labelStyle={styles.h2}>Business Description</FormLabel>
              <TextInput style={styles.textarea}
                multiline = {true}
                numberOfLines = {4}
                placeholder="Description"
                onChangeText={(text)=>this.setState({businessDesc: text})}
                value={this.state.businessDesc}
              />
              <FormLabel labelStyle={styles.h2}>Business Address</FormLabel>

            <GooglePlacesAutocomplete
              placeholder={this.state.businessAddress || 'enter an adress'}
              minLength={2}
              autoFocus={false}
              returnKeyType={'default'}
              fetchDetails={true}
              styles={{
                container: {backgroundColor:c.gray1, borderWidth:0, marginBottom:15},
                textInputContainer: {backgroundColor:c.gray1, borderWidth:0},

                textInput: styles.location,
                predefinedPlacesDescription: {
                //  color: '#1faadb'
                },
              }}
              currentLocation={false}
              query={{
                // available options: https://developers.google.com/places/web-service/autocomplete
                key: "AIzaSyDA1Im5Hf2NHk8G2ppaeJPqBeBJYDgSZ08",
                language: 'en', // language of the results
              }}
              onPress={(data, details = null) => {
                this.setState({location: {
                  lat: details.geometry.location.lat,
                  long: details.geometry.location.lng,
                },
                businessAddress: details.formatted_address});
              }}
            />

              <FormLabel labelStyle={styles.h2}>Business Email</FormLabel>
              <TextInput style={styles.input}
                multiline = {false}
                placeholder='Email'
                onChangeText={(text)=>this.setState({businessEmail: text})}
                value={this.state.businessEmail}
              />
              <ButtonGroup
                onPress={(i) => {i===0 ? socket.emit('edit owner profile', this.state) : this.props.navigation.navigate('OwnerProf')}}
                buttons={['Save', 'Cancel']}
                containerStyle={{width:200, margin: 15, alignSelf: "center"}}
              />
              <View style={{padding:15}}></View>
            </View>
                <View style={{height:100}}></View>
            </ScrollView>
          </View>
        )
      }
    }

        const { width } = Dimensions.get('window')

    const styles = {
      screen: {
        display: "flex",
        flex: 1,
        backgroundColor: c.green2,
      },
      h1: {
        fontSize: 28,
        color:c.gray5,
        textAlign: "center",
        fontFamily: "Heebo-Bold",
      },
      form: {
        display: "flex",
        flexDirection: "column",
        marginBottom: 5,
        backgroundColor: c.gray1,
        width: width,
        padding: 15,
        top: 70,
      },
      input: {
        margin: 5,
        marginLeft: 10,
        height: 40,
        width: 325,
        borderColor: c.gray3,
        borderRadius: 2,
        borderWidth: 1,
        backgroundColor: c.gray2,
        color: c.gray5,
        padding: 4,
        alignSelf: "center",
      },
      textarea: {
        margin: 5,
        marginLeft: 10,
        height: 100,
        width: 325,
        borderColor: c.gray3,
        borderRadius: 2,
        borderWidth: 1,
        backgroundColor: c.gray2,
        color: 'gray',
        padding: 4,
        alignSelf: "center",
      },
      h2: {
        fontSize: 14,
        color: c.gray5,
        textAlign: "left",
        paddingTop: 5,
        fontFamily: "Heebo-Bold",
      },
      location: {
        height: 40,
        width: 325,
        borderColor: c.gray3,
        borderRadius: 2,
        borderWidth: 0,
        backgroundColor: c.gray2,
        color: c.gray5,
        padding: 4,
        alignSelf: "center",
      },
    }
