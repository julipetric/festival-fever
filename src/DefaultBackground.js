import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  View,
  StatusBar,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import image from '../assets/default_bg.png';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});

export default function DefaultBackground({ children }) {
  return (
    <View style={styles.container}>
      <ImageBackground source={image} style={styles.image}>
        {children}
      </ImageBackground>
    </View>
  );
}

DefaultBackground.propTypes = {
  children: PropTypes.element.isRequired,
};
