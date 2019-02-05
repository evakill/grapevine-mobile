import React from 'react';
import { StyleSheet, Text, TextInput, Button, ScrollView, Dimensions } from 'react-native';
import { ButtonGroup, Icon, FormLabel } from 'react-native-elements';
import { View } from '@shoutem/ui'
import { Textarea } from 'native-base'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DatePicker from 'react-native-datepicker'
import NumericInput from 'react-native-numeric-input'
import moment from 'moment'
import c from '../../assets/palette.js';

import io from 'socket.io-client'
const socket = io('http://localhost:8080');

import Header from '../../components/header.js'

export default class CreateCampaign extends React.Component {
  constructor(props) {
    super(props);

    const { navigation } = this.props;
    const owner = navigation.getParam('owner', '');
    const edit = navigation.getParam('edit', '');

    if(edit) {
      this.state = {
        id: edit._id,
        name: edit.name,
        today: moment().format('MMMM Do YYYY'),
        startDate: edit.startDate,
        endDate: edit.endDate,
        description: edit.description,
        goal: edit.goal,
        type: Number(edit.type),
        typeStr: edit.typeStr,
        owner: owner._id,
        business: owner.businessName,
        businessDesc: owner.businessDesc,
        price: edit.price,
        form: 'Edit',
        page: 1,
        eventDescription: edit.event.description,
        eventStartDate: edit.event.startDate,
        eventEndDate: edit.event.endDate,
        eventLocation: edit.event.location,
        eventAddress: edit.event.address,
        eventPrice: edit.event.price,
        valid1: true,
        valid2: true,
      }
      } else {
      this.state = {
        name: '',
        today: moment().format('MMMM Do YYYY'),
        startDate: moment().format('MMMM Do YYYY'),
        endDate: moment().format('MMMM Do YYYY'),
        description: 'none',
        goal: 0,
        type: 0,
        typeStr: 'Event',
        owner: owner,
        price: 0,
        form: 'Create',
        page: 1,
        eventDescription: '',
        eventStartDate: moment().format('MMMM Do, YYYY, h:mm a'),
        eventEndDate: moment().format('MMMM Do, YYYY, h:mm a'),
        eventLocation: null,
        eventPrice: 0,
        valid1: true,
        valid2: true,
      };
    }
  }

  componentDidMount(){
    const self = this;
    socket.on('new campaigns', function(campaigns){
      self.props.navigation.navigate('OwnerProf', {campaigns: campaigns});
    });
  }

  create(){
    (this.state.form === 'Edit') ? socket.emit('edit campaign', this.state)
    : socket.emit('create campaign', this.state)
  }

  render() {
    return (
      <View style={styles.screen} styleName="fill-parent">
        <Header toProfile={(e)=>this.props.navigation.navigate('OwnerProf')}></Header>
        <ScrollView
          style={{flex:1}}>
          <View style={styles.form}>
            <Text style={styles.h1}>{ this.state.form === 'Create' ? "Create a Campaign" : "Edit Campaign"}</Text>

            {/* { this.state.page === 1 ?
              (<View> */}
                {/* <FormLabel labelStyle={styles.h2}>Referral Type</FormLabel>
                <ButtonGroup
                  onPress={(i)=> {
                    var str = '';
                    i===0 ?  str='Event' : i===1 ? str='Sale' : str='Promotion'
                    this.setState({type: i, typeStr: str})
                  }}
                  buttons={['Event', 'Sale', 'Promotion']}
                  selectedBackgroundColor={c.gray5}
                  selectedIndex={Number(this.state.type)}
                  containerStyle={{width:325, margin: 0}}
                /> */}

                {/* <FormLabel labelStyle={styles.h2}>Campaign Name</FormLabel>
                <TextInput style={styles.input}
                  placeholder='Name'
                  onChangeText={(text)=>this.setState({name: text})}
                  value={this.state.name}
                />
                <FormLabel labelStyle={styles.h2}>Campaign Description</FormLabel>
                <TextInput style={styles.textarea}
                  multiline = {true}
                  numberOfLines = {4}
                  placeholder='Description'
                  onChangeText={(text)=>this.setState({description: text})}
                  value={this.state.description}
                />

                <FormLabel labelStyle={styles.h2}>Campaign Start Date</FormLabel>
                <DatePicker
                  style={{width:325, alignSelf: "center"}}
                  date={this.state.startDate}
                  mode="date"
                  placeholder="select date"
                  format="MMMM Do YYYY"
                  minDate={this.state.today}
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      marginLeft: 0
                    },
                    dateInput: {
                      height: 40,
                      width: 325,
                      borderColor: c.gray3,
                      borderRadius: 2,
                      borderWidth: 1,
                      backgroundColor: c.gray2,
                    }}}
                    onDateChange={(date) => {this.setState({startDate: date})}}
                  />
                  <FormLabel labelStyle={styles.h2}>Campaign End Date</FormLabel>
                  <DatePicker
                    style={{width:325, alignSelf: "center"}}
                    date={this.state.endDate}
                    mode="date"
                    placeholder={this.state.startDate || 'endDate'}
                    format="MMMM Do YYYY"
                    minDate={this.state.startDate || today}
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateIcon: {
                        position: 'absolute',
                        left: 0,
                        top: 4,
                        marginLeft: 0
                      },
                      dateInput: {
                        height: 40,
                        width: 325,
                        borderColor: c.gray3,
                        borderRadius: 2,
                        borderWidth: 1,
                        backgroundColor: c.gray2,
                      }}}
                      onDateChange={(date) => {this.setState({endDate: date})}}
                    /> */}

                    {/* <FormLabel labelStyle={styles.h2}>Referral Rate</FormLabel>
                    <NumericInput
                      value={this.state.price}
                      onChange={price => this.setState({price})}
                      totalWidth={325}
                      totalHeight={40}
                      iconSize={25}
                      step={1}
                      valueType='real'
                      rounded
                      textColor={c.gray5}
                      borderColor= {c.gray3}
                      iconStyle={{ color: c.gray5 }}
                      upDownButtonsBackgroundColor={c.gray2}
                      type="up-down"
                      containerStyle={{margin: 5, marginLeft: 10,}}
                      minValue={0}
                    />

                    <FormLabel labelStyle={styles.h2}>Referral Goal</FormLabel>
                    <NumericInput
                      value={this.state.goal}
                      onChange={goal => this.setState({goal})}
                      totalWidth={325}
                      totalHeight={40}
                      iconSize={25}
                      step={1}
                      valueType='real'
                      rounded
                      textColor={c.gray5}
                      borderColor= {c.gray3}
                      iconStyle={{ color: c.gray5 }}
                      upDownButtonsBackgroundColor={c.gray2}
                      type="up-down"
                      containerStyle={{margin: 5, marginLeft: 10,}}
                      minValue={0}
                    /> */}
                    {/* <ButtonGroup
                      onPress={(i) => {
                        i===0 ? this.props.navigation.navigate('OwnerProf')
                        : (this.state.name && this.state.description && this.state.typeStr) ? this.setState({page: 2})
                        : this.setState({valid1: false})
                        }}
                      buttons={['Cancel', 'Next']}
                      containerStyle={{width:200, margin: 20, alignSelf: "center"}}
                    /> */}

                    {/* {this.state.valid1 ? <View></View>
                      : <FormLabel labelStyle={styles.h2}>Please enter all required fields.</FormLabel>}
                      <View style={{padding: 15}}></View>
                    </View>)

                    : Number(this.state.type) === 0 ? */}
                    (<View>
                      <FormLabel labelStyle={styles.h2}>Event Name</FormLabel>
                      <TextInput style={styles.input}
                        placeholder='Name'
                        onChangeText={(text)=>this.setState({name: text})}
                        value={this.state.name}
                      />
                      <FormLabel labelStyle={styles.h2}>Event Description</FormLabel>
                      <TextInput style={styles.textarea}
                        multiline = {true}
                        numberOfLines = {4}
                        placeholder='Description'
                        onChangeText={(text)=>this.setState({eventDescription: text})}
                        value={this.state.eventDescription}
                      />
                      <FormLabel labelStyle={styles.h2}>Event Start Date</FormLabel>
                      <DatePicker
                        style={{width:325, alignSelf: "center"}}
                        date={this.state.eventStartDate}
                        mode="datetime"
                        placeholder="select date"
                        format="MMMM Do, YYYY, h:mm a"
                        minDate={moment().format('MMMM Do, YYYY, h:mm a')}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                          dateIcon: {
                            position: 'absolute',
                            left: 0,
                            top: 4,
                            marginLeft: 0
                          },
                          dateInput: {
                            height: 40,
                            width: 325,
                            borderColor: c.gray3,
                            borderRadius: 2,
                            borderWidth: 1,
                            backgroundColor: c.gray2,
                          }}}
                          onDateChange={(date) => {this.setState({eventStartDate: date})}}
                        />
                        <FormLabel labelStyle={styles.h2}>Event End Date</FormLabel>
                        <DatePicker
                          style={{width:325, alignSelf: "center"}}
                          date={this.state.eventEndDate}
                          mode="datetime"
                          placeholder="select date"
                          format="MMMM Do, YYYY, h:mm a"
                          minDate={this.state.eventStartDate || moment().format('MMMM Do, YYYY, h:mm a')}
                          confirmBtnText="Confirm"
                          cancelBtnText="Cancel"
                          customStyles={{
                            dateIcon: {
                              position: 'absolute',
                              left: 0,
                              top: 4,
                              marginLeft: 0
                            },
                            dateInput: {
                              height: 40,
                              width: 325,
                              borderColor: c.gray3,
                              borderRadius: 2,
                              borderWidth: 1,
                              backgroundColor: c.gray2,
                            }}}
                            onDateChange={(date) => {this.setState({eventEndDate: date})}}
                          />

                            <FormLabel labelStyle={styles.h2}>Event Location</FormLabel>
                          <GooglePlacesAutocomplete
                            placeholder={this.state.eventAddress || 'enter an adress'}
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
                            onPress={(data, details) => {
                              this.setState({eventLocation: {
                                lat: details.geometry.location.lat,
                                long: details.geometry.location.lng,
                              },
                            eventAddress: details.formatted_address});
                            }}
                          />

                          <FormLabel labelStyle={styles.h2}>Cost to Attend</FormLabel>
                          <NumericInput
                            value={this.state.eventPrice}
                            onChange={price => this.setState({eventPrice: price})}
                            totalWidth={325}
                            totalHeight={40}
                            iconSize={25}
                            step={1}
                            valueType='real'
                            rounded
                            textColor={c.gray5}
                            borderColor= {c.gray3}
                            iconStyle={{ color: c.gray5 }}
                            upDownButtonsBackgroundColor={c.gray2}
                            type="up-down"
                            containerStyle={{margin: 5, marginLeft: 10,}}
                            minValue={0}
                          />

                          <FormLabel labelStyle={styles.h2}>Referral Rate</FormLabel>
                          <NumericInput
                            value={this.state.price}
                            onChange={price => this.setState({price})}
                            totalWidth={325}
                            totalHeight={40}
                            iconSize={25}
                            step={1}
                            valueType='real'
                            rounded
                            textColor={c.gray5}
                            borderColor= {c.gray3}
                            iconStyle={{ color: c.gray5 }}
                            upDownButtonsBackgroundColor={c.gray2}
                            type="up-down"
                            containerStyle={{margin: 5, marginLeft: 10,}}
                            minValue={0}
                          />

                          <FormLabel labelStyle={styles.h2}>Referral Goal</FormLabel>
                          <NumericInput
                            value={this.state.goal}
                            onChange={goal => this.setState({goal})}
                            totalWidth={325}
                            totalHeight={40}
                            iconSize={25}
                            step={1}
                            valueType='real'
                            rounded
                            textColor={c.gray5}
                            borderColor= {c.gray3}
                            iconStyle={{ color: c.gray5 }}
                            upDownButtonsBackgroundColor={c.gray2}
                            type="up-down"
                            containerStyle={{margin: 5, marginLeft: 10,}}
                            minValue={0}
                          /> 


                          {this.state.valid2 ? <View></View>
                            : <FormLabel labelStyle={styles.h2}>Please enter all required fields.</FormLabel>}

                          <ButtonGroup
                            onPress={(i) => i===0 ? this.props.navigation.navigate('OwnerProf') :
                            (this.state.name &&
                              this.state.eventDescription &&
                              this.state.eventLocation) ? this.create() :
                            this.setState({valid2: false})}
                            buttons={['Cancel', 'Save']}
                            containerStyle={{width:200, margin: 20, alignSelf: "center"}}
                          />
                          <View style={{padding: 15}}></View>
                        </View>)
                        : <View></View>
                      }
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
            textarea: {
              margin: 5,
              marginLeft: 10,
              height: 100,
              width: 325,
              borderColor: c.gray3,
              borderRadius: 2,
              borderWidth: 1,
              backgroundColor: c.gray2,
              color: c.gray5,
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
          }
