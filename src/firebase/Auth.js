/* eslint-disable import/prefer-default-export */

import { setUserRoles } from '../redux/myStoreSlice';

export async function logout(firebaseInstance, dispatch) {
  await firebaseInstance.logout();
  dispatch(setUserRoles());
}
