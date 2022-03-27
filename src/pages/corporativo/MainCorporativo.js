import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { t } from 'i18n-js';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { PinkPrimary } from '../../assets/Colors';
import HomeCorporativo from './HomeCorporativo';
import FullScreenMapView from '../common/FullScreenMapView';
import QRScanner from './QRScanner';
import EditEventInfo from './events/EditEventInfo';
import EventDetails from './events/EventDetails';
import TicketSegments from './ticketSegments/TicketSegments';
import EditTicketSegment from './ticketSegments/EditTicketSegment';
import EventProducts from './products/EventProducts';
import EditProduct from './products/EditProduct';
import EventCombos from './combos/EventCombos';
import EditCombo from './combos/EditCombo';

const Stack = createStackNavigator();

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    alignSelf: 'center',
  },
});

export default function MainCorporativo() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Stack.Navigator
        activeColor={PinkPrimary}
        initialRouteName="HomeCorporativo"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="HomeCorporativo" component={HomeCorporativo} />
        <Stack.Screen
          name="FullScreenMapView"
          component={FullScreenMapView}
          initialParams={{ hideDoneButton: false }}
        />
        <Stack.Screen
          name="QRScanner"
          component={QRScanner}
          options={{
            headerShown: true,
            title: 'QR Scanner',
          }}
        />
        <Stack.Screen
          name={t('ticketSegments')}
          component={TicketSegments}
          options={{
            headerShown: true,
            headerRight: () => (
              <TouchableOpacity
                style={{ marginRight: 15 }}
                onPress={() => navigation.push(t('ticketSegmentInfo'))}
              >
                <AntDesign name="pluscircle" size={24} color="white" />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name={t('ticketSegmentInfo')}
          component={EditTicketSegment}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name={t('eventInfo')}
          component={EditEventInfo}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name={t('products')}
          component={EventProducts}
          options={{
            headerShown: true,
            headerRight: () => (
              <TouchableOpacity
                style={{ marginRight: 15 }}
                onPress={() => navigation.push(t('productInfo'))}
              >
                <AntDesign name="pluscircle" size={24} color="white" />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name={t('productInfo')}
          component={EditProduct}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name={t('combos')}
          component={EventCombos}
          options={{
            headerShown: true,
            headerRight: () => (
              <TouchableOpacity
                style={{ marginRight: 15 }}
                onPress={() => navigation.push(t('comboInfo'))}
              >
                <AntDesign name="pluscircle" size={24} color="white" />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name={t('comboInfo')}
          component={EditCombo}
          options={{ headerShown: true }}
        />
        <Stack.Screen name={t('eventDetails')} component={EventDetails} />
      </Stack.Navigator>
    </View>
  );
}
