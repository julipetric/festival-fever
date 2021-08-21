import React, { Component } from 'react'
import { ScrollView, Switch, StyleSheet, Text, View } from 'react-native'
import { Avatar, ListItem } from 'react-native-elements'
import PropTypes from 'prop-types'
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import InfoText from './InfoText'

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: '#20222D',
  },
  userRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 16,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 16,
  },
  userImage: {
    marginRight: 12,
  },
  listItemContainer: {
    backgroundColor: '#20222D',
    height: 70,
  },
})

class SettingsScreen extends Component {
  static propTypes = {
    avatar: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    navigation: PropTypes.object.isRequired,
    address: PropTypes.shape({
      city: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired,
    }).isRequired,
  }

  state = {
    pushNotifications: true,
  }

  onPressSetting = () => {
    this.props.navigation.navigate('Options')
  }

  onChangePushNotifications = () => {
    this.setState(state => ({
      pushNotifications: !state.pushNotifications,
    }))
  }

  render() {
    const { avatar, name, address } = this.props
    return (
      <ScrollView style={styles.scroll}>
        <View style={styles.userRow}>
          <View style={styles.userImage}>
            <Avatar
              rounded
              size="large"
              source={{uri: avatar}}
            />
          </View>
          <View>
            <Text style={{ color: 'white', fontSize: 24 }}><b>{name}</b></Text>
            <Text style={{ color: 'white', fontSize: 14 }}>
              {address.city}, {address.country} <MaterialCommunityIcons name="map-marker" size={14} color="#F936CC" />
            </Text>
          </View>
        </View>
        <InfoText text="CONFIGURACIÓN DE LA CUENTA" />
        <View>
          <ListItem
            title="Datos personales"
            titleStyle={{ color: 'white', fontSize: 16, fontWeight: 500 }}
            onPress={() => this.onPressSetting()}
            containerStyle={styles.listItemContainer}
            rightIcon={
              <MaterialCommunityIcons name="account-circle-outline" size={24} color="white" />
            }
          />
          <ListItem
            title="Ubicación"
            titleStyle={{ color: 'white', fontSize: 16, fontWeight: 500 }}
            onPress={() => this.onPressSetting()}
            containerStyle={styles.listItemContainer}
            rightIcon={
              <MaterialCommunityIcons name="map-marker-outline" size={24} color="white" />
            }
          />
          <ListItem
            title="Pagos y cobros"
            titleStyle={{ color: 'white', fontSize: 16, fontWeight: 500 }}
            onPress={() => this.onPressSetting()}
            containerStyle={styles.listItemContainer}
            rightIcon={
              <MaterialCommunityIcons name="cash-multiple" size={24} color="white" />
            }
          />
        </View>

        <InfoText text="ASISTENCIA" />
        <View>
          <ListItem
            title="Tengo un problema"
            titleStyle={{ color: 'white', fontSize: 16, fontWeight: 500 }}
            onPress={() => this.onPressSetting()}
            containerStyle={styles.listItemContainer}
            rightIcon={
              <MaterialCommunityIcons name="alert-outline" size={24} color="white" />
            }
          />
          <ListItem
            title="Términos de servicio"
            titleStyle={{ color: 'white', fontSize: 16, fontWeight: 500 }}
            onPress={() => this.onPressSetting()}
            containerStyle={styles.listItemContainer}
            rightIcon={
              <MaterialCommunityIcons name="file-document-outline" size={24} color="white" />
            }
          />
          <ListItem
            title="Cerrar sesión"
            titleStyle={{ color: '#FF6E6E', fontSize: 16, fontWeight: 500 }}
            onPress={() => this.onPressSetting()}
            containerStyle={styles.listItemContainer}
            rightIcon={
              <MaterialCommunityIcons name="login-variant" size={24} color="#FF6E6E" />
            }
          />
        </View>
      </ScrollView>
    )
  }
}

export default SettingsScreen
