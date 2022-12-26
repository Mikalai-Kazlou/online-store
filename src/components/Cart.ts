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
  }[],
  page: number,
  itemsOnPage: number
}

export default class Cart {
  private readonly uiCart: HTMLElement | undefined;
  items: CartItem[] = [];
  promoCodes: Set<PromoCode> = new Set();
  page: number = 1;
  itemsOnPage: number = 3;

  constructor(uiCart?: HTMLElement) {
    this.uiCart = uiCart;
    this.restore();

    if (this.uiCart) {
      const uiItemsOnPage = this.uiCart.querySelector('.items-on-page-value') as HTMLInputElement;
      uiItemsOnPage.value = this.itemsOnPage.toString();
      uiItemsOnPage.addEventListener('change', () => this.setItemsOnPage());

      const uiPrevPage = this.uiCart.querySelector('.prev-page') as HTMLElement;
      uiPrevPage.addEventListener('click', () => this.setPreviousPage());

      const uiCurrentPage = this.uiCart.querySelector('.current-page') as HTMLElement;
      uiCurrentPage.textContent = `${this.page}`;

      const uiNextPage = this.uiCart.querySelector('.next-page') as HTMLElement;
      uiNextPage.addEventListener('click', () => this.setNextPage());
    }
  }

  draw(): void {
    this.save();

    if (!this.uiCart) return;
    this.recalculateCurrentPage();

    const uiTemplate: HTMLTemplateElement = this.uiCart.querySelector('#cart-item-template') as HTMLTemplateElement;
    const uiFragment: DocumentFragment = document.createDocumentFragment();
    const visibleItems = this.getVisibleItems();

    visibleItems.forEach((item) => {
      const clone: HTMLElement = uiTemplate.content.cloneNode(true) as HTMLElement;
      item.draw(clone, this.items.indexOf(item));
      uiFragment.append(clone);
    });

    const uiCartItems = this.uiCart.querySelector('.cart-items') as HTMLElement;
    uiCartItems.innerHTML = '';
    uiCartItems.append(uiFragment);

    this.refresh();
  }

  refresh(): void {
    if (!this.uiCart) return;

    const uiMessage = this.uiCart.querySelector('.error-message') as HTMLElement;
    const uiCartContent = this.uiCart.querySelector('.cart-content') as HTMLElement;
    const uiCartSummary = this.uiCart.querySelector('.cart-summary') as HTMLElement;

    if (this.items.length > 0) {
      uiMessage.classList.add('no-display');
      uiCartContent.classList.remove('no-display');
      uiCartSummary.classList.remove('no-display');
    } else {
      uiMessage.classList.remove('no-display');
      uiCartContent.classList.add('no-display');
      uiCartSummary.classList.add('no-display');
    }

    const uiTotalQuantity = this.uiCart.querySelector('.total-quantity') as HTMLElement;
    uiTotalQuantity.textContent = `Products: ${this.getTotalQuantity()}`;

    const uiTotalAmount = this.uiCart.querySelector('.total-amount') as HTMLElement;
    uiTotalAmount.textContent = `Total: ${helpers.formatAmount(this.getTotalAmount())}`;

    const uiCurrentPage = this.uiCart.querySelector('.current-page') as HTMLElement;
    uiCurrentPage.textContent = `${this.page}/${this.getMaxPage()}`;

    const uiPromoCodes = this.uiCart.querySelector('.promo-codes') as HTMLElement;
    uiPromoCodes.innerHTML = '';

    if (this.promoCodes.size > 0) {
      const uiFullAmount = uiTotalAmount.cloneNode(true) as HTMLElement;
      uiFullAmount.textContent = `Total: ${helpers.formatAmount(this.getFullAmount())}`;
      uiFullAmount.classList.replace('total-amount', 'full-amount');
      uiTotalAmount.prepend(uiFullAmount);

      const uiTemplate: HTMLTemplateElement = this.uiCart.querySelector('#promo-code-template') as HTMLTemplateElement;
      this.promoCodes.forEach((code) => {
        const clone: HTMLElement = uiTemplate.content.cloneNode(true) as HTMLElement;

        const uiPromoText = clone.querySelector('.promo-text') as HTMLElement;
        uiPromoText.textContent = `${code.id} - ${code.discount}%`;

        const uiPromoDelete = clone.querySelector('.promo-delete') as HTMLElement;
        uiPromoDelete.addEventListener('click', () => this.deletePromoCode(code));

        uiPromoCodes.append(clone);
      });
    } else {
      const uiFullAmount = this.uiCart.querySelector('full-amount') as HTMLElement;
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
    this.draw();
  }

  drop(goods: Goods): void {
    this.items = this.items.filter((item) => item.goods.id !== goods.id);
    this.draw();
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

  private getVisibleItems(): CartItem[] {
    const min = this.page * this.itemsOnPage - this.itemsOnPage;
    const max = this.page * this.itemsOnPage;
    return this.items.slice(min, max);
  }

  private getMaxPage(): number {
    return Math.ceil(this.items.length / this.itemsOnPage);
  }

  private recalculateCurrentPage(): void {
    const maxPage = this.getMaxPage();
    if (this.page > maxPage) {
      this.page = maxPage;
    }
  }

  protected setNextPage(): void {
    if (this.page < this.getMaxPage()) {
      this.page++;
      this.draw();
    }
  }

  protected setPreviousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.draw();
    }
  }

  protected setItemsOnPage(): void {
    if (!this.uiCart) return;
    const uiItemsOnPage = this.uiCart.querySelector('.items-on-page-value') as HTMLInputElement;

    if (+uiItemsOnPage.value === 0) {
      uiItemsOnPage.value = `${this.itemsOnPage}`;
    }

    if (+uiItemsOnPage.value !== this.itemsOnPage) {
      this.itemsOnPage = +uiItemsOnPage.value;
      this.draw();
    }
  }

  private save(): void {
    this.items = this.items.filter((item) => item.quantity > 0);
    const cart: SavedCart = {
      items:
        this.items
          .map((item) => {
            return { id: item.goods.id, qnt: item.quantity }
          }),
      promo:
        Array.from(this.promoCodes).map((code) => code.id),
      page: this.page,
      itemsOnPage: this.itemsOnPage
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
    this.page = cart.page;
    this.itemsOnPage = cart.itemsOnPage;
  }
}
