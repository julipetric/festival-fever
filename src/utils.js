/* eslint-disable import/prefer-default-export */

import { t } from 'i18n-js';
import moment from 'moment';

export async function renameCollection(
  firestoreInstance,
  oldCollectionName,
  newCollectionName
) {
  firestoreInstance
    .collection(oldCollectionName)
    .get()
    .then(async snapShot => {
      snapShot.docs.forEach(async element => {
        await firestoreInstance
          .collection(newCollectionName)
          .doc(element.id)
          .set(element.data());
      });
    });

  firestoreInstance.delete(oldCollectionName);
}

export function formatEventDateTime(event) {
  let dateString;
  let hoursString;
  if (event.dates.length === 1 && event.dates[0].start === 'dummyDate') {
    dateString = moment()
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
    dateString = moment(event.dates[0].start).format(
      `dddd D [${t('of')}] MMMM`
    );
    hoursString = `${moment(event.dates[0].start).format(`HH:mm`)} - ${moment(
      event.dates[0].end
    ).format(`HH:mm`)}`;
  }
  return { dateString, hoursString };
}

export async function recalculateWallet(firestoreInstance, userId) {
  const orders = [];
  (
    await firestoreInstance
      .collection('orders')
      .where('userId', '==', userId)
      .get()
  ).forEach(doc => orders.push(doc.data()));
  let total = 0;
  orders.forEach(order => {
    total -= order.amount;
  });
  firestoreInstance.collection('users').doc(userId).update({ balance: total });
}

export async function deleteUserTransactions(firestoreInstance, userId) {
  const batch = firestoreInstance.batch();

  const { docs } = await firestoreInstance
    .collection('orders')
    .where('userId', '==', userId)
    .get();

  docs.forEach(doc => {
    batch.delete(doc.ref);
  });

  await batch.commit();
  await recalculateWallet(firestoreInstance, userId);
}
