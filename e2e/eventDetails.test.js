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

  it('buy items flow', async () => {
    const initialOrdersQuantity = 3;

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
    await element(by.id('cartFAB')).tap();
    await expect(element(by.id('orderSummaryTitle'))).toBeVisible();
    await element(by.id('cartItem-1-minus')).tap();
    await expect(element(by.id('orderSummaryItem-3'))).not.toBeVisible();
    await element(by.id('checkoutFAB')).tap();
    await expect(element(by.id('checkoutHeader'))).toBeVisible();
    await expect(element(by.text('Insufficient Funds'))).toBeVisible();
    await element(by.id('addFundsButton')).tap();
    await element(by.id('fundsInput')).typeText('4500');
    await element(by.id('addFundsConfirm')).tap();
    await expect(element(by.text('Insufficient Funds'))).not.toBeVisible();
    await element(by.id('checkoutConfirmFAB')).tap();
    await element(by.id('walletTab')).tap();

    // using initialOrdersQuantity since index is based 0
    await waitFor(element(by.id(`walletOrderItem-${initialOrdersQuantity}`)))
      .toBeVisible()
      .whileElement(by.id('activeOrdersList'))
      .scroll(150, 'down');
  });
});
