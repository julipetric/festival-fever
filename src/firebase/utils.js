/* eslint-disable import/prefer-default-export */

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
