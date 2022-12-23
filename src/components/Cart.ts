import CartItem from './CartItem';
import Goods from './Goods';
import { PromoCode } from '../modules/types';
import promoCodes from '../modules/promo-codes';
import * as helpers from '../modules/helpers';

interface SavedCart {
  promo: string[],
  items: {
    id: number;
    qnt: number;
  }[]
}

export default class Cart {
  private readonly uiCart: HTMLElement | undefined;
  items: CartItem[] = [];
  promoCodes: Set<PromoCode> = new Set();

  constructor(uiCart?: HTMLElement) {
    this.uiCart = uiCart;
    this.restore();
  }

  draw(): void {
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

  refresh(): void {
    if (!this.uiCart) return;

    const uiTotalQuantity = this.uiCart.querySelector('.total-quantity') as HTMLElement;
    uiTotalQuantity.textContent = `Products: ${this.getTotalQuantity()}`;

    const uiTotalAmount = this.uiCart.querySelector('.total-amount') as HTMLElement;
    uiTotalAmount.textContent = `Total: ${helpers.formatAmount(this.getTotalAmount())}`;

    const uiPromoCodes = this.uiCart.querySelector('.promo-codes') as HTMLElement;
    uiPromoCodes.innerHTML = '';

    if (this.promoCodes.size > 0) {
      const uiFullAmount = uiTotalAmount.cloneNode(true) as HTMLElement;
      uiFullAmount.textContent = `Total: ${helpers.formatAmount(this.getFullAmount())}`;
      uiFullAmount.classList.remove('total-amount');
      uiFullAmount.classList.add('full-amount');
      uiTotalAmount.prepend(uiFullAmount);

      this.promoCodes.forEach((code) => {
        const li = document.createElement('li');
        li.textContent = code.id;
        uiPromoCodes.append(li);

        const bt = document.createElement('button');
        bt.textContent = 'Delete';
        bt.addEventListener('click', () => this.deletePromoCode(code));
        uiPromoCodes.append(bt);
      });
    } else {
      const uiFullAmount = this.uiCart.querySelector('full-amount');
      uiFullAmount?.remove();
    }
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

  getTotalQuantity(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalAmount(): number {
    const fullAmount = this.getFullAmount();

    let totalAmount = fullAmount;
    this.promoCodes.forEach((code) => {
      totalAmount -= fullAmount * code.discount / 100;
    });

    return totalAmount;
  }

  getFullAmount(): number {
    return this.items.reduce((total, item) => total + item.goods.price * item.quantity, 0);
  }

  addPromoCode(code: PromoCode): void {
    this.promoCodes.add(code);
    document.body.dispatchEvent(new Event('carthasbeenchanged'));
  }

  deletePromoCode(code: PromoCode): void {
    this.promoCodes.delete(code);
    document.body.dispatchEvent(new Event('carthasbeenchanged'));
  }

  save(): void {
    const cart: SavedCart = {
      items:
        this.items
          .filter((item) => item.quantity > 0)
          .map((item) => {
            return { id: item.goods.id, qnt: item.quantity }
          }),
      promo:
        Array.from(this.promoCodes).map((code) => code.id)
    };
    localStorage.setItem('rs-online-store-cart', JSON.stringify(cart));
  }

  private restore(): void {
    const cart: SavedCart = JSON.parse(localStorage.getItem('rs-online-store-cart') as string) || { promo: [], items: [] };
    this.items = cart.items.map((item) => new CartItem(new Goods(item.id), item.qnt));
    cart.promo.forEach((promo) => {
      const code = promoCodes.find((code) => code.id === promo);
      if (code) {
        this.promoCodes.add(code);
      }
    });
  }
}
