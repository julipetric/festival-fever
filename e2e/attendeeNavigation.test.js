/* eslint-env detox/detox, mocha */
const { initializeWithBlacklist } = require('./util');

describe('Navigation (attendee)', () => {
  beforeAll(async () => {
    await device.launchApp(initializeWithBlacklist);
  });

  beforeEach(async () => {
    // await device.reloadReactNative();
  });

  it('bottom tabs navigation', async () => {
    await element(by.id('username')).typeText('<E2E_ATTENDEE_EMAIL>');
    await element(by.id('password')).typeText('<E2E_PASSWORD>');
    await element(by.id('loginButton')).tap();
    await element(by.id('walletTab')).tap();
    await expect(element(by.text('Active Orders'))).toBeVisible();
    await element(by.id('favoritesTab')).tap();
    await expect(element(by.id('FavoritesList'))).toBeVisible();
    await element(by.id('categoriesTab')).tap();
    await expect(element(by.id('CategoriesList'))).toBeVisible();
  });

  it('header navigation', async () => {
    await element(by.id('searchButton')).tap();
    await expect(element(by.text('Search'))).toBeVisible();
    await element(by.id('profileButton')).tap();
    await expect(element(by.text('My Account'))).toBeVisible();
  });
});
