import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import { head } from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { TransparentBackdrop2 } from '../../../assets/Colors';

const styles = StyleSheet.create({
  editIcon: {
    position: 'absolute',
    top: '1%',
    right: '1%',
    backgroundColor: TransparentBackdrop2,
  },
});

function EditEventPhotoButton({ setUploadingImage }) {
  const firebase = useFirebase();
  const firestore = useFirestore();

  const { event } = useSelector(state => ({
    event: head(state.firestore.ordered.selectedEvent),
  }));

  async function onButtonPress() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    const resultImage = await fetch(result.uri);
    const blob = await resultImage.blob();

    const fileExtension = result.uri.substring(result.uri.lastIndexOf('.') + 1);

    const fileName = `${event.name.substring(0, 10)}-${
      event.id
    }-${moment().unix()}.${fileExtension}`;

    setUploadingImage(true);

    const uploadResult = await firebase.uploadFile(
      'eventCovers',
      blob,
      undefined,
      {
        name: fileName,
      }
    );

    const downloadUrl =
      await uploadResult.uploadTaskSnapshot.ref.getDownloadURL();

    const editedEvent = { ...event };
    delete editedEvent.id;
    editedEvent.imageUrl = downloadUrl;

    const pathToDelete = firebase.storage().refFromURL(event.imageUrl);

    await firestore.collection('events').doc(event.id).update(editedEvent);

    await firebase.deleteFile(pathToDelete.fullPath);

    setUploadingImage(false);
  }

  return (
    <FAB
      icon={() => <Feather name="edit" size={24} color="white" />}
      style={styles.editIcon}
      onPress={onButtonPress}
    />
  );
}

EditEventPhotoButton.propTypes = {
  setUploadingImage: PropTypes.func.isRequired,
};

export default EditEventPhotoButton;
