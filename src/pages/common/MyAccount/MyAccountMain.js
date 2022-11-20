import { t } from 'i18n-js';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFirebase } from 'react-redux-firebase';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import { logout } from '../../../firebase/Auth';

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
  infoText: {
    fontSize: 12,
    paddingLeft: 20,
    color: 'gray',
    fontWeight: '500',
    textTransform: 'uppercase',
    paddingVertical: 14,
    backgroundColor: '#1A1C28',
  },
});

function ListItem({ text, onPress, right, textStyle, testID }) {
  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      style={{
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 14,
      }}
    >
      <Text
        style={[
          { color: 'white', fontSize: 16, opacity: 0.8 },
          { ...textStyle },
        ]}
      >
        {text}
      </Text>
      {right}
    </TouchableOpacity>
  );
}

ListItem.defaultProps = {
  onPress: () => {},
  right: undefined,
  textStyle: {},
  testID: undefined,
};
ListItem.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  right: PropTypes.element,
  textStyle: PropTypes.object,
  testID: PropTypes.string,
};

function MyAccountMain() {
  const dispatch = useDispatch();

  const { profile } = useSelector(state => ({
    profile: state.firebase.profile,
  }));

  const avatar = 'https://i.imgur.com/GfkNpVG.jpg';

  const firebase = useFirebase();
  const navigation = useNavigation();

  async function logoutFunc() {
    await logout(firebase, dispatch);
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
            {profile.name} {profile.lastName}
          </Text>
        </View>
      </View>
      <Text style={styles.infoText}>{t('accountSettings')}</Text>
      <View>
        <ListItem
          text={t('personalInformation')}
          onPress={() => navigation.navigate(t('personalInformation'))}
          right={
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={24}
              color="white"
            />
          }
        />
        <ListItem
          text={t('transactions')}
          right={
            <MaterialCommunityIcons
              name="cash-multiple"
              size={24}
              color="white"
            />
          }
          onPress={() => navigation.navigate(t('transactions'))}
        />
      </View>
      <Text style={styles.infoText}>{t('help')}</Text>
      <View>
        <ListItem
          text={t('help')}
          right={
            <MaterialCommunityIcons
              name="alert-outline"
              size={24}
              color="white"
            />
          }
        />
        <ListItem
          text={t('termsAndConditions')}
          right={
            <MaterialCommunityIcons
              name="file-document-outline"
              size={24}
              color="white"
            />
          }
        />
        <ListItem
          text={t('logout')}
          testID="logoutItem"
          textStyle={{ color: '#FF6E6E' }}
          onPress={logoutFunc}
          right={
            <MaterialCommunityIcons
              name="login-variant"
              size={24}
              color="#FF6E6E"
            />
          }
        />
      </View>
    </ScrollView>
  );
}

export default MyAccountMain;
