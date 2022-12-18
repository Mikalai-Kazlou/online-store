import Cart from '../Cart/Cart';
import Goods from '../Goods/Goods';
import Header from '../Header/Header';

export default class StockButtons {
  private parent: HTMLElement;
  private goods: Goods;
  private cart: Cart;
  private header?: Header;

  constructor(parent: HTMLElement, goods: Goods, cart: Cart, header?: Header) {
    this.parent = parent;
    this.goods = goods;
    this.cart = cart;
    this.header = header;
  }

  draw(): void {
    const amountButtons = document.createElement('div');
    amountButtons.classList.add('amount-buttons');
    amountButtons.classList.add('main-text');

    const minusButton = document.createElement('button');
    minusButton.classList.add('amount-button');
    minusButton.classList.add('main-text');
    minusButton.innerHTML = '-';

    const selectedAmount = document.createElement('p');
    selectedAmount.classList.add('main-text');
    selectedAmount.innerHTML = '1';

    const plusButton = document.createElement('button');
    plusButton.classList.add('amount-button');
    plusButton.classList.add('main-text');
    plusButton.innerHTML = '+';

    this.parent.appendChild(amountButtons);
    amountButtons.appendChild(minusButton);
    amountButtons.appendChild(selectedAmount);
    amountButtons.appendChild(plusButton);
  }
}