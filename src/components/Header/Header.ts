import Goods from '../Goods/Goods';
import Cart from '../Cart/Cart';

export default class Header {
  public uiTotal: HTMLParagraphElement;
  public uiBasket: HTMLSpanElement;
  public goods?: Goods;
  public cart: Cart;

  constructor(uiTotal: HTMLParagraphElement, uiBasket: HTMLSpanElement, cart: Cart, goods?: Goods) {
    this.uiTotal = uiTotal;
    this.uiBasket = uiBasket;
    this.goods = goods;
    this.cart = cart;
  }

  refreshHeader(): void {
    this.uiBasket.innerHTML = `${this.cart.getLength()}`;
    this.uiTotal.innerHTML = `Total: $${this.cart.getTotal()}`;
  }
}
