/* eslint-disable import/prefer-default-export */
export async function getReferenceCollection(collection) {
  const list = [];
  await Promise.all(
    collection.map(async element => {
      const getElement = await element.get();
      list.push(getElement.data());
    })
  );
  return list;
}
