import React, { useEffect, useRef, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Alert, StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';
import { t } from 'i18n-js';
import { useNavigation, useRoute } from '@react-navigation/native';
import StyledButton from '../components/StyledButton';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  map: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    zIndex: -1,
  },
  button: {
    bottom: 20,
    zIndex: 100,
    position: 'absolute',
    alignSelf: 'center',
  },
});

const latitudeDelta = 0.04;
const longitudeDelta = 0.025;

function FullScreenMapView() {
  const { params } = useRoute();

  const { hideDoneButton } = params;

  const [location, setLocation] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [markerCoordinates, setMarkerCoordinates] = useState(
    params.defaultMarker && JSON.parse(params.defaultMarker)
      ? JSON.parse(params.defaultMarker)
      : undefined
  );

  const navigation = useNavigation();

  const mapRef = useRef();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      const tempLocation = await Location.getLastKnownPositionAsync({});
      setLocation(tempLocation);
    })();
  }, []);

  let initialRegion;
  if (params.defaultMarker && JSON.parse(params.defaultMarker)) {
    initialRegion = {
      latitude: markerCoordinates.latitude,
      longitude: markerCoordinates.longitude,
      latitudeDelta,
      longitudeDelta,
    };
  } else if (location)
    initialRegion = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta,
      longitudeDelta,
    };

  useEffect(() => {
    if (errorMsg) Alert.alert(t('error'), errorMsg);
  }, [errorMsg]);

  return (
    <View style={{ flex: 1 }} testID="fullScreenMapView">
      <MapView
        style={styles.map}
        showsUserLocation
        ref={mapRef}
        onPress={event => {
          if (!hideDoneButton)
            setMarkerCoordinates(event.nativeEvent.coordinate);
        }}
        initialRegion={initialRegion}
      >
        {markerCoordinates && (
          <Marker
            coordinate={markerCoordinates}
            draggable
            onDragEnd={event =>
              setMarkerCoordinates(event.nativeEvent.coordinate)
            }
          />
        )}
      </MapView>
      {!hideDoneButton && markerCoordinates && (
        <View style={styles.button}>
          <StyledButton
            label={t('done')}
            mode="contained"
            onPress={() => {
              params.callback(markerCoordinates);
              navigation.pop();
            }}
          />
        </View>
      )}
    </View>
  );
}

export default FullScreenMapView;
