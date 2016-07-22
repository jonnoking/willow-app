// based on
//http://moduscreate.com/react-native-listview-with-section-headers/
//https://github.com/ModusCreateOrg/rn-listview-sections-blog/blob/master/index.ios.js

// input from
//https://www.raywenderlich.com/126063/react-native-tutorial

'use strict';

import React from 'react';
import {
  AppRegistry,
  Component,
  Text,
  StyleSheet,
  Platform,
  View,
  TouchableHighlight,
  ListView,
  TouchableOpacity,
  AlertIndicator,
  ActivityIndicator,
  AlertIOS,
} from 'react-native'; 

//https://www.npmjs.com/package/recursive-iterator
var RecursiveIterator = require('recursive-iterator');

//https://www.npmjs.com/package/type-detect
var typeDectect = require('type-detect');

var API_URL = 'http://demo9383702.mockable.io/users';
class ProfilePropertiesView extends React.Component
{
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
        this.bindMethods();
    }

    bindMethods() {
        if (! this.bindableMethods) {
            return;
        }   

        for (var methodName in this.bindableMethods) {
            this[methodName] = this.bindableMethods[methodName].bind(this);
        }
    }

    getInitialState() {
        var getSectionData = (dataBlob, sectionID) => {
            return dataBlob[sectionID];
        }

        var getRowData = (dataBlob, sectionID, rowID) => {
            //return dataBlob[sectionID + ':' + rowID];
            
            // no sections - there is a default section
            // there is a default section s1
            return dataBlob[sectionID][rowID];
        }

        return {
            loaded : false,
            dataSource : new ListView.DataSource({
                //getSectionData          : getSectionData,
                getRowData              : getRowData,
                rowHasChanged           : (row1, row2) => row1 !== row2,
                //sectionHeaderHasChanged : (s1, s2) => s1 !== s2
            })
        }
    }

    // lifecycle event - called after render
    componentDidMount() {
        //this.fetchData();
        this.bindProfile();
    }

    bindProfile() {
        var profile = {};
        var profileParent = "";
        if (this.props.profileProp) {
            profile = this.props.profileProp.node;
            profileParent = this.props.profileParent;
        } else {
            profile = require('../profile-data');
        }
        var dataBlob = {};
        var sectionIDs = [];
        var rowIDs = [];

        var i = 0;
        for(let {node, path, key, parent, deep} of new RecursiveIterator(profile, 0, true, 1)) {
                        
            var prop = {};
            prop.key = key;
            prop.path = path; // need to get parent and construct full path
            prop.node = node;
            prop.parent = parent;
            if (profileParent.length > 0) {
                prop.parentPath = profileParent + "." + key;
            } else {
                prop.parentPath = key;
            }
            prop.stringify = JSON.stringify(node);
            
            switch(typeDectect(node))
            {
                case "array":
                    prop.value = JSON.stringify(node);
                    prop.type = 'array';
                    break;
                case 'object':
                    prop.value = JSON.stringify(node);
                    prop.type = 'object';
                    break;
                case 'date':
                    prop.value = node.toString();
                    prop.type = 'date';
                    break;
                case 'null':
                    prop.value = '';
                    prop.type = 'null';
                    break;
                case 'undefined':
                    prop.value = '';
                    prop.type = 'undefined';
                    break;
                case 'string':
                default:
                    prop.value = node.toString();
                    prop.type = 'string';            
            }                   
            
            // console.log(path.join('.'), JSON.stringify(node));
            rowIDs.push(path.join('.'));
            dataBlob[path.join('.')] = prop;

            
            //dataBlob[i] = "Jonno";

            // if (Object.prototype.toString(profile[key]) !== 'Object') {
            //     dataBlob[path.join('.')] = profile[key];
            // } else {
            //     dataBlob[path.join('.')] = "Object";
            // }
            i++;
        } 

        
        this.setState({
            dataSource : this.state.dataSource.cloneWithRows(dataBlob),            
            loaded     : true
        });

    }

    fetchProfile() {
        fetch(API_ENDPOINT, {
        method: "GET",
        headers: {
          'Authorization': 'Bearer ' + this.props.token.idToken
        }
      })
      .then((response) => response.json()).then((responseData) => {

          var profile = JSON.parse(responseData);

        for(let {node, path} of new RecursiveIterator(profile)) {
            console.log(path.join('.'), node);
        }


      })
      .catch((error) => {
        Alert.alert(
          'Request Failed',
          JSON.stringify(error),
          [
            {text: 'OK'},
          ]
        )
      })
      .done();
    }

    fetchData () {
        fetch(API_URL).then((response) => response.json()).then((responseData) => {
            var organizations = responseData.results,
                length = organizations.length,
                dataBlob = {},
                sectionIDs = [],
                rowIDs = [],
                organization,
                users,
                userLength,
                user,
                i,
                j;

            for (i = 0; i < length; i++) {
                organization = organizations[i];

                sectionIDs.push(organization.id);
                dataBlob[organization.id] = organization.organization;

                users = organization.users;
                userLength = users.length;
                
                rowIDs[i] = [];

                for(j = 0; j < userLength; j++) {
                    user = users[j].user;
                    rowIDs[i].push(user.md5);

                    dataBlob[organization.id + ':' + user.md5] = user;
                }
            }

            this.setState({
                dataSource : this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
                loaded     : true
            });

        }).done();        
    }

    render() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }

        return this.renderListView();
    }
    
    renderLoadingView() {
        return (
            <View style={styles.header}>
                <Text style={styles.headerText}>User List</Text>
                <View style={styles.container}>
                    <ActivityIndicator
                        animating={!this.state.loaded}
                        style={[styles.activityIndicator, {height: 80}]}
                        size="large"
                    />
                </View>
            </View>
        );
    }

    renderListView() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Profile Properties List</Text>
                </View>
                <ListView
                    dataSource = {this.state.dataSource}
                    style      = {styles.listview}
                    renderRow  = {this.renderRow}
                />
            </View>
        );
    }
//                    renderSectionHeader = {this.renderSectionHeader}

    renderSectionHeader(sectionData, sectionID) {
        return (
            <View style={styles.section}>
                <Text style={styles.text}>{sectionData}</Text>
            </View>
        ); 
    }
};

Object.assign(ProfilePropertiesView.prototype, {
    bindableMethods : {
        renderRow : function (rowData, sectionID, rowID) {
            return (
                <TouchableOpacity onPress={() => this.onPressRow(rowData, sectionID)}>
                    <View style={styles.rowStyle}>
                        <Text style={styles.rowText}>{rowData.path}: {rowData.value}</Text>        
                    </View>
                </TouchableOpacity>
            );
        },
        onPressRow : function (rowData, sectionID) {
            if (rowData.type === 'array' || rowData.type === 'object') {
                this.props.navigator.push({                
                name: 'ProfileProperties',
                    title: rowData.parentPath,
                    passProps: {
                        profileProp: rowData,
                        profileParent: rowData.parentPath
                    }
                });
            }
            
            // var buttons = [
            //     {
            //         text : 'Cancel'
            //     },
            //     {
            //         text    : 'OK',
            //         onPress : () => this.createCalendarEvent(rowData, sectionID)
            //     }
            // ]
            // AlertIOS.alert('{Property type is} ' + rowData.type, null, null);
        }

    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1
    },
    activityIndicator: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3F51B5',
        flexDirection: 'column',
        paddingTop: 25
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white'
    },
    text: {
        color: 'white',
        paddingHorizontal: 8,
        fontSize: 16
    },
    rowStyle: {
        paddingVertical: 20,
        paddingLeft: 16,
        borderTopColor: 'white',
        borderLeftColor: 'white',
        borderRightColor: 'white',
        borderBottomColor: '#E0E0E0',
        borderWidth: 1
    },
    rowText: {
        color: '#212121',
        fontSize: 16
    },
    subText: {
        fontSize: 14,
        color: '#757575'
    },
    section: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 6,
        backgroundColor: '#2196F3'
    }
});

module.exports = ProfilePropertiesView;


