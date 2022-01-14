import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { ActivityIndicator, Modal, Portal, Text } from 'react-native-paper';
// eslint-disable-next-line import/no-unresolved
import ZoomableView from '@openspacelabs/react-native-zoomable-view/src/ReactNativeZoomableView';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import moment from 'moment';
import { t } from 'i18n-js';
import {
  BackgroundGray,
  PinkPrimary,
  PurplePill,
  TransparentBackdrop,
} from '../../assets/Colors';
import ImageHeader from './ImageHeader';
import EditEventPhotoButton from '../corporativo/events/EditEventPhotoButton';

const styles = StyleSheet.create({
  container: {
    backgroundColor: BackgroundGray,
  },
  categoryPill: {
    backgroundColor: PurplePill,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  dataContainer: {
    paddingHorizontal: 15,
    display: 'flex',
  },
  eventTitle: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  categoryText: {
    fontSize: 10,
    textTransform: 'uppercase',
  },
  text1: {
    opacity: 0.8,
    fontWeight: 'bold',
    fontSize: 14,
  },
  text2: {
    opacity: 0.6,
    fontSize: 14,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'white',
    marginTop: 15,
  },
});

function DatePlaceRow({ event, navigateToMap }) {
  let startDateString;
  let hoursString;
  if (event.dates.length === 1 && event.dates[0].start === 'dummyDate') {
    startDateString = moment()
      .add(3, 'days')
      .format(`dddd D [${t('of')}] MMMM`);
    hoursString = `${moment()
      .add(3, 'days')
      .add(2, 'hours')
      .format(`HH:mm`)} - ${moment()
      .add(3, 'days')
      .add(7, 'hours')
      .format(`HH:mm`)}`;
  } else {
    startDateString = moment(event.dates[0].start).format(
      `dddd D [${t('of')}] MMMM`
    );
    hoursString = `${moment(event.dates[0].start).format(`HH:mm`)} - ${moment(
      event.dates[0].end
    ).format(`HH:mm`)}`;
  }

  return (
    <View
      style={{
        width: '100%',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        <Feather name="calendar" size={24} color={PinkPrimary} />
        <View
          style={{
            marginLeft: 10,
          }}
        >
          <Text style={styles.text1}>{startDateString}</Text>
          <Text style={styles.text2}>{hoursString}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center' }}
        onPress={navigateToMap}
      >
        <MaterialIcons name="restaurant" size={24} color={PinkPrimary} />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.text1}>{event?.location?.description}</Text>
          <Text style={styles.text2}>{event?.location?.address}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

DatePlaceRow.propTypes = {
  event: PropTypes.object.isRequired,
  navigateToMap: PropTypes.func.isRequired,
};

function EventLandingPage({
  children,
  event,
  category,
  navigateToMap,
  corporativoMode,
}) {
  const [showImageFullscreen, setShowImageFullscreen] = useState(false);

  const [image, setImage] = useState(event?.imageUrl);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => setImage(event?.imageUrl), [event]);

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 70 }}
      >
        <ImageHeader
          image={image}
          openImage={() => setShowImageFullscreen(true)}
          hideFavoriteButton={corporativoMode}
        />
        <View style={styles.dataContainer}>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{category.name}</Text>
          </View>
          <Text style={styles.eventTitle}>{event.name}</Text>
          <DatePlaceRow event={event} navigateToMap={navigateToMap} />
          <View style={styles.divider} />
        </View>
        {children}
      </ScrollView>
      <Portal>
        <Modal
          visible={showImageFullscreen}
          contentContainerStyle={{ height: '100%', width: '100%' }}
          onDismiss={() => setShowImageFullscreen(false)}
          style={{ backgroundColor: TransparentBackdrop }}
        >
          {uploadingImage ? (
            <ActivityIndicator size="large" />
          ) : (
            <>
              <ZoomableView
                maxZoom={4}
                minZoom={1}
                initialZoom={1}
                bindToBorders
              >
                <Image
                  source={{ uri: image }}
                  resizeMode="contain"
                  style={{ width: '100%', height: '100%' }}
                />
              </ZoomableView>
              {corporativoMode && (
                <EditEventPhotoButton
                  setCustomImage={setImage}
                  setUploadingImage={setUploadingImage}
                />
              )}
            </>
          )}
        </Modal>
      </Portal>
    </>
  );
}

EventLandingPage.defaultProps = {
  children: undefined,
  corporativoMode: false,
  event: {},
  category: {},
};

EventLandingPage.propTypes = {
  children: PropTypes.element,
  event: PropTypes.object,
  category: PropTypes.object,
  navigateToMap: PropTypes.func.isRequired,
  corporativoMode: PropTypes.bool,
};

export default EventLandingPage;
