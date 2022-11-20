/* eslint-disable import/prefer-default-export */

export const initializeWithBlacklist = {
  launchArgs: {
    detoxURLBlacklistRegex: '.*firestore.googleapis.com*.*',
  },
};

export async function blacklistFirestore() {
  await device.setURLBlacklist([
    '.*127.0.0.1.*',
    '.*firestore.googleapis.com*.*',
  ]);
}
