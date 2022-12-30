import Cart from './Cart';
import Goods from './Goods';
import Header from './Header';

export default class StockButtons {
  private parent: HTMLElement;
  private goods: Goods;
  private cart: Cart;
  private header: Header;

  constructor(parent: HTMLElement, goods: Goods, cart: Cart, header: Header) {
    this.parent = parent;
    this.goods = goods;
    this.cart = cart;
    this.header = header;
  }

  draw(): void {
    const stockSelector = document.createElement('div');
    stockSelector.classList.add('main-text');
    stockSelector.classList.add('stock-selector');

    const itemPrice = document.createElement('p');
    itemPrice.classList.add('info-price');
    itemPrice.classList.add('main-text');
    itemPrice.innerHTML = `Price: $${this.goods.price}`;

    const amountButtons = document.createElement('div');
    amountButtons.classList.add('amount-buttons');
    amountButtons.classList.add('main-text');

    const minusButton = document.createElement('button');
    minusButton.classList.add('amount-button');
    minusButton.classList.add('main-text');
    minusButton.classList.add('button-decrement');
    minusButton.innerHTML = '-';

    const selectedAmount = document.createElement('p');
    selectedAmount.classList.add('selected-stock');
    selectedAmount.classList.add('main-text');
    selectedAmount.innerHTML = `${this.getCurrentAmount(this.goods)}`;

    const plusButton = document.createElement('button');
    plusButton.classList.add('amount-button');
    plusButton.classList.add('main-text');
    plusButton.classList.add('button-increment');
    plusButton.innerHTML = '+';

    plusButton.addEventListener('click', () => this.incrementStock(this.goods, selectedAmount, this.cart));
    minusButton.addEventListener('click', () => this.decrementStock(this.goods, selectedAmount, this.cart));

    this.parent.appendChild(stockSelector);
    stockSelector.appendChild(itemPrice);
    stockSelector.appendChild(amountButtons);
    amountButtons.appendChild(minusButton);
    amountButtons.appendChild(selectedAmount);
    amountButtons.appendChild(plusButton);
    this.header.refresh();
  }

  incrementStock(goods: Goods, stock: HTMLParagraphElement, cart: Cart) {
    const amount = this.getCurrentAmount(goods);
    const maxStock = goods.stock;
    const currentStock = +stock.innerHTML;
    if (amount < maxStock && cart.has(goods)) {
      cart.add(goods);
      stock.innerHTML = `${currentStock + 1}`;
      this.header.refresh();
    } else if (!cart.has(goods)) {
      stock.innerHTML = `${currentStock + 1}`;
      this.header.refresh();
    }
  }

  decrementStock(goods: Goods, stock: HTMLParagraphElement, cart: Cart): void {
    const amount = this.getCurrentAmount(goods);
    const currentStock = +stock.innerHTML;
    if (amount > 1 && cart.has(goods) && currentStock > 1) {
      cart.add(goods, -1);
      stock.innerHTML = `${currentStock - 1}`;
      this.header.refresh();
    } else if (!cart.has(goods) && currentStock > 1) {
      stock.innerHTML = `${currentStock - 1}`;
      this.header.refresh();
    }
  }

  getCurrentAmount(goods: Goods): number {
    const cartItem = this.cart.find(goods);
    return (cartItem) ? cartItem.quantity : 1;
  }
}
