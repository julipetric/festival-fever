import { useRoute } from '@react-navigation/native';
import { t } from 'i18n-js';
import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Subheading, Text, Title, Caption } from 'react-native-paper';
import PropTypes from 'prop-types';
import { orderBy } from 'lodash';
import { BackgroundGray, PinkPrimary } from '../../../assets/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundGray,
    padding: 10,
  },
  itemContainer: {
    backgroundColor: 'white',
    padding: 7,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  ticketName: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
  },
  ticketDescription: {
    color: BackgroundGray,
    fontSize: 12,
    marginBottom: 5,
  },
  ticketPrice: {
    fontSize: 14,
    color: BackgroundGray,
  },
  line: {
    backgroundColor: PinkPrimary,
    flexGrow: 1,
    height: 1,
    marginBottom: 5,
  },
});

function TicketItem({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
      <Text style={styles.ticketName}>{item.name}</Text>
      <Text style={styles.ticketDescription}>{item.description}</Text>
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <Text style={styles.ticketPrice}>{t('price')}:</Text>
        <Text
          style={[styles.ticketPrice, { fontWeight: 'bold', marginLeft: 5 }]}
        >
          ${item.price}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

TicketItem.propTypes = {
  item: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
};

function ScreenHeader({ event }) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Title style={{ color: PinkPrimary }}>
        {t('ticketsFor')} {event.name}
      </Title>
    </View>
  );
}

ScreenHeader.defaultProps = {
  event: {},
};
ScreenHeader.propTypes = {
  event: PropTypes.object,
};

function OrderSummary({ items }) {
  let total = 0;
  items.forEach(item => (total += item.ticket.price * item.quantity));
  return (
    <View style={{ paddingVertical: 10, width: '100%' }}>
      <View style={styles.line} />
      <Subheading style={{ color: PinkPrimary }}>Order Summary</Subheading>
      {items.length ? (
        <>
          {items.map(item => (
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text>{item.ticket.name}</Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <Caption style={{ marginRight: 10 }}>x{item.quantity}</Caption>
                <Text>${item.ticket.price * item.quantity}</Text>
              </View>
            </View>
          ))}
          <View
            style={[styles.line, { backgroundColor: 'white', marginTop: 5 }]}
          />
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
              {t('total')}
            </Text>
            <Text style={{ fontWeight: 'bold' }}>${total}</Text>
          </View>
        </>
      ) : (
        <Caption>{t('noItemsAddedToYourOrder')}</Caption>
      )}
    </View>
  );
}

OrderSummary.propTypes = {
  items: PropTypes.array.isRequired,
};

function BuyTickets() {
  const route = useRoute();
  const { tickets, event } = route.params;

  const [items, setItems] = useState([]);

  function onRowPress(ticket) {
    const newArray = [...items];
    const index = items.findIndex(item => item.ticket.id === ticket.id);
    if (index > -1) {
      newArray[index].quantity += 1;
      setItems(newArray);
    } else {
      newArray.push({ ticket, quantity: 1 });
      setItems(newArray);
    }
  }

  return (
    <FlatList
      data={orderBy(tickets, 'price')}
      renderItem={({ item }) => (
        <TicketItem item={item} onPress={() => onRowPress(item)} />
      )}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.container}
      ListHeaderComponent={() => <ScreenHeader event={event} />}
      ListFooterComponent={() => <OrderSummary items={items} />}
    />
  );
}

export default BuyTickets;
