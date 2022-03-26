import { useNavigation } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { ActivityIndicator, Modal, Portal, Text } from 'react-native-paper';
import { useFirestore } from 'react-redux-firebase';
import { t } from 'i18n-js';
import CheckMarkAnimation from '../../assets/check-mark-success.json';
import StyledButton from '../components/StyledButton';
import { PinkPrimary } from '../../assets/Colors';

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 10,
    margin: 30,
  },
});

function QRScanner() {
  const firestore = useFirestore();
  const navigation = useNavigation();

  const [hasPermission, setHasPermission] = useState();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  async function handleBarCodeScanned({ type, data }) {
    if (type === 256) {
      const order = JSON.parse(data);
      setScanned(data);
      setLoading(true);
      const docReference = firestore.collection('orders').doc(order.orderId);
      const orderItems = (await docReference.get()).data()?.items;
      const editedItems = [...orderItems];
      editedItems.find(e => e.orderItemId === order.orderItemId).status = 5;
      await docReference.update({ items: editedItems });
      setLoading(false);
    }
  }

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{ flex: 1 }}
      />
      <Portal>
        <Modal
          visible={scanned}
          contentContainerStyle={styles.modalContainer}
          onDismiss={() => setScanned()}
        >
          {loading && <ActivityIndicator color={PinkPrimary} />}
          {!loading && (
            <View
              style={{
                padding: 20,
                backgroundColor: 'white',
                paddingBottom: 10,
                paddingRight: 10,
              }}
            >
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
                    setScanned();
                    navigation.goBack();
                  }}
                />
              </View>
            </View>
          )}
        </Modal>
      </Portal>
    </>
  );
}

export default QRScanner;
