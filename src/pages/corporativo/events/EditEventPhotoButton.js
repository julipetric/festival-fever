import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { TransparentBackdrop2 } from '../../../assets/Colors';

const styles = StyleSheet.create({
  editIcon: {
    position: 'absolute',
    top: '1%',
    right: '1%',
    backgroundColor: TransparentBackdrop2,
  },
});

function EditEventPhotoButton({ setCustomImage }) {
  const [image, setImage] = useState(null);

  async function onButtonPress() {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    console.log(result);
    setCustomImage(result.uri);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  }

  return (
    <FAB
      icon={() => <Feather name="edit" size={24} color="white" />}
      style={styles.editIcon}
      onPress={onButtonPress}
    />
  );
}

export default EditEventPhotoButton;
