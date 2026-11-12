/* eslint-env detox/detox, mocha */
const { initializeWithBlacklist, credentials } = require('./util');

const { organizer } = credentials;

describe('Modo Vendedor', () => {
  beforeAll(async () => {
    await device.launchApp(initializeWithBlacklist);
    await element(by.id('username')).typeText(organizer.email);
    await element(by.id('password')).typeText(organizer.password);
    await element(by.id('rememberLogin')).tap();
    await element(by.id('loginButton')).tap();
    await element(by.id('roleOption-1')).tap();
  });

  beforeEach(async () => {
    // await device.reloadReactNative();
  });

  it('should have features limited', async () => {
    await expect(element(by.id('addEventButton'))).not.toBeVisible();
    await waitFor(element(by.id('myEventsList')))
      .toBeVisible()
      .withTimeout(3000);
    await element(by.id('devButton')).tap();
    await expect(element(by.text('Inactive Events'))).not.toBeVisible();
    await expect(element(by.text('My Organization'))).not.toBeVisible();
    await expect(element(by.text('Help & Support'))).not.toBeVisible();
  });
});
