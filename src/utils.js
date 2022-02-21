/* eslint-disable import/prefer-default-export */
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
  dateString = moment.unix(event.startDate).format('LLLL');
  if (moment().year() === moment.unix(event.startDate).year())
    dateString = dateString.substring(0, dateString.lastIndexOf(',') - 1);
  else
    dateString = dateString.substring(
      0,
      dateString.lastIndexOf(moment.unix(event.startDate).year()) +
        `${moment.unix(event.startDate).year()}`.length
    );
  const hoursString = `${moment
    .unix(event.startDate)
    .format(`HH:mm`)} - ${moment.unix(event.endDate).format(`HH:mm`)}`;
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

export async function deleteAllOrders(firestoreInstance) {
  const batch = firestoreInstance.batch();

  const { docs } = await firestoreInstance.collection('orders').get();

  docs.forEach(doc => {
    batch.delete(doc.ref);
  });

  await batch.commit();
}

export async function deleteAllEventTicketSegments(firestoreInstance, eventId) {
  const batch = firestoreInstance.batch();
  const { docs: segmentDocs } = await firestoreInstance
    .collection('ticketSegments')
    .where('eventId', '==', eventId)
    .get();

  segmentDocs.forEach(doc => {
    batch.delete(
      firestoreInstance.collection('purchasables').doc(doc.data().purchasableId)
    );
    batch.delete(doc.ref);
  });

  await batch.commit();
}
