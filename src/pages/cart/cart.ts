import './cart.scss';

import { elementNullCheck } from '../../types/type-checks';
import Header from '../../components/Header/Header';
import Cart from '../../components/Cart/Cart';

if (document.location.pathname.includes('cart')) {
  const uiCart = elementNullCheck(document, '.main-container-cart') as HTMLElement;

  const cart = new Cart(uiCart);
  cart.draw();

  const uiTotalContainer = elementNullCheck(document, '.total') as HTMLParagraphElement;
  const uiBasketContainer = elementNullCheck(document, '.basket-amount') as HTMLSpanElement;

  const header = new Header(uiTotalContainer, uiBasketContainer, cart);
  header.refreshHeader();
}
