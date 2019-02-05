import React from 'react'
import { StyleSheet, Text, View, Dimensions, ScrollView, Button } from 'react-native'
import { Icon, Avatar, ButtonGroup, ListItem, Divider } from 'react-native-elements'
import Header from '../../components/header.js'
import c from '../../assets/palette.js';

import io from 'socket.io-client'
const socket = io('http://localhost:8080');

var owner = {};
var campaigns = [];

export default class OwnerProf extends React.Component {

  componentWillMount(){
    this.updateProps(this.props);
  }

  shouldComponentUpdate(nextProps, nextState){
    this.updateProps(nextProps);
    return true;
  }

  updateProps(props){
    const { navigation } = props;
    campaigns = navigation.getParam('campaigns', '');
    owner = navigation.getParam('owner', '');
  }

  render() {

    return (
      <View style={styles.screen}>
        <Header toProfile={()=>this.props.navigation.navigate('OwnerProf')}></Header>
        <ScrollView
          style={{flex:1, top:70}}>
          <View style={styles.container}>
            <View style={styles.profile}>
              <Avatar
                containerStyle={styles.avatar}
                large
                rounded
                title={owner.firstName.substring(0,1) + owner.lastName.substring(0,1)}
                //onPress={() => console.log("Works!")}
                activeOpacity={0.7}
              />
              <View style={styles.bio}>
                <Text style={styles.h1Left}>{owner.businessName}</Text>
                <Text style={styles.h3Light}>{owner.businessDesc}</Text>
              </View>
            </View>
            <View style={styles.info}>
              <Text style={styles.h2}>Owner</Text>
              <Divider styleName="line" />
              <View style={{padding: 5, marginTop: 5}}>
                <Text style={styles.h3Dark}>{owner.firstName} {owner.lastName}</Text>
                <Text style={styles.h3Dark}>{owner.email}</Text>
              </View>
              <Text style={styles.h2}>Contact</Text>
              <Divider styleName="line" />
              <View style={{padding: 5, marginTop: 5}}>
                <Text style={styles.h3Dark}>{owner.businessAddress}</Text>
                <Text style={styles.h3Dark}>{owner.businessEmail}</Text>
              </View>
              <Text style={styles.h2}>My Campaigns</Text>
              <Divider styleName="line" />
              <View style={{marginTop:10, marginBottom:10}}>
                {campaigns.map((campaign, i)=>(
                  <ListItem
                    title={campaign.name}
                    key={i}
                    leftIcon={{name: campaign.icon}}
                    onPress={(e)=>this.props.navigation.navigate('OwnerViewCampaign', {campaign: campaign, owner: owner})}
                    containerStyle={styles.list}
                    subtitle={
                      <View style={{flexDirection: "column"}}>
                        <Text style={styles.h3Dark}>{campaign.business}</Text>
                        <Text style={styles.h3Dark}>{campaign.event.description}</Text>
                        <Text style={styles.h3Dark}>{campaign.event.startDate} - {campaign.event.endDate} </Text>
                        <Text style={styles.h3Dark}>{campaign.event.address}</Text>
                        <Text style={styles.h3Dark}>${campaign.price}/referral</Text>
                      </View>
                    }
                  />
                ))}
              </View>
              <ButtonGroup
                onPress={(i)=>this.props.navigation.navigate('CreateCampaign', {owner: owner})}
                buttons={['Create a Campaign']}
                containerStyle={{width:200, margin: 20, alignSelf: "center"}}
              />
              <ButtonGroup
                onPress={(i)=>this.props.navigation.navigate('EditOwnerProf', {owner: owner})}
                buttons={['Edit Profile']}
                containerStyle={{width:200, margin: 15, alignSelf: "center"}}
              />
            </View>
            <View style={{height:100}}></View>
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
  h1Left: {
    fontSize: 36,
    color:c.gray5,
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
  h3Dark: {
    fontSize: 14,
    color: c.gray5,
    textAlign: "left",
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
  h3Right: {
    fontSize: 14,
    color: c.gray5,
    textAlign: "right",
    fontFamily: "Heebo",
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
});
