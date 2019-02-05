import React from 'react';
import { StyleSheet, Text, ScrollView, Dimensions, View, Share } from 'react-native';
import { Button, ButtonGroup, Icon, Divider, ListItem, SocialIcon } from 'react-native-elements';
import io from 'socket.io-client'
const socket = io('http://localhost:8080');
import Header from '../../components/header.js'
import c from '../../assets/palette.js';

var campaign = {};
var ambassador = {};
var collab = {};
var token = '';

export default class AmbassadorViewCampaign extends React.Component {
  constructor(props){
    super(props);
    const { navigation } = this.props;
    campaign = navigation.getParam('campaign', '');
    ambassador = navigation.getParam('ambassador', '');
    const joined = campaign.ambassadors.find((item)=>item._id===ambassador._id) || campaign.ambassadors.find((id)=>id===ambassador._id);
    console.log('constructor', joined)
    if(joined) socket.emit('get collab', {campaign: campaign, ambassador: ambassador});
    this.state = {
      joined: joined,
      token: token,
      ambassador: navigation.getParam('ambassador', ''),
      campaign: navigation.getParam('campaign', ''),
    }
  }

  componentDidMount(){
    const self = this;
    socket.on('found collab', function(collab){
      console.log('found collab socket');
      if(collab) self.setState({token: collab._id});
    })
    socket.on('joined campaign', function(data){
      campaign = data.campaign;
      ambassador = data.ambassador;
      self.setState({joined: true, token: data.collab._id, ambassador: ambassador, campaign:campaign})
    });
    socket.on('left campaign', function(ambassador){
      console.log('ambassador after left', ambassador);
      self.props.navigation.navigate('AmbassadorProf', {left: true, ambassador: ambassador, campaigns: ambassador.campaigns})
    });
  }

  share(){
    var self =this;
    Share.share(
      {
        message: "Heard it through the Grapevine that...",
        url: `http://localhost:8080/checkin/?token=${self.state.token}`,
      }).then(result => console.log(result)).catch(errorMsg => console.log(errorMsg));
    }

    render() {
      return (
        <View style={styles.screen} styleName="fill-parent">
          <Header toProfile={(e)=>this.props.navigation.navigate('AmbassadorProf')}></Header>
          <ScrollView
            style={{flex:1, top:70}}>
            <View style={styles.container}>
              <View style={styles.info}>
                <View style={styles.bio}>
                  <Text style={styles.h1}>
                    <Icon
                      name={campaign.icon}
                      iconStyle={{padding: 5, marginBottom: 5}}
                      color={c.gray4}>
                    </Icon>
                    {campaign.name}</Text>
                    {/* <Text style={styles.h3Dark}>{campaign.description}</Text> */}
                  </View>
                  <Text style={styles.h2}>{campaign.typeStr}</Text>
                  <Divider styleName="line" />
                  {Number(campaign.type) === 0 ?
                    <View style={{padding: 5, marginTop: 5}}>
                      <Text style={styles.h3Dark}>{campaign.event.description}</Text>
                      <Text style={styles.h3Dark}>{campaign.event.startDate} - {campaign.event.endDate}</Text>
                      <Text style={styles.h3Dark}>{campaign.event.address}</Text>
                    </View>
                    : campaign.type === 1 ? <View></View>
                    : <View></View>
                  }
                  <Text style={styles.h2}>Business</Text>
                  <Divider styleName="line" />
                  <View style={{padding: 5, marginTop: 5}}>
                    <Text style={styles.h3Dark}>{campaign.business}</Text>
                    <Text style={styles.h3Dark}>{campaign.businessDesc}</Text>
                  </View>
                  <Text style={styles.h2}>Campaign</Text>
                  <Divider styleName="line" />
                    <View style={{padding: 5, marginTop: 5}}>
                  {/* <Text style={styles.h3Dark}>{campaign.startDate} - {campaign.endDate}</Text> */}
                  <Text style={styles.h3Dark}>${campaign.price}/referral</Text>
                  <Text style={styles.h3Dark}>Goal: {campaign.goal}</Text>
                  <Text style={styles.h3Dark}>Progress: {campaign.progress}</Text>
                  </View>

                  {this.state.joined ?
                    <View>
                      <View style={styles.joined}>
                        <Text style={styles.h2Center}>Start passing {campaign.name} through the Grapevine!</Text>
                        <Text style={styles.h3Light}> Make sure everyone who you refer checks
                          in at the event using the Geo-Checkin link below:</Text>
                          <Text style={styles.h3Link}>https://localhost:3000/checkin/?token={this.state.token}</Text>
                          <ButtonGroup
                            buttons={['Share']}
                            containerStyle={{
                              width: 200,
                              height: 40,
                              margin: 20,
                              backgroundColor: c.purple1,
                              borderColor: c.purple4,
                              borderRadius: 2,
                              borderWidth: 0,
                              padding: 0,
                              alignSelf: "center"
                            }}
                            textStyle={{color: c.gray1}}
                            onPress={(e)=>this.share(e)}>
                          </ButtonGroup>
                        </View>

                        <View>

                        </View>


                      </View>

                      : <View></View>}

                      <ButtonGroup
                        onPress={(i)=> {this.state.joined ?
                          socket.emit('leave campaign', {ambassador: this.state.ambassador, campaign: this.state.campaign, token: this.state.token}) :
                          socket.emit('join campaign', {ambassador: this.state.ambassador, campaign: this.state.campaign})}}
                          buttons={this.state.joined ? ['Leave'] : ['Join']}
                          containerStyle={{width:300, margin: 0, alignSelf: "center"}}
                        />

                      </View>
                      <View style={{height:100}}></View>
                    </View>
                  </ScrollView>
                </View>
              )
            }
          }
          const { width } = Dimensions.get('window')

          const styles = StyleSheet.create({
            screen: {
              display: "flex",
              flex: 1,
              backgroundColor: c.green2,
            },
            container: {
              flex: 1,
            },
            profile: {
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 5,
              marginTop: 5,
            },
            avatar: {
              margin: 15,
              height: 100,
              width: 100,
              borderRadius: 200,
            },
            bio: {
              alignItems: "center",
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
            },
            list: {
              left: -15,
              backgroundColor: c.gray1,
              flex: 1,
              width: width,
              borderWidth: .5,
              borderColor: c.gray2,
            },
            h1: {
              fontSize: 36,
              color:c.gray5,
              textAlign: "center",
              fontFamily: "Heebo-Bold",
            },
            h2: {
              fontSize: 20,
              color: c.purple3,
              textAlign: "left",
              paddingTop: 5,
              fontFamily: "Heebo",
            },
            h2Center: {
              fontSize: 18,
              color: 'white',
              textAlign: "center",
              fontFamily: "Heebo-Bold",
            },
            h3Dark: {
              fontSize: 14,
              color: c.gray5,
              textAlign: "left",
              fontFamily: "Heebo",
            },
            h3Light: {
              fontSize: 14,
              color: c.gray1,
              textAlign: "center",
              fontFamily: "Heebo",
            },
            h3Right: {
              fontSize: 14,
              color: c.gray5,
              textAlign: "right",
              fontFamily: "Heebo",
            },
            h3Link: {
              fontSize: 14,
              color: c.gray2,
              textAlign: "center",
              fontFamily: "Heebo",
              textDecoration: "underline",
            },
            info: {
              flex: 1,
              width: width,
              backgroundColor: c.gray1,
              padding: 15,
            },
            list: {
              left: -15,
              backgroundColor: c.gray1,
              flex: 1,
              width: width,
              borderWidth: .5,
              borderColor: c.gray2,
            },
            joined: {
              backgroundColor: c.purple3,
              padding: 15,
              alignSelf: "center",
              margin: 20,

            }
          });
