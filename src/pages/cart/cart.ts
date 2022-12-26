import './cart.scss';

import { elementNullCheck } from '../../modules/helpers';
import Header from '../../components/Header';
import Cart from '../../components/Cart';
import promoCodes from '../../modules/promo-codes';

if (document.location.pathname.includes('cart')) {
  function onCartChanged() {
    cart.save();
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

  const uiCart = elementNullCheck(document, '.main-container-cart') as HTMLElement;
  const cart = new Cart(uiCart);
  cart.draw();

  const uiHeader = elementNullCheck(document, '.header-content') as HTMLElement;
  const header = new Header(uiHeader);
  header.refresh();

  const uiPromoInput = elementNullCheck(document, '.promo-input') as HTMLInputElement;
  uiPromoInput.addEventListener('input', onPromoCodeInput);

  document.body.addEventListener('carthasbeenchanged', onCartChanged, false);
}
