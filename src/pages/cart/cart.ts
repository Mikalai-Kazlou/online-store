import './cart.scss';

import { elementNullCheck } from '../../modules/helpers';
import Header from '../../components/Header';
import Cart from '../../components/Cart';

if (document.location.pathname.includes('cart')) {
  function onChangeCart() {
    cart.save();
    cart.refresh();
    header.refresh();
  }

  const uiCart = elementNullCheck(document, '.main-container-cart') as HTMLElement;
  const cart = new Cart(uiCart);
  cart.draw();

  const uiHeader = elementNullCheck(document, '.header-content') as HTMLElement;
  const header = new Header(uiHeader);
  header.refresh();

  document.body.addEventListener('carthasbeenchanged', onChangeCart, false);
}
