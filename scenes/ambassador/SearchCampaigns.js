import React from 'react';
import { StyleSheet, Text, Button, TextInput, ScrollView, Dimensions, View } from 'react-native';
import { ButtonGroup, Icon, ListItem, Divider } from 'react-native-elements';
import SearchInput, { createFilter } from 'react-native-search-filter';
import c from '../../assets/palette.js';
import io from 'socket.io-client'
const socket = io('http://localhost:8080');

import Header from '../../components/header.js'

var campaigns=[];

export default class SearchCampaigns extends React.Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      search: '',
      campaigns: [],
      keys: ['name', 'description', 'business', 'businessDesc', 'event.description'],
      ambassador: navigation.getParam('ambassador', '')
    }
  }

  componentWillMount(){
    socket.emit('get all campaigns');
  }

  componentDidMount(){
    const self = this;
    socket.on('found all campaigns', function(resp){
      self.setState({campaigns: resp});
    })
  }

  render() {
    const filteredCampaigns= this.state.campaigns.filter(createFilter(this.state.search, this.state.keys))
    return (
      <View style={styles.screen} styleName="fill-parent">
        <Header toProfile={(e)=>this.props.navigation.navigate('AmbassadorProf', {newProp: "newProp"})}></Header>

        <ScrollView
          style={{flex:1, top:70}}>
          <View style={styles.container}>
                        <View style={styles.info}>
                          <Text style={styles.h2}>Campaigns</Text>
            <View style={{marginTop:10, marginBottom:10}}>
              <SearchInput
          onChangeText={(term) => { this.setState({search: term}) }}
          style={styles.input}
          placeholder="Search"
          fuzzy={true}
          sortResults={true}
          />
              {filteredCampaigns.map((campaign, i)=>(
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
                      <Text style={styles.h3Left}>{campaign.event.address}</Text>
                      <Text style={styles.h3Left}>${campaign.price}/referral</Text>
                    </View>
                  }
                  onPress={(e)=>this.props.navigation.navigate('AmbassadorViewCampaign', {campaign: campaign, ambassador: this.state.ambassador})}
                />
              ))}
            </View>
          </View>
        </View>
        <View style={{height: 100}}></View>
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
});
