import Cart from './Cart';
import * as helpers from '../modules/helpers';

export default class Header {
  public uiHeader: HTMLElement;

  constructor(uiHeader: HTMLElement) {
    this.uiHeader = uiHeader;
  }

  refresh(): void {
    const cart = new Cart();

    const uiTotal = this.uiHeader.querySelector('.total') as HTMLElement;
    uiTotal.innerHTML = `Total: ${helpers.formatAmount(cart.getTotalAmount())}`;

    const uiBasket = this.uiHeader.querySelector('.basket-amount') as HTMLElement;
    uiBasket.innerHTML = `${cart.getTotalQuantity()}`;
  }
}
