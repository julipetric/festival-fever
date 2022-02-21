import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Switch, Text } from 'react-native-paper';
import { t } from 'i18n-js';
import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
  itemContainer: {
    padding: 10,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
  },
  itemName: { fontSize: 16, color: 'black', fontWeight: 'bold' },
});

function TicketSegmentItem({ item, purchasable, setItemActive }) {
  const [active, setActive] = useState(false);
  const navigation = useNavigation();

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
    <>
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() =>
          navigation.navigate(t('ticketSegmentInfo'), { item, purchasable })
        }
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <Text style={styles.itemName}>{purchasable?.name}</Text>
          <Text style={{ color: 'black' }}>${purchasable?.price}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'black', flex: 1 }}>
            {purchasable?.description}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flex: 0,
            }}
          >
            <Text style={{ color: 'black', paddingRight: 5, paddingLeft: 20 }}>
              {t('active')}
            </Text>
            <Switch value={active} onValueChange={() => toggleItem(!active)} />
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
}

TicketSegmentItem.propTypes = {
  item: PropTypes.object.isRequired,
  purchasable: PropTypes.object.isRequired,
  setItemActive: PropTypes.func.isRequired,
};

export default TicketSegmentItem;
