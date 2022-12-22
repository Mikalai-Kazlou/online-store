import CartItem from './CartItem';
import Goods from './Goods';

interface SavedCartItems {
  id: number;
  quantity: number;
}

export default class Cart {
  private readonly uiCart: HTMLElement | undefined;
  items: CartItem[] = [];

  constructor(uiCart?: HTMLElement) {
    this.uiCart = uiCart;
    this.restore();
  }

  draw() {
    if (!this.uiCart) return;

    const uiTemplate: HTMLTemplateElement = this.uiCart.querySelector('#cart-item-template') as HTMLTemplateElement;
    const uiFragment: DocumentFragment = document.createDocumentFragment();

    this.items.forEach((item) => {
      const clone: HTMLElement = uiTemplate.content.cloneNode(true) as HTMLElement;
      item.draw(clone);
      uiFragment.append(clone);
    });

    const uiCartItems = this.uiCart.querySelector('.cart-items') as HTMLElement;
    uiCartItems.innerHTML = '';
    uiCartItems.append(uiFragment);

    this.refresh();
  }

  refresh() {
    if (!this.uiCart) return;
    let uiElement: HTMLElement;

    uiElement = this.uiCart.querySelector('.total-quantity') as HTMLElement;
    uiElement.textContent = `Products: ${this.getTotalQuantity()}`;

    uiElement = this.uiCart.querySelector('.total-amount') as HTMLElement;
    uiElement.textContent = `Total: $${this.getTotalAmount()}`;
  }

  has(goods: Goods): boolean {
    return Boolean(this.items.find((item) => item.goods === goods));
  }

  find(goods: Goods): CartItem | undefined {
    return this.items.find((item) => item.goods === goods);
  }

  add(goods: Goods, quantity = 1): void {
    if (this.has(goods)) {
      const item = this.items.find((item) => item.goods === goods);
      if (item) {
        item.quantity += quantity;
      }
    } else {
      this.items.push(new CartItem(goods, quantity));
    }
    this.save();
  }

  drop(goods: Goods): void {
    this.items = this.items.filter((item) => item.goods.id !== goods.id);
    this.save();
  }

  getLength(): number {
    return this.items.length;
  }

  getTotalQuantity() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalAmount(): number {
    return this.items.reduce((total, item) => total + item.goods.price * item.quantity, 0);
  }

  /*getEntries(): Goods[] {
    return this.items.map((item) => item.goods);
  }*/

  save(): void {
    const items: SavedCartItems[] =
      this.items.map((item) => {
        return { id: item.goods.id, quantity: item.quantity }
      });
    localStorage.setItem('rs-online-store-cart', JSON.stringify(items));
  }

  private restore(): void {
    const items: SavedCartItems[] = JSON.parse(localStorage.getItem('rs-online-store-cart') as string) || [];
    this.items = items.map((item) => new CartItem(new Goods(item.id), item.quantity));
  }
}
