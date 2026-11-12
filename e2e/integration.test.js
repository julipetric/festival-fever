/* eslint-env detox/detox, mocha */
const { initializeWithBlacklist, credentials } = require('./util');

const { attendee, organizer } = credentials;

const categoryName = 'Música en Vivo';
const intialSoldQuantity = 0;

describe('Integration', () => {
  beforeAll(async () => {
    await device.launchApp(initializeWithBlacklist);
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('get ticket for attendee', async () => {
    // log in
    await element(by.id('username')).typeText(attendee.email);
    await element(by.id('password')).typeText(attendee.password);
    await element(by.id('loginButton')).tap();
    await waitFor(element(by.id('CategoriesList')))
      .toBeVisible()
      .withTimeout(3000);

    // access item
    await element(by.text(categoryName)).tap();
    await element(by.id('eventCardItem')).tap();

    // get tickets
    await element(by.text('Tickets')).tap();
    await waitFor(element(by.id('TicketsItem-0')))
      .toBeVisible()
      .whileElement(by.id('eventDetailsScrollView'))
      .scroll(150, 'down');
    await element(by.id('TicketsItem-0')).tap();

    // checkout
    await element(by.id('cartFAB')).tap();
    await element(by.id('checkoutFAB')).tap();
    await expect(element(by.text('Insufficient Funds'))).toBeVisible();
    await element(by.id('addFundsButton')).tap();
    await element(by.id('fundsInput')).typeText('2000');
    await element(by.id('addFundsConfirm')).tap();
    await expect(element(by.text('Insufficient Funds'))).not.toBeVisible();
    await element(by.id('checkoutConfirmFAB')).tap();
  });

  it('check ticket sold quantity', async () => {
    // login
    await element(by.id('username')).typeText(organizer.email);
    await element(by.id('password')).typeText(organizer.password);
    await element(by.id('loginButton')).tap();
    await element(by.id('roleOption-0')).tap();

    // access screen
    await waitFor(element(by.id('myEventsList')))
      .toBeVisible()
      .withTimeout(3000);
    await element(by.id('myEventsItem-0')).tap();
    await element(by.id('ticketSegmentsButton')).tap();

    // check for value
    await expect(element(by.id('ticketSegment-1-sold'))).toHaveText(
      `Sold: ${intialSoldQuantity + 1}`
    );
  });

  it('get product for attendee', async () => {
    // log in
    await element(by.id('username')).typeText(attendee.email);
    await element(by.id('password')).typeText(attendee.password);
    await element(by.id('loginButton')).tap();
    await waitFor(element(by.id('CategoriesList')))
      .toBeVisible()
      .withTimeout(3000);

    // access item
    await element(by.text(categoryName)).tap();
    await element(by.id('eventCardItem')).tap();

    // get product
    await element(by.text('Products')).tap();
    await waitFor(element(by.id('ProductsItem-0')))
      .toBeVisible()
      .whileElement(by.id('eventDetailsScrollView'))
      .scroll(150, 'down');
    await element(by.id('ProductsItem-0')).tap();

    // checkout
    await element(by.id('cartFAB')).tap();
    await element(by.id('checkoutFAB')).tap();
    await expect(element(by.text('Insufficient Funds'))).toBeVisible();
    await element(by.id('addFundsButton')).tap();
    await element(by.id('fundsInput')).typeText('250');
    await element(by.id('addFundsConfirm')).tap();
    await expect(element(by.text('Insufficient Funds'))).not.toBeVisible();
    await element(by.id('checkoutConfirmFAB')).tap();
  });

  it('check product sold quantity', async () => {
    // login
    await element(by.id('username')).typeText(organizer.email);
    await element(by.id('password')).typeText(organizer.password);
    await element(by.id('loginButton')).tap();
    await element(by.id('roleOption-0')).tap();

    // access screen
    await waitFor(element(by.id('myEventsList')))
      .toBeVisible()
      .withTimeout(3000);
    await element(by.id('myEventsItem-0')).tap();
    await element(by.id('productsButton')).tap();

    // check for value
    await expect(element(by.id('ProductsItem-0-sold'))).toHaveText(
      `Sold: ${intialSoldQuantity + 1}`
    );
  });

  it('get combo for attendee', async () => {
    // log in
    await element(by.id('username')).typeText(attendee.email);
    await element(by.id('password')).typeText(attendee.password);
    await element(by.id('loginButton')).tap();
    await waitFor(element(by.id('CategoriesList')))
      .toBeVisible()
      .withTimeout(3000);

    // access item
    await element(by.text(categoryName)).tap();
    await element(by.id('eventCardItem')).tap();

    // get product
    await element(by.text('Combos')).tap();
    await waitFor(element(by.id('CombosItem-0')))
      .toBeVisible()
      .whileElement(by.id('eventDetailsScrollView'))
      .scroll(150, 'down');
    await element(by.id('CombosItem-0')).tap();

    // checkout
    await element(by.id('cartFAB')).tap();
    await element(by.id('checkoutFAB')).tap();
    await expect(element(by.text('Insufficient Funds'))).toBeVisible();
    await element(by.id('addFundsButton')).tap();
    await element(by.id('fundsInput')).typeText('2500');
    await element(by.id('addFundsConfirm')).tap();
    await expect(element(by.text('Insufficient Funds'))).not.toBeVisible();
    await element(by.id('checkoutConfirmFAB')).tap();
  });

  it('check pruchasables (combo) sold quantity', async () => {
    // login
    await element(by.id('username')).typeText(organizer.email);
    await element(by.id('password')).typeText(organizer.password);
    await element(by.id('loginButton')).tap();
    await element(by.id('roleOption-0')).tap();

    // access tickets screen
    await waitFor(element(by.id('myEventsList')))
      .toBeVisible()
      .withTimeout(3000);
    await element(by.id('myEventsItem-0')).tap();
    await element(by.id('ticketSegmentsButton')).tap();

    // check for tickets sold value
    await expect(element(by.id('ticketSegment-0-sold'))).toHaveText(
      `Sold: ${intialSoldQuantity + 2}`
    );

    // access products screen
    await device.pressBack();
    await element(by.id('productsButton')).tap();

    // check for products value
    await expect(element(by.id('ProductsItem-0-sold'))).toHaveText(
      `Sold: ${intialSoldQuantity + 3}`
    );

    // access combos screen
    await device.pressBack();
    await element(by.id('combosButton')).tap();

    // check for products value
    await expect(element(by.id('ComboItem-0-sold'))).toHaveText(
      `Sold: ${intialSoldQuantity}`
    );
  });
});
