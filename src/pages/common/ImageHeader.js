import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';
import PropTypes from 'prop-types';
import NoImage from '../../assets/no-image.png';

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 80,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 20,
  },
});

function ImageHeader({ image, openImage }) {
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
        source={image ? { uri: image } : NoImage}
        style={[styles.image, { height: image ? imageHeight : 300 }]}
      />
    </TouchableHighlight>
  );
}

ImageHeader.propTypes = {
  image: PropTypes.string.isRequired,
  openImage: PropTypes.func.isRequired,
};

export default ImageHeader;
