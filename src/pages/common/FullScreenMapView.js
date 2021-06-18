import React, { useEffect, useRef, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Alert, StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';
import { t } from 'i18n-js';
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
    top: '170%',
    zIndex: 100,
  },
});

function FullScreenMapView() {
  const [location, setLocation] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [markerCoordinates, setMarkerCoordinates] = useState();

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
    if (location)
      mapRef.current.animateToRegion(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        500
      );
  }, [location]);

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
      {markerCoordinates && (
        <StyledButton
          label={t('done')}
          style={styles.button}
          mode="contained"
        />
      )}
    </View>
  );
}

export default FullScreenMapView;
