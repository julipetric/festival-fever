/* eslint-env detox/detox, mocha */
const { initializeWithBlacklist, credentials } = require('./util');

const { attendee, organizer } = credentials;

describe('Login', () => {
  beforeAll(async () => {
    await device.launchApp(initializeWithBlacklist);
  });

  beforeEach(async () => {
    // await device.reloadReactNative();
  });

  it('should validate email format', async () => {
    const [localPart, domain] = attendee.email.split('@');
    await element(by.id('username')).typeText(localPart);
    await expect(element(by.id('usernameHelper'))).toBeVisible();
    await element(by.id('username')).typeText(`@${domain}`);
    await expect(element(by.id('usernameHelper'))).toHaveText('');
  });

  it('should not login with wrong credentials', async () => {
    await element(by.id('password')).typeText(`${attendee.password}ee`);
    await element(by.id('loginButton')).tap();
    await expect(element(by.text('Error'))).toBeVisible();
    await element(by.text('OK')).tap();
    await element(by.id('password')).clearText();
  });

  it("do/don't remember session (attendee only)", async () => {
    await element(by.id('password')).typeText(attendee.password);
    await element(by.id('loginButton')).tap();
    await expect(element(by.id('FestivalFeverHeader'))).toBeVisible();
    await device.terminateApp();
    await device.launchApp(initializeWithBlacklist);
    await expect(element(by.id('FestivalFeverHeader'))).not.toBeVisible();
    await element(by.id('username')).typeText(attendee.email);
    await element(by.id('password')).typeText(attendee.password);
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
    await element(by.id('username')).typeText(organizer.email);
    await element(by.id('password')).typeText(organizer.password);
    await element(by.id('loginButton')).tap();
    await expect(element(by.id('selectRoleTitle'))).toBeVisible();
    await device.terminateApp();
    await device.launchApp(initializeWithBlacklist);
    await expect(element(by.id('selectRoleTitle'))).not.toBeVisible();
    await element(by.id('username')).typeText(organizer.email);
    await element(by.id('password')).typeText(organizer.password);
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
    await element(by.id('username')).typeText(attendee.email);
    await element(by.id('password')).typeText(attendee.password);
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
