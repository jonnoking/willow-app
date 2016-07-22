import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  Alert,
  TextInput
} from 'react-native';

var API_ENDPOINT = 'http://localhost:3000/api/room';
//var API_ENDPOINT = 'https://localhost/room'; // doesn't work

var ProfileView = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.messageBox}>
          <TextInput
        editable = {true}
        maxLength = {4000}
        multiline = {true}
        value={this.props.token.idToken}
        numberOfLines = {5}
        style={styles.tokenBox}
      />
          <Image
            style={styles.avatar}
            source={{uri: this.props.profile.picture}}
          />
          <Text style={styles.title}>Welcome {this.props.profile.name}</Text>
        </View>
        <TouchableHighlight
          style={styles.callApiButton}
          underlayColor='#949494'
          onPress={this._onCallApi}>
          <Text>Call API</Text>
        </TouchableHighlight>
      </View>
    );
  },
  _onCallApi: function() {
    fetch(API_ENDPOINT, {
        method: "GET",
        headers: {
          'Authorization': 'Bearer ' + this.props.token.idToken
        }
      })
      .then((response) => response.text())
      .then((responseText) => {
        Alert.alert(
          'Request Successful',
          JSON.parse(responseText).data[0].name,
          [
            {text: 'OK'},
          ]
        )
      })
      .catch((error) => {
        Alert.alert(
          'Request Failed',
          JSON.stringify(error),
          [
            {text: 'OK'},
          ]
        )
      });
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#15204C',
  },
  messageBox: {
    flex: 1,
    justifyContent: 'center',
  },
  badge: {
    alignSelf: 'center',
    height: 110,
    width: 102,
    marginBottom: 80,
  },
  avatar: {
    alignSelf: 'center',
    height: 128,
    width: 240,
  },
  title: {
    fontSize: 17,
    textAlign: 'center',
    marginTop: 20,
    color: '#FFFFFF',
  },
  callApiButton: {
    height: 50,
    alignSelf: 'stretch',
    backgroundColor: '#D9DADF',
    margin: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tokenBox: {
    alignSelf: 'center',
    fontSize: 17,
    textAlign: 'center',
    marginTop: 20,
    height: 100,
    width: 240,
    color: '#ffffff'
  }
});

module.exports = ProfileView;
