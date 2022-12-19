import Cart from '../Cart/Cart';
import Goods from '../Goods/Goods';
import Header from '../Header/Header';
import { elementNullCheck } from '../../types/type-checks';

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
    const itemPrice = document.createElement('p');
    itemPrice.classList.add('info-price');
    itemPrice.classList.add('main-text');
    itemPrice.innerHTML = `$${this.goods.price}`

    const amountButtons = document.createElement('div');
    amountButtons.classList.add('amount-buttons');
    amountButtons.classList.add('main-text');
    amountButtons.addEventListener('click', this.setStock);

    const minusButton = document.createElement('button');
    minusButton.classList.add('amount-button');
    minusButton.classList.add('main-text');
    minusButton.innerHTML = '-';

    const selectedAmount = document.createElement('p');
    selectedAmount.classList.add('selected-stock');
    selectedAmount.classList.add('main-text');
    selectedAmount.innerHTML = '1';

    const plusButton = document.createElement('button');
    plusButton.classList.add('amount-button');
    plusButton.classList.add('main-text');
    plusButton.innerHTML = '+';

    this.parent.appendChild(itemPrice);
    this.parent.appendChild(amountButtons);
    amountButtons.appendChild(minusButton);
    amountButtons.appendChild(selectedAmount);
    amountButtons.appendChild(plusButton);
  }

  setStock(event: Event): void {
    console.log(this.goods)
    const selectedAmount = elementNullCheck(document, '.selected-stock');
    let currentStock = +selectedAmount.innerHTML || 1;
    const maxStock = this.goods.stock;
    const infoPrice = elementNullCheck(document, '.info-price');
    if (event.target) {
      const target = event.target as HTMLButtonElement;
      const clickedOption = target.closest('button');
      if (clickedOption?.innerHTML === '+' && currentStock < maxStock) {
        currentStock++;
        selectedAmount.innerHTML = `${currentStock}`;
        this.setPrice(infoPrice, this.goods.price, currentStock);
        if (this.cart.has(this.goods)) {
          this.cart.drop(this.goods);
          for (let i = 0; i < currentStock; i++) {
            this.cart.add(this.goods);
          }
        }
      } else if (clickedOption?.innerHTML === '-' && currentStock > 1) {
        currentStock--;
        selectedAmount.innerHTML = `${currentStock}`;
        this.setPrice(infoPrice, this.goods.price, currentStock);
        if (this.cart.has(this.goods)) {
          this.cart.drop(this.goods);
        }
      }
    }
    this.header.refreshHeader();
  }

  setPrice(parent: Element, price: number, selectedStock: number) {
    const finalPrice = price * selectedStock;
    parent.innerHTML = `$${finalPrice}`;
  }
}