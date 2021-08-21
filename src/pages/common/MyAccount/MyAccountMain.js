import { t } from 'i18n-js';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFirebase } from 'react-redux-firebase';
import { useNavigation } from '@react-navigation/native';
import { Avatar, List } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
    height: 60,
    justifyContent: 'center',
  },
  infoTextContainer: {
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: '#1A1C28',
  },
  infoText: {
    fontSize: 12,
    marginLeft: 20,
    color: 'gray',
    fontWeight: '500',
  },
});

function InfoText({ text }) {
  return (
    <View style={styles.infoTextContainer}>
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
}

export default function MyAccountMain() {
  const avatar = 'https://i.imgur.com/GfkNpVG.jpg';
  const name = 'Laureano López';
  const address = {
    streetA: 'Abbott Shoals',
    streetB: '505 Winona Place',
    streetC: '4306 Hudson Street Suite 875',
    streetD: 'Suite 489',
    city: 'Santa Fe',
    state: 'Santa Fe',
    country: 'Argentina',
    zipcode: '41428-0189',
    geo: {
      lat: '-75.8513',
      lng: '81.3262',
    },
  };

  const firebase = useFirebase();
  const navigation = useNavigation();

  async function logout() {
    await firebase.logout();
    navigation.navigate('AuthNavigator');
  }

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.userRow}>
        <View style={styles.userImage}>
          <Avatar.Image rounded size={90} source={{ uri: avatar }} />
        </View>
        <View>
          <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>
            {name}
          </Text>
          <Text style={{ color: 'white', fontSize: 14 }}>
            {address.city}, {address.country}{' '}
            <MaterialCommunityIcons
              name="map-marker"
              size={14}
              color="#F936CC"
            />
          </Text>
        </View>
      </View>

      <InfoText text="CONFIGURACIÓN DE LA CUENTA" />

      <View>
        <List.Item
          title="Datos personales"
          titleStyle={{ color: 'white', fontSize: 16, fontWeight: '500' }}
          onPress={() => navigation.navigate(t('personalInformation'))}
          style={styles.listItemContainer}
          right={() => (
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={24}
              color="white"
            />
          )}
        />
        <List.Item
          title="Ubicación"
          titleStyle={{ color: 'white', fontSize: 16, fontWeight: '500' }}
          style={styles.listItemContainer}
          right={() => (
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={24}
              color="white"
            />
          )}
        />
        <List.Item
          title="Pagos y cobros"
          titleStyle={{ color: 'white', fontSize: 16, fontWeight: '500' }}
          style={styles.listItemContainer}
          right={() => (
            <MaterialCommunityIcons
              name="cash-multiple"
              size={24}
              color="white"
            />
          )}
        />
      </View>

      <InfoText text="ASISTENCIA" />
      <View>
        <List.Item
          title="Tengo un problema"
          titleStyle={{ color: 'white', fontSize: 16, fontWeight: '500' }}
          style={styles.listItemContainer}
          right={() => (
            <MaterialCommunityIcons
              name="alert-outline"
              size={24}
              color="white"
            />
          )}
        />
        <List.Item
          title="Términos de servicio"
          titleStyle={{ color: 'white', fontSize: 16, fontWeight: '500' }}
          style={styles.listItemContainer}
          right={() => (
            <MaterialCommunityIcons
              name="file-document-outline"
              size={24}
              color="white"
            />
          )}
        />
        <List.Item
          title="Cerrar sesión"
          titleStyle={{ color: '#FF6E6E', fontSize: 16, fontWeight: '500' }}
          onPress={logout}
          style={styles.listItemContainer}
          right={() => (
            <MaterialCommunityIcons
              name="login-variant"
              size={24}
              color="#FF6E6E"
            />
          )}
        />
      </View>
    </ScrollView>
  );
}
