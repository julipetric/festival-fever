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

  it('add items to cart', async () => {
    await element(by.text('Tickets')).tap();
    await waitFor(element(by.id('TicketsItem-0')))
      .toBeVisible()
      .whileElement(by.id('eventDetailsScrollView'))
      .scroll(150, 'down');
    await element(by.id('TicketsItem-0')).tap();
    await waitFor(element(by.id('TicketsItem-1')))
      .toBeVisible()
      .whileElement(by.id('eventDetailsScrollView'))
      .scroll(150, 'down');
    await element(by.id('TicketsItem-1')).tap();
    await element(by.text('Tickets')).tap();
    await element(by.text('Combos')).tap();
    await waitFor(element(by.id('CombosItem-0')))
      .toBeVisible()
      .whileElement(by.id('eventDetailsScrollView'))
      .scroll(150, 'down');
    await element(by.id('CombosItem-0')).tap({ x: 5, y: 10 });
    await waitFor(element(by.text('Products')))
      .toBeVisible()
      .whileElement(by.id('eventDetailsScrollView'))
      .scroll(150, 'down');
    await element(by.text('Products')).tap();
    await element(by.id('ProductsItem-0')).tap({ x: 5, y: 10 });
    await expect(element(by.id('cartFAB'))).toHaveValue('Cart (4)');
  });
});
