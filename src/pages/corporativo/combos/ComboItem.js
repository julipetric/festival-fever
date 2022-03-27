import { t } from 'i18n-js';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Image, Alert, StyleSheet } from 'react-native';
import { Switch, Text } from 'react-native-paper';
import PropTypes from 'prop-types';
import { ListItemBorderRadius } from '../../../assets/UIConstants';

const styles = StyleSheet.create({
  productContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: ListItemBorderRadius,
    flexDirection: 'row',
    marginBottom: 15,
  },
});

function ComboItem({ item, onPress, setItemActive, hideOptions, setAnchor }) {
  const [imageWidth, setImageWidth] = useState(0);

  const [imageHeight, setImageHeight] = useState(0);
  const [active, setActive] = useState(item?.active || false);

  useEffect(() => {
    if (item?.imageUrl)
      Image.getSize(item?.imageUrl, (width, height) => {
        const ratio = imageWidth / width;
        setImageHeight(height * ratio);
      });
  }, [item, imageWidth]);

  function toggleItem(newValue) {
    if (!newValue)
      Alert.alert(
        t('deactivateItem'),
        t('deactivateItemAlert'),
        [
          {
            text: t('cancel'),
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: t('ok'),
            onPress: () => {
              setItemActive(false);
              setActive(false);
            },
          },
        ],
        { cancelable: true }
      );
    else {
      setItemActive(true);
      setActive(true);
    }
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={event =>
        setAnchor({
          position: {
            x: event.nativeEvent.pageX,
            y: event.nativeEvent.pageY,
          },
          item,
        })
      }
      style={styles.productContainer}
      key={item.id}
    >
      <View style={{ flex: 7, justifyContent: 'space-between' }}>
        <View>
          <Text style={{ color: 'black', fontSize: 16 }}>{item.name}</Text>
          <Text style={{ color: 'black', fontSize: 16 }}>
            ${Number(item.price).toFixed(2)}
          </Text>
          {item.description !== '' && (
            <Text style={{ color: 'black', fontSize: 14, opacity: 0.6 }}>
              {item.description}
            </Text>
          )}
          {!hideOptions && item.stock !== '' && (
            <Text style={{ color: 'black', opacity: 0.7, fontSize: 16 }}>
              Stock: {item.stock}
            </Text>
          )}
          {!hideOptions && item.sold !== undefined && (
            <Text style={{ color: 'black', opacity: 0.7, fontSize: 16 }}>
              {t('sold')}: {item.sold}
            </Text>
          )}
        </View>
        {!hideOptions && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'black', paddingRight: 5 }}>
              {t('active')}
            </Text>

            <Switch value={active} onValueChange={() => toggleItem(!active)} />
          </View>
        )}
      </View>
      {item.imageUrl && (
        <Image
          source={{ uri: item.imageUrl }}
          style={{
            flex: 3,
            height: imageHeight,
            width: imageWidth,
            maxHeight: setItemActive ? undefined : 100,
          }}
          resizeMode="contain"
          onLayout={e => {
            setImageWidth(e.nativeEvent.layout.width);
          }}
        />
      )}
    </TouchableOpacity>
  );
}

ComboItem.defaultProps = {
  setItemActive: undefined,
  hideOptions: false,
  setAnchor: () => {},
};

ComboItem.propTypes = {
  item: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
  setItemActive: PropTypes.func,
  hideOptions: PropTypes.bool,
  setAnchor: PropTypes.func,
};

export default ComboItem;
