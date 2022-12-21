import './cart.scss';

import { elementNullCheck } from '../../modules/type-checks';
import Header from '../../components/Header';
import Cart from '../../components/Cart';

if (document.location.pathname.includes('cart')) {
  function onCartHasBeenChanged() {
    cart.save();
    cart.refresh();
  }

  const uiCart = elementNullCheck(document, '.main-container-cart') as HTMLElement;
  const cart = new Cart(uiCart);
  cart.draw();

  const uiTotalContainer = elementNullCheck(document, '.total') as HTMLParagraphElement;
  const uiBasketContainer = elementNullCheck(document, '.basket-amount') as HTMLSpanElement;

  const header = new Header(uiTotalContainer, uiBasketContainer, cart);
  header.refreshHeader();

  document.body.addEventListener('carthasbeenchanged', onCartHasBeenChanged, false);
}
