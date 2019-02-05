import React from 'react';
import { StyleSheet, Text, ScrollView, Dimensions, View } from 'react-native';
import { ButtonGroup, Icon, Divider, ListItem, } from 'react-native-elements';
import io from 'socket.io-client'
const socket = io('http://localhost:8080');
import Header from '../../components/header.js'
import c from '../../assets/palette.js';

const campaign = {};
const owner = {};

export default class OwnerViewCampaign extends React.Component {
  componentWillMount(){
    const { navigation } = this.props;
    campaign = navigation.getParam('campaign', '');
    owner = navigation.getParam('owner', '')
  }

  componentDidMount(){
    const self = this;
    socket.on('new campaigns', function(campaigns){
      self.props.navigation.navigate('OwnerProf', {campaigns: campaigns});
    });
  }

  render() {
    return (
      <View style={styles.screen} styleName="fill-parent">
        <Header toProfile={()=>this.props.navigation.navigate('OwnerProf')}></Header>
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
                    {/*<Text style={styles.h3Dark}>{campaign.description}</Text> */}
                  </View>
                    <Text style={styles.h2}>{campaign.typeStr}</Text>
                      <Divider styleName="line" />
                      {Number(campaign.type) === 0 ?
                        <View style={{padding: 5, marginTop: 5}}>
                          <Text style={styles.h3Dark}>{campaign.event.description}</Text>
                          <Text style={styles.h3Dark}>{campaign.event.startDate} - {campaign.event.endDate}</Text>
                          <Text style={styles.h3Dark}>{campaign.event.location.address}</Text>
                        </View>
                      : campaign.type === 1 ? <View></View>
                    : <View></View>
                  }

                    <Text style={styles.h2}>Campaign</Text>
                    <Divider styleName="line" />
                    <View style={{padding: 5, marginTop: 5}}>
                      {/* <Text style={styles.h3Dark}>{campaign.startDate} - {campaign.endDate}</Text> */}
                      <Text style={styles.h3Dark}>${campaign.price} per referral</Text>
                      <Text style={styles.h3Dark}>Goal: {campaign.goal}</Text>
                      <Text style={styles.h3Dark}>Progress: {campaign.progress}</Text>
                    </View>
                    <Text style={styles.h2}>Ambassadors</Text>
                    <Divider styleName="line" />
                    <View style={{marginTop:10, marginBottom:10}}>
                      {campaign.ambassadors.map((ambassador, i)=>(
                        <ListItem
                          title= {ambassador.firstName + ' ' + ambassador.lastName}
                          // rightTitle={ambassador.email}
                          // rightTitleContainerStyle={{width:200}}

                          key={i}
                          //onPress={(e)=>this.props.navigation.navigate('OwnerViewCampaign', {campaign: campaign})}
                          containerStyle={styles.list}
                          rightIcon={{name:"message", style: {padding: 5}}}
                          subtitle={
                            <View style={{flexDirection: "row", marginLeft:20}}>
                              <Text style={styles.h3Dark}>{ambassador.email}</Text>
                            </View>
                          }
                        />
                      ))
                    }
                  </View>


              <ButtonGroup
                onPress={(i)=> {
                  i===0 ? this.props.navigation.navigate('CreateCampaign', {edit: campaign, owner: owner})
                  : socket.emit('delete campaign', campaign);
                }}
                buttons={['Edit', 'Delete']}
                containerStyle={{width:300, margin: 0, alignSelf:"center"}}
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
