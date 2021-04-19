/* eslint-disable import/prefer-default-export */

export async function logout(firebaseInstance) {
  firebaseInstance.logout().then(true, false);
}
