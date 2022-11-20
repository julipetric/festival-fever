/* eslint-env detox/detox, mocha */
const { initializeWithBlacklist } = require('./util');

describe('Login', () => {
  beforeAll(async () => {
    await device.launchApp(initializeWithBlacklist);
  });

  beforeEach(async () => {
    // await device.reloadReactNative();
  });

  it('should validate email format', async () => {
    await element(by.id('username')).typeText('asistentedemo');
    await expect(element(by.id('usernameHelper'))).toBeVisible();
    await element(by.id('username')).typeText('@mailinator.com');
    await expect(element(by.id('usernameHelper'))).toHaveText('');
  });

  it('should not login with wrong credentials', async () => {
    await element(by.id('password')).typeText('<E2E_PASSWORD>ee');
    await element(by.id('loginButton')).tap();
    await expect(element(by.text('Error'))).toBeVisible();
    await element(by.text('OK')).tap();
    await element(by.id('password')).clearText();
  });

  it("do/don't remember session (attendee only)", async () => {
    await element(by.id('password')).typeText('<E2E_PASSWORD>');
    await element(by.id('loginButton')).tap();
    await expect(element(by.id('FestivalFeverHeader'))).toBeVisible();
    await device.terminateApp();
    await device.launchApp(initializeWithBlacklist);
    await expect(element(by.id('FestivalFeverHeader'))).not.toBeVisible();
    await element(by.id('username')).typeText('<E2E_ATTENDEE_EMAIL>');
    await element(by.id('password')).typeText('<E2E_PASSWORD>');
    await element(by.id('rememberLogin')).tap();
    await element(by.id('loginButton')).tap();
    await expect(element(by.id('FestivalFeverHeader'))).toBeVisible();
    await device.terminateApp();
    await device.launchApp(initializeWithBlacklist);
    await expect(element(by.id('FestivalFeverHeader'))).toBeVisible();
  });

  it("do/don't remember session (role selector)", async () => {
    await device.uninstallApp();
    await device.installApp();
    await device.launchApp(initializeWithBlacklist);
    await element(by.id('username')).typeText('<E2E_ORGANIZER_EMAIL>');
    await element(by.id('password')).typeText('<E2E_PASSWORD>');
    await element(by.id('loginButton')).tap();
    await expect(element(by.id('selectRoleTitle'))).toBeVisible();
    await device.terminateApp();
    await device.launchApp(initializeWithBlacklist);
    await expect(element(by.id('selectRoleTitle'))).not.toBeVisible();
    await element(by.id('username')).typeText('<E2E_ORGANIZER_EMAIL>');
    await element(by.id('password')).typeText('<E2E_PASSWORD>');
    await element(by.id('rememberLogin')).tap();
    await element(by.id('loginButton')).tap();
    await expect(element(by.id('selectRoleTitle'))).toBeVisible();
    await device.terminateApp();
    await device.launchApp(initializeWithBlacklist);
    await expect(element(by.id('selectRoleTitle'))).toBeVisible();
  });

  it('logout properly', async () => {
    await device.uninstallApp();
    await device.installApp();
    await device.launchApp(initializeWithBlacklist);
    await element(by.id('username')).typeText('<E2E_ATTENDEE_EMAIL>');
    await element(by.id('password')).typeText('<E2E_PASSWORD>');
    await element(by.id('rememberLogin')).tap();
    await element(by.id('loginButton')).tap();
    await expect(element(by.id('FestivalFeverHeader'))).toBeVisible();
    await device.terminateApp();
    await device.launchApp(initializeWithBlacklist);
    await expect(element(by.id('FestivalFeverHeader'))).toBeVisible();
    await element(by.id('profileButton')).tap();
    await element(by.id('logoutItem')).tap();
    await expect(element(by.id('loginTitle'))).toBeVisible();
    await device.terminateApp();
    await device.launchApp(initializeWithBlacklist);
    await expect(element(by.id('selectRoleTitle'))).not.toBeVisible();
  });
});
