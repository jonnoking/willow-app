import React from 'react';
import {
  AppRegistry,
  Component,
  Text,
  StyleSheet,
  Platform,
  View,
  TouchableHighlight
} from 'react-native'; 

var Auth0Lock = require('react-native-lock');
var config = require("../config");

        //   <Image
        //     style={styles.badge}
        //     source={require('./img/badge.png')}
        //   />

var lock = new Auth0Lock(config.auth0);

class WelcomeView extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      // some state
    }
  }
  render()
  {
    // do something
    return (
        <View style={styles.container}>
          <View style={styles.messageBox}>
            <Text style={styles.title}>Auth0 Example</Text>
            <Text style={styles.subtitle}>Identity made simple for Developers</Text>
          </View>
          <TouchableHighlight
            style={styles.signInButton}
            underlayColor='#949494'
            onPress={this._onLogin.bind(this)}>
            <Text>Log In</Text>
          </TouchableHighlight>
        </View>
    );
  }
  _onLogin()  {
    lock.show({
      // authParams: {
      //   scope: 'openid, email, picture'
      // },
      closable: true,
    }, (err, profile, token) => {
      if (err) {
        console.log(err);
        return;
      }
      this.props.navigator.push({
        name: 'ProfileProperties',
        title: "Profile Properties",
        passProps: {
          profile: profile,
          token: token,
        }
      });
    });
  }
}

// var WelcomeView = React.createClass({
//   render: function() {
//     return (
//     );
//   },
// ,
// });

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#15204C',
  },
  messageBox: {
    flex: 1,
    justifyContent: 'center',
  },
  badge: {
    alignSelf: 'center',
    height: 169,
    width: 151,
  },
  title: {
    fontSize: 17,
    textAlign: 'center',
    marginTop: 8,
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 17,
    textAlign: 'center',
    marginTop: 4,
    color: '#FFFFFF',
  },
  signInButton: {
    height: 50,
    alignSelf: 'stretch',
    backgroundColor: '#D9DADF',
    margin: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

module.exports = WelcomeView;


