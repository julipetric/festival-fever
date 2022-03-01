import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import PropTypes from 'prop-types';
import { ActivityIndicator } from 'react-native-paper';
import { ListItemBorderRadius } from '../../../assets/UIConstants';
import { BackgroundGray } from '../../../assets/Colors';

const styles = StyleSheet.create({
  container: {
    width: '50%',
    alignSelf: 'center',
  },
  thumbnailContainer: {
    width: '100%',
    backgroundColor: BackgroundGray,
    borderRadius: ListItemBorderRadius,
    borderColor: 'black',
    borderWidth: 2,
  },
});

function ProductPhoto({ image, setImage }) {
  const [imageWidth, setImageWidth] = useState(0);

  const [imageHeight, setImageHeight] = useState(0);

  useEffect(() => {
    Image.getSize(image, (width, height) => {
      const ratio = imageWidth / width;
      setImageHeight(height * ratio);
    });
  }, [image, imageWidth]);

  async function onPress() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    setImage(result.uri);
  }

  return (
    <View
      style={styles.container}
      onLayout={e => {
        setImageWidth(e.nativeEvent.layout.width);
      }}
    >
      {imageHeight ? (
        <TouchableOpacity style={styles.thumbnailContainer} onPress={onPress}>
          <ImageBackground
            source={{ uri: image }}
            style={{ width: '100%', height: imageHeight || 0 }}
            resizeMode="contain"
            resizeMethod="scale"
          />
        </TouchableOpacity>
      ) : (
        <ActivityIndicator />
      )}
    </View>
  );
}

ProductPhoto.propTypes = {
  image: PropTypes.any.isRequired,
  setImage: PropTypes.func.isRequired,
};

export default ProductPhoto;
