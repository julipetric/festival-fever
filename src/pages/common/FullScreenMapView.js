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
    top: '180%',
    zIndex: 100,
  },
});

const latitudeDelta = 0.0922;
const longitudeDelta = 0.0421;

function FullScreenMapView() {
  const { params } = useRoute();

  const { hideDoneButton } = params;

  const [location, setLocation] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [markerCoordinates, setMarkerCoordinates] = useState(
    params.defaultMarker ? JSON.parse(params.defaultMarker) : undefined
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

  useEffect(() => {
    if (markerCoordinates) {
      mapRef.current.animateToRegion(
        {
          latitude: markerCoordinates.latitude,
          longitude: markerCoordinates.longitude,
          latitudeDelta,
          longitudeDelta,
        },
        500
      );
    }
    if (!markerCoordinates && location)
      mapRef.current.animateToRegion(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta,
          longitudeDelta,
        },
        500
      );
  }, [location, markerCoordinates]);

  useEffect(() => {
    if (errorMsg) Alert.alert(t('error'), errorMsg);
  }, [errorMsg]);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={styles.map}
        showsUserLocation
        ref={mapRef}
        onPress={event => {
          if (!hideDoneButton)
            setMarkerCoordinates(event.nativeEvent.coordinate);
        }}
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
        <StyledButton
          label={t('done')}
          style={styles.button}
          mode="contained"
          onPress={() => {
            params.callback(markerCoordinates);
            navigation.pop();
          }}
        />
      )}
    </View>
  );
}

export default FullScreenMapView;
