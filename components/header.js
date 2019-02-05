import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { NavigationBar, View, Button } from '@shoutem/ui'
import { Icon } from 'react-native-elements'
import c from '../assets/palette.js';

export default class Header extends React.Component {
  render() {
    return (
      <View style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <NavigationBar
          style={{
            container: {
                backgroundColor: c.green1,
              },
          }}
          styleName="clear"
          leftComponent={
            <Button >
              <Icon name="bars" type="font-awesome" color={c.gray1} iconStyle={styles.icon} size={20}/>
            </Button>}
          centerComponent={<Text style={styles.title}>Grapevine</Text>}
          rightComponent={(
            <Button onPress={this.props.toProfile}>
              <Icon name="user-circle-o" type="font-awesome" color={c.gray1} iconStyle={styles.icon}/>
            </Button>)}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 40,
    fontFamily: 'Muli',
    shadowColor: c.purple4,
    color: c.purple1,
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 1,
    shadowRadius: 0,
    marginBottom: 20,
  },
  container: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 100,
  },
  icon: {
    marginBottom: 15,
  },
});
