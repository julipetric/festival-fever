import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableHighlight,
  View,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 80,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 20,
  },
  circleIcon: { backgroundColor: 'rgba(0,0,0,0.3)', padding: 3 },
});

function ImageHeader({ image, openImage }) {
  const navigation = useNavigation();

  const screenWidth = Dimensions.get('window').width;

  const [imageHeight, setImageHeight] = useState(0);

  useEffect(() => {
    Image.getSize(image, (width, height) => {
      const ratio = screenWidth / width;
      setImageHeight(height * ratio);
    });
  }, [image, screenWidth]);

  return (
    <TouchableHighlight onPress={openImage}>
      <ImageBackground
        source={{ uri: image }}
        style={[styles.image, { height: imageHeight }]}
      >
        <IconButton
          icon={({ size }) => (
            <Ionicons name="arrow-back" size={size} color="white" />
          )}
          style={styles.circleIcon}
          size={25}
          onPress={() => navigation.goBack()}
        />
        <View style={{ flexDirection: 'row' }}>
          <IconButton
            icon={({ size }) => (
              <FontAwesome5 name="share-alt" size={size} color="white" />
            )}
            style={styles.circleIcon}
            size={23}
          />
          <IconButton
            icon={({ size }) => (
              <Feather name="star" size={size} color="white" />
            )}
            style={styles.circleIcon}
            size={25}
          />
        </View>
      </ImageBackground>
    </TouchableHighlight>
  );
}

ImageHeader.propTypes = {
  image: PropTypes.string.isRequired,
  openImage: PropTypes.func.isRequired,
};

export default ImageHeader;
