import { t } from 'i18n-js';
import { cloneDeep, orderBy, uniq, uniqBy } from 'lodash';
import React, { useEffect, useState } from 'react';
import LottieView from 'lottie-react-native';
import { FlatList, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  ActivityIndicator,
  Modal,
  Portal,
  Text,
  Title,
} from 'react-native-paper';
import QRCode from 'react-qr-code';
import { useSelector } from 'react-redux';
import {
  useFirebase,
  useFirestore,
  useFirestoreConnect,
} from 'react-redux-firebase';
import CheckMarkAnimation from '../../../assets/check-mark-success.json';
import { DarkCardBackground, PinkPrimary } from '../../../assets/Colors';
import StyledButton from '../../components/StyledButton';
import TransactionItem from './TransactionItem';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ordersLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 10,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 10,
    margin: 30,
  },
  modalTitle: {
    color: DarkCardBackground,
    textTransform: 'uppercase',
  },
});

function Orders() {
  const firebase = useFirebase();
  const firestore = useFirestore();

  const [viewQRModal, setViewQRModal] = useState();
  const [showQR, setShowQR] = useState();
  const [successMessage, setSuccessMessage] = useState();

  const { userOrders, userOrdersPurchasables, userOrdersEvents, requesting } =
    useSelector(state => ({
      userOrders: state.firestore.ordered.userOrders,
      userOrdersPurchasables: state.firestore.data.userOrdersPurchasables,
      userOrdersEvents: state.firestore.data.userOrdersEvents,
      requesting: state.firestore.status.requesting,
    }));

  const loading =
    requesting.userOrders ||
    requesting.userOrdersPurchasables ||
    requesting.userOrdersEvents ||
    !userOrders ||
    (userOrders.some(order => order.items) &&
      (!userOrdersPurchasables || !userOrdersEvents));
  const activeOrders = userOrders?.filter(order =>
    order.items?.some(item => item.status === 1)
  );

  useFirestoreConnect(() => {
    const array = [];

    if (firebase.auth()?.currentUser?.uid)
      array.push({
        collection: 'orders',
        where: ['userId', '==', firebase.auth()?.currentUser?.uid],
        orderBy: ['timestamp', 'desc'],
        storeAs: 'userOrders',
      });

    if (userOrders?.some(order => order.items?.length))
      array.push({
        collection: 'purchasables',
        where: [
          firestore.FieldPath.documentId(),
          'in',
          uniq(
            userOrders
              .flatMap(item =>
                item.items?.map(subItem => subItem.purchasableId)
              )
              .filter(e => e !== undefined)
          ),
        ],
        storeAs: 'userOrdersPurchasables',
      });
    if (activeOrders?.some(order => order.eventId))
      array.push({
        collection: 'events',
        where: [
          firestore.FieldPath.documentId(),
          'in',
          activeOrders.map(order => order.eventId).filter(e => e !== undefined),
        ],
        storeAs: 'userOrdersEvents',
      });
    return array;
  });

  useEffect(() => {
    if (
      showQR &&
      activeOrders &&
      activeOrders
        ?.flatMap(order => order.items)
        .find(item => item.orderItemId === showQR.orderItemId)?.status !== 1
    ) {
      setSuccessMessage(true);
      setShowQR();
    }
  }, [activeOrders, showQR]);

  return loading ? (
    <ActivityIndicator
      style={{ paddingTop: 30, flex: 1, justifyContent: 'flex-start' }}
      size="large"
    />
  ) : (
    <>
      <View style={styles.container}>
        <Text style={styles.ordersLabel}>{t('activeOrders')}</Text>
        <FlatList
          testID="activeOrdersList"
          renderItem={({ item, index }) => (
            <TransactionItem
              transaction={item}
              hideOrderTotal
              hideItemPrice
              onPress={() =>
                setViewQRModal(activeOrders.find(order => order.id === item.id))
              }
              event={userOrdersEvents[item.eventId]}
              disabled={activeOrders
                .find(order => order.id === item.id)
                .items?.every(orderItem => orderItem.status !== 1)}
              testID={`walletOrderItem-${index}`}
            />
          )}
          data={activeOrders?.map(order => {
            if (order.status === 10) return order;
            return {
              ...cloneDeep(order),
              items: uniqBy(
                orderBy(order.items, 'status'),
                'purchasableId'
              ).map(item => ({
                ...item,
                quantity: order.items.filter(
                  orderItem => orderItem.purchasableId === item.purchasableId
                ).length,
                purchasable: userOrdersPurchasables
                  ? userOrdersPurchasables[item?.purchasableId]
                  : undefined,
              })),
            };
          })}
        />
      </View>
      <Portal>
        <Modal
          visible={viewQRModal}
          onDismiss={() => {
            setViewQRModal(undefined);
          }}
          contentContainerStyle={styles.modalContainer}
        >
          <Title style={styles.modalTitle}>{t('viewQRForProduct')}</Title>
          {uniqBy(
            viewQRModal?.items.filter(item => item.status === 1),
            'purchasableId'
          ).map(item => (
            <TouchableOpacity
              onPress={() =>
                setShowQR({
                  orderId: viewQRModal.id,
                  orderItemId: item.orderItemId,
                  purchasableId: item.purchasableId,
                })
              }
            >
              <Text
                style={{
                  color: PinkPrimary,
                  fontSize: 16,
                  paddingVertical: 5,
                  fontWeight: 'bold',
                }}
              >
                {userOrdersPurchasables[item.purchasableId].name}
              </Text>
            </TouchableOpacity>
          ))}
        </Modal>
      </Portal>
      <Portal>
        <Modal
          visible={showQR || successMessage}
          onDismiss={() => {
            setShowQR();
            setSuccessMessage();
          }}
          contentContainerStyle={{
            alignItems: 'center',
          }}
        >
          <View
            style={{
              padding: 20,
              backgroundColor: 'white',
              paddingBottom: !showQR && successMessage ? 10 : undefined,
              paddingRight: !showQR && successMessage ? 10 : undefined,
            }}
          >
            {showQR && <QRCode value={JSON.stringify(showQR)} />}
            {!showQR && successMessage && (
              <>
                <Text
                  style={{
                    fontSize: 16,
                    paddingRight: 10,
                    color: 'black',
                    textTransform: 'uppercase',
                  }}
                >
                  {t('codeSuccessfullyRedeemed')}
                </Text>

                <LottieView
                  source={CheckMarkAnimation}
                  autoPlay
                  loop={false}
                  style={{
                    height: 125,
                    width: 125,
                    alignSelf: 'center',
                  }}
                  autoSize
                  resizeMode="cover"
                />
                <View style={{ alignItems: 'flex-end' }}>
                  <StyledButton
                    label={t('ok')}
                    style={{ padding: 0, margin: 0 }}
                    onPress={() => {
                      setShowQR();
                      setSuccessMessage();
                      setViewQRModal(undefined);
                    }}
                  />
                </View>
              </>
            )}
          </View>
        </Modal>
      </Portal>
    </>
  );
}

export default Orders;
