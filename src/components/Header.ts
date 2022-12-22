import Goods from './Goods';
import Cart from './Cart';

export default class Header {
  public uiHeader: HTMLElement;

  constructor(uiHeader: HTMLElement) {
    this.uiHeader = uiHeader;
  }

  refresh(): void {
    const cart = new Cart();

    const uiTotal = this.uiHeader.querySelector('.total') as HTMLElement;
    uiTotal.innerHTML = `Total: $${cart.getTotalAmount()}`;

    const uiBasket = this.uiHeader.querySelector('.basket-amount') as HTMLElement;
    uiBasket.innerHTML = `${cart.getTotalQuantity()}`;
  }
}
