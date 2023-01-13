const assert = require('assert');

const helpers = require('../out-tsc/modules/helpers');
const validations = require('../out-tsc/modules/validations');
const pages = require('../out-tsc/modules/pages');

describe('Module "helpers"', () => {
  it('Function "formatAmount" should transform number to currency format: 12345 => $12,345.00', () => {
    assert.equal(helpers.formatAmount(0), '$0.00');
    assert.equal(helpers.formatAmount(12345), '$12,345.00');
    assert.equal(helpers.formatAmount(100.12345), '$100.12');
    assert.equal(helpers.formatAmount(100.12999), '$100.13');
  });
});

describe('Module "validations"', () => {
  it('Function "isNameValid" - Validation: contains at least 2 words, each word is at least 3 characters long', () => {
    assert.equal(validations.isNameValid('John Doe'), true);
    assert.equal(validations.isNameValid('John'), false);
    assert.equal(validations.isNameValid('Mi Fo'), false);
  });

  it('Function "isPhoneValid" - Validation: must start with "+", contains at least 9 digits', () => {
    assert.equal(validations.isPhoneValid('+123456789'), true);
    assert.equal(validations.isPhoneValid('+123456789012345'), true);
    assert.equal(validations.isPhoneValid('123456789'), false);
    assert.equal(validations.isPhoneValid('+12345'), false);
  });

  it('Function "isAddressValid" - Validation: contains at least 3 words, each word is at least 5 characters long', () => {
    assert.equal(validations.isAddressValid('Minsk, Bogdanovich street, 56-481'), true);
    assert.equal(validations.isAddressValid('Moscow, Internatsionalnaya'), false);
  });

  it('Function "isEmailValid" - Validation: must be an email (xxx@yyy.zz)', () => {
    assert.equal(validations.isEmailValid('john.doe@gmail.com'), true);
    assert.equal(validations.isEmailValid('john.doe'), false);
    assert.equal(validations.isEmailValid('john.doe@gmail'), false);
  });

  it('Function "isCardValid" - Validation: contains exactly 16 digits', () => {
    assert.equal(validations.isCardValid('1234567890123456'), true);
    assert.equal(validations.isCardValid('12345678901234567890'), false);
    assert.equal(validations.isCardValid('1234567890'), false);
    assert.equal(validations.isCardValid('qwerty'), false);
  });

  it('Function "isValidValid" - Validation: must be a valid card period (MM/YY)', () => {
    assert.equal(validations.isValidValid('12/25'), true);
    assert.equal(validations.isValidValid('01/26'), true);
    assert.equal(validations.isValidValid('00/99'), false);
    assert.equal(validations.isValidValid('99/00'), false);
    assert.equal(validations.isValidValid('aa/bb'), false);
    assert.equal(validations.isValidValid('1225'), false);
  });

  it('Function "isCvvValid" - Validation: contains exactly 3 digits', () => {
    assert.equal(validations.isCvvValid('123'), true);
    assert.equal(validations.isCvvValid('000'), true);
    assert.equal(validations.isCvvValid('999'), true);
    assert.equal(validations.isCvvValid('01'), false);
    assert.equal(validations.isCvvValid('12345'), false);
    assert.equal(validations.isCvvValid('aaa'), false);
  });
});

describe('Module "pages"', () => {
  it('Check path of catalog page', () => {
    assert.equal(pages.isCatalogPage('/'), true);
    assert.equal(pages.isCatalogPage('/online-store/'), true);
    assert.equal(pages.isCatalogPage('/online-store/index.html'), true);
    assert.equal(pages.isCatalogPage(''), false);
  });

  it('Check path of cart page', () => {
    assert.equal(pages.isCartPage('/cart.html'), true);
    assert.equal(pages.isCartPage('/online-store/cart.html'), true);
    assert.equal(pages.isCartPage(''), false);
  });

  it('Check path of details page', () => {
    assert.equal(pages.isDetailsPage('/details.html'), true);
    assert.equal(pages.isDetailsPage('/online-store/details.html'), true);
    assert.equal(pages.isDetailsPage(''), false);
  });
});