/* eslint-env detox/detox, mocha */
const { initializeWithBlacklist, credentials } = require('./util');

const { organizer } = credentials;

describe('Modo Corporativo', () => {
  beforeAll(async () => {
    await device.launchApp(initializeWithBlacklist);
    await element(by.id('username')).typeText(organizer.email);
    await element(by.id('password')).typeText(organizer.password);
    await element(by.id('rememberLogin')).tap();
    await element(by.id('loginButton')).tap();
    await element(by.id('roleOption-0')).tap();
  });

  beforeEach(async () => {
    // await device.reloadReactNative();
  });

  it('should have all organization features', async () => {
    await waitFor(element(by.id('myEventsList')))
      .toBeVisible()
      .withTimeout(3000);
    await element(by.id('devButton')).tap();
    await expect(element(by.text('Inactive Events'))).toBeVisible();
    await expect(element(by.text('My Organization'))).toBeVisible();
    await expect(element(by.text('Help & Support'))).toBeVisible();
    await element(by.id('devButton')).tap();
  });

  it('edit event info', async () => {
    await waitFor(element(by.id('myEventsList')))
      .toBeVisible()
      .withTimeout(3000);
    await element(by.id('myEventsItem-0')).tap();
    await element(by.id('eventInfoButton')).tap();
    await element(by.id('name')).clearText();
    const number = (Math.random() * 100).toPrecision(0);
    await element(by.id('name')).typeText(`testing event - ${number}`);
  });
});
