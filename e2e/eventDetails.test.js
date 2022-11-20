/* eslint-env detox/detox, mocha */
const { initializeWithBlacklist } = require('./util');

describe('Event Details Module', () => {
  beforeAll(async () => {
    const categoryName = 'Música en Vivo';

    await device.launchApp(initializeWithBlacklist);
    await element(by.id('username')).typeText('<E2E_ATTENDEE_EMAIL>');
    await element(by.id('password')).typeText('<E2E_PASSWORD>');
    await element(by.id('rememberLogin')).tap();
    await element(by.id('loginButton')).tap();
    await element(by.text(categoryName)).tap();
    await element(by.id('eventCardItem')).tap();
  });

  beforeEach(async () => {
    // await device.reloadReactNative();
  });

  it('navigation and components', async () => {
    await expect(element(by.id('eventTitle'))).toBeVisible();
    await element(by.id('goToMapButton')).tap();
    await expect(element(by.id('fullScreenMapView'))).toBeVisible();
    await device.pressBack();
    await expect(element(by.id('eventTitle'))).toBeVisible();
    await expect(element(by.text('Tickets'))).toBeVisible();
    await expect(element(by.text('Combos'))).toBeVisible();
    await expect(element(by.text('Products'))).toBeVisible();
  });
});
