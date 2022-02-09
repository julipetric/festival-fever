import { useNavigation } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { ActivityIndicator, Modal, Portal, Text } from 'react-native-paper';
import { useFirestore } from 'react-redux-firebase';
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
      setScanned();
      setLoading(false);
      navigation.goBack();
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
          <Text style={{ color: 'black' }}>{scanned}</Text>
        </Modal>
      </Portal>
    </>
  );
}

export default QRScanner;
