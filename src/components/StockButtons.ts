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
    this.header.refreshHeader();
  }

  incrementStock(goods: Goods, stock: HTMLParagraphElement, cart: Cart) {
    const priceContainer = document.querySelector('.info-price') as HTMLParagraphElement;
    const amount = this.getCurrentAmount(goods);
    const maxStock = goods.stock;
    let currentStock = +stock.innerHTML;
    if (amount < maxStock && cart.has(goods)) {
      cart.add(goods);
      stock.innerHTML = `${currentStock + 1}`;
      this.header.refreshHeader();
    } else if (!cart.has(goods)) {
      stock.innerHTML = `${currentStock + 1}`;
      this.header.refreshHeader();
    }
    this.setPrice(priceContainer, goods.price, +stock.innerHTML);
  }

  decrementStock(goods: Goods, stock: HTMLParagraphElement, cart: Cart): void {
    const priceContainer = document.querySelector('.info-price') as HTMLParagraphElement;
    const amount = this.getCurrentAmount(goods);
    let currentStock = +stock.innerHTML;
    if (amount > 1 && cart.has(goods) && currentStock > 1) {
      cart.drop(goods);
      stock.innerHTML = `${currentStock - 1}`;
      for (let index = 0; index < currentStock - 1; index++) {
        cart.add(goods);
      }
      this.header.refreshHeader();
    } else if (!cart.has(goods) && currentStock > 1) {
      stock.innerHTML = `${currentStock - 1}`;
      this.header.refreshHeader();
    }
    this.setPrice(priceContainer, goods.price, +stock.innerHTML);
  }

  getCurrentAmount(goods: Goods): number {
    const goodsArray = this.cart.getEntries().map((item) => item.id);
    let result = 1;
    if (goodsArray.filter((item) => item === goods.id).length > 0) {
      result = goodsArray.filter((item) => item === goods.id).length;
    } else {
      result = 1;
    }
    return result;
  }

  setPrice(parent: Element, price: number, selectedStock: number): void {
    const finalPrice = price * selectedStock;
    parent.innerHTML = `Price: $${finalPrice}`;
  }
}