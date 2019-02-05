import React from 'react'
import { StyleSheet, Text, View, Dimensions, ScrollView, Button, RefreshControl } from 'react-native'
import { Icon, Avatar, ButtonGroup, ListItem, Divider } from 'react-native-elements'
import Header from '../../components/header.js'
import c from '../../assets/palette.js';

import io from 'socket.io-client'
const socket = io('http://localhost:8080');


export default class AmbassadorProf extends React.Component {
  constructor(props){
    super(props);
    const { navigation } = props;
    this.state = {
      ambassador: navigation.getParam('ambassador', ''),
      campaigns: navigation.getParam('campaigns', ''),
      refreshing: false,
    }
  }

  refresh(){
    const self = this;
    this.setState({refreshing: true});
    socket.emit('refresh', {
      ambassador: self.state.ambassador._id,
    });
  }

  componentWillMount(){
    this.refresh();
  }

  shouldComponentUpdate(nextProps, nextState) {
    // const { navigation } = nextProps;
    // var left = navigation.getParam('left', false);
    // return !left;
    return true;
  }

  componentDidMount(){
    const self = this;
    socket.on('refreshed ambassador', function(data){
      self.setState({refreshing: false, ambassador: data, campaigns: data.campaigns});
    })
  }

  render() {
    return (
      <View style={styles.screen}>
        <Header toProfile={()=>this.props.navigation.navigate('AmbassadorProf')}></Header>
        <ScrollView
          style={{flex:1, top:70}}
          refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={()=>this.refresh()}
          />}
          >
          <View style={styles.container}>
            <View style={styles.profile}>
              <Avatar
                containerStyle={styles.avatar}
                large
                rounded
                title="EK"
                //onPress={() => console.log("Works!")}
                activeOpacity={0.7}
              />
              <View style={styles.bio}>
                <Text style={styles.h1Left}>{this.state.ambassador.firstName} {this.state.ambassador.lastName}</Text>
                <Text style={styles.h3Light}>{this.state.ambassador.email}</Text>

              </View>
            </View>
            <View style={styles.info}>

              <Text style={styles.h2}>My Campaigns</Text>
              {/* <Divider styleName="line" /> */}
              <View style={{marginTop:10, marginBottom:10}}>
                {this.state.campaigns.map((campaign, i)=>(
                  <ListItem
                    title={campaign.name}
                    key={i}
                    leftIcon={{name: campaign.icon}}
                    containerStyle={styles.list}
                    subtitle={
                      <View style={{flexDirection: "column"}}>
                        <Text style={styles.h3Left}>{campaign.business}</Text>
                        <Text style={styles.h3Left}>{campaign.event.description}</Text>
                        <Text style={styles.h3Left}>{campaign.event.startDate} - {campaign.event.endDate} </Text>
                        <Text style={styles.h3Left}>{campaign.event.address} </Text>
                        <Text style={styles.h3Left}>${campaign.price}/referral</Text>
                      </View>
                    }
                    onPress={(e)=>this.props.navigation.navigate('AmbassadorViewCampaign', {campaign: campaign, ambassador: this.state.ambassador})}
                  />
                ))}
              </View>
              <ButtonGroup
                onPress={(i) => this.props.navigation.navigate('SearchCampaigns', {ambassador:this.state.ambassador})}
                buttons={['Browse Campaigns']}
                containerStyle={{width:200, margin: 15, alignSelf: "center"}}
              />
              <ButtonGroup
                onPress={(i) => this.props.navigation.navigate('EditAmbassadorProf', {ambassador: this.state.ambassador})}
                buttons={['Edit Profile']}
                containerStyle={{width:200, margin: 15, alignSelf: "center"}}
              />
              <View style={{height:100}}></View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
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
    alignItems: "flex-start",
    flex: 1,
  },
  info: {
    flex: 1,
    width: width,
    borderRadius: 0,
    borderWidth: 0,
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
  h1Left: {
    fontSize: 28,
    color: "gray",
    textAlign: "left",
    fontFamily: "Heebo-Bold",
  },
  h2: {
    fontSize: 20,
    color: c.purple3,
    textAlign: "left",
    paddingTop: 5,
    fontFamily: "Heebo",
  },
  h3: {
    fontSize: 14,
    color: "gray",
    textAlign: "left",
    fontFamily: "Heebo",
  },
  h3Left: {
    fontSize: 14,
    color: "gray",
    textAlign: "left",
    fontFamily: "Heebo",
  },
  h3Right: {
    fontSize: 14,
    color: "gray",
    textAlign: "right",
    fontFamily: "Heebo",
  },
  h3Light: {
    fontSize: 14,
    color: c.gray2,
    textAlign: "left",
    fontFamily: "Heebo",
    marginLeft: 5,
    marginRight: 5,
  },
});
