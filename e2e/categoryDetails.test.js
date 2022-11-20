/* eslint-env detox/detox, mocha */
const { initializeWithBlacklist } = require('./util');

describe('Category Details module', () => {
  beforeAll(async () => {
    await device.launchApp(initializeWithBlacklist);
    await element(by.id('username')).typeText('<E2E_ATTENDEE_EMAIL>');
    await element(by.id('password')).typeText('<E2E_PASSWORD>');
    await element(by.id('rememberLogin')).tap();
    await element(by.id('loginButton')).tap();
  });

  beforeEach(async () => {
    // await device.reloadReactNative();
  });

  it('navigate to category and back', async () => {
    const category1Name = 'Música en Vivo';
    const category2Name = 'Cine';

    await expect(element(by.id('CategoriesList'))).toBeVisible();
    await element(by.text(category1Name)).tap();
    await expect(element(by.id('categoryDetailsHeader'))).toBeVisible();
    await expect(element(by.id('categoryDetailsHeaderTitle'))).toHaveText(
      category1Name
    );
    await element(by.id('categoriesTab')).tap();
    await expect(element(by.id('CategoriesList'))).toBeVisible();
    await waitFor(element(by.text(category2Name)))
      .toBeVisible()
      .whileElement(by.id('CategoriesList'))
      .scroll(200, 'down');
    await element(by.text(category2Name)).tap();
    await expect(element(by.id('categoryDetailsHeader'))).toBeVisible();
    await expect(element(by.id('categoryDetailsHeaderTitle'))).toHaveText(
      category2Name
    );
    await device.pressBack();
    await expect(element(by.id('CategoriesList'))).toBeVisible();
    await element(by.id('CategoriesList')).scrollToIndex(0);
  });

  it('show gallery/list view', async () => {
    const categoryName = 'Música en Vivo';

    await element(by.text(categoryName)).tap();
    await expect(element(by.id('eventsCardModePill'))).toHaveValue('true');
    await expect(element(by.id('eventsListModePill'))).toHaveValue('false');
    await expect(element(by.id('eventCardsView'))).toBeVisible();
    await element(by.id('eventsListModePill')).tap();
    await expect(element(by.id('eventsCardModePill'))).toHaveValue('false');
    await expect(element(by.id('eventsListModePill'))).toHaveValue('true');
    await expect(element(by.id('eventListView'))).toBeVisible();
  });
});
