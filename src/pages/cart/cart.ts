import './cart.scss';

import { elementNullCheck } from '../../modules/helpers';
import Header from '../../components/Header';
import Cart from '../../components/Cart';
import promoCodes from '../../modules/promo-codes';
import '../../modules/purchase';

if (document.location.pathname.includes('cart')) {
  function onCartChanged() {
    cart.draw();
    header.refresh();
  }

  function onPromoCodeInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const code = promoCodes.find((code) => code.id === input.value);

    if (code) {
      input.value = '';
      cart.addPromoCode(code);
    }
  }

  function onItemsOnPageKeyPress(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const numbers = '0123456789'.split('');

    if (input.value != undefined && input.value.toString().length >= 3) {
      event.preventDefault();
    }
    if (!numbers.includes(event.key)) {
      event.preventDefault();
    }
  }

  document.body.addEventListener('carthasbeenchanged', onCartChanged, false);

  const uiCart = elementNullCheck(document, '.main-container-cart') as HTMLElement;
  const cart = new Cart(uiCart);
  cart.draw();

  const uiHeader = elementNullCheck(document, '.header-content') as HTMLElement;
  const header = new Header(uiHeader);
  header.refresh();

  const uiPromoInput = elementNullCheck(document, '.promo-input') as HTMLInputElement;
  uiPromoInput.addEventListener('input', onPromoCodeInput);

  const uiItemsOnPage = elementNullCheck(document, '.items-on-page-value') as HTMLInputElement;
  uiItemsOnPage.addEventListener('keypress', onItemsOnPageKeyPress);

  // -------------------------------------------------------------
  // Redirection
  // -------------------------------------------------------------

  const search = document.location.search;
  const searchParams = new URLSearchParams(search);

  const uiTitle = document.querySelector('.error-message>.title') as HTMLElement;
  let sec = 3;

  function displayMessage() {
    if (sec === 0) {
      location.href = '../../';
    } else {
      uiTitle.innerHTML = `Operation has been completed.<br>You will be redirected to main page in ${sec--}s`;
      setTimeout(displayMessage, 1000);
    }
  }

  if (searchParams.get('action') === 'submit') {
    cart.clear();
    displayMessage();
  }
}
