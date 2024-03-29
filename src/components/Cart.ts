import CartItem from './CartItem';
import Goods from './Goods';

import { PromoCodes, PromoCode, SavedCart } from '../modules/types';
import { CustomEvents, LocalStorageParameters } from '../modules/enums';
import promoCodes from '../modules/promo-codes';
import * as helpers from '../modules/helpers';

export default class Cart {
  private readonly uiCart: HTMLElement | undefined;

  items: CartItem[] = [];
  promoCodes: PromoCodes = new Set();
  searchQuery: URLSearchParams = new URLSearchParams(window.location.search);
  page = 1;
  itemsOnPage = 3;

  constructor(uiCart?: HTMLElement) {
    this.uiCart = uiCart;
    this.restore();

    if (this.uiCart) {
      this.parseQueryString();
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
    const visibleItems: CartItem[] = this.getVisibleItems();

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
    this.displayContent();

    const uiTotalQuantity = this.uiCart.querySelector('.total-quantity') as HTMLElement;
    uiTotalQuantity.textContent = `Products: ${this.getTotalQuantity()}`;

    const uiTotalAmount = this.uiCart.querySelector('.total-amount') as HTMLElement;
    uiTotalAmount.textContent = `Total: ${helpers.formatAmount(this.getTotalAmount())}`;

    const uiCurrentPage = this.uiCart.querySelector('.current-page') as HTMLElement;
    uiCurrentPage.textContent = `${this.page}/${this.getMaxPage()}`;

    this.displayPromoCodes(uiTotalAmount);
    this.searchQueryChange();
  }

  private displayContent(): void {
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
  }

  private displayPromoCodes(uiTotalAmount: HTMLElement): void {
    if (!this.uiCart) return;

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

  clear(): void {
    this.items = [];
    this.promoCodes = new Set();
    this.draw();
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
    const fullAmount: number = this.getFullAmount();

    let totalAmount: number = fullAmount;
    this.promoCodes.forEach((code) => {
      totalAmount -= (fullAmount * code.discount) / 100;
    });

    return totalAmount;
  }

  getFullAmount(): number {
    return this.items.reduce((total, item) => total + item.goods.price * item.quantity, 0);
  }

  addPromoCode(code: PromoCode): void {
    this.promoCodes.add(code);
    document.body.dispatchEvent(new Event(CustomEvents.cartHasBeenChanged));
  }

  deletePromoCode(code: PromoCode): void {
    this.promoCodes.delete(code);
    document.body.dispatchEvent(new Event(CustomEvents.cartHasBeenChanged));
  }

  private getVisibleItems(): CartItem[] {
    const min = this.page * this.itemsOnPage - this.itemsOnPage;
    const max = this.page * this.itemsOnPage;
    return this.items.slice(min, max);
  }

  private getMaxPage(): number {
    const maxPage = Math.ceil(this.items.length / this.itemsOnPage);
    return maxPage > 0 ? maxPage : 1;
  }

  private recalculateCurrentPage(): void {
    const maxPage = this.getMaxPage();
    this.page = this.page > maxPage ? maxPage : this.page;
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
      items: this.items.map((item) => {
        return { id: item.goods.id, qnt: item.quantity };
      }),
      promo: Array.from(this.promoCodes).map((code) => code.id),
      page: this.page,
      itemsOnPage: this.itemsOnPage,
    };
    localStorage.setItem(LocalStorageParameters.cart, JSON.stringify(cart));
  }

  private restore(): void {
    const initialCart: SavedCart = {
      promo: [],
      items: [],
      page: this.page,
      itemsOnPage: this.itemsOnPage,
    };

    const cart: SavedCart = JSON.parse(localStorage.getItem(LocalStorageParameters.cart) as string) || initialCart;

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

  parseQueryString(): void {
    if (this.searchQuery && this.uiCart) {
      if (this.searchQuery.has('page')) {
        const page = this.searchQuery.get('page') as string;
        this.page = +page;
        const uiCurrentPage = this.uiCart.querySelector('.current-page') as HTMLElement;
        uiCurrentPage.textContent = `${this.page}/${this.getMaxPage()}`;
      }
      if (this.searchQuery.has('items')) {
        const itemsPerPage = this.searchQuery.get('items') as string;
        this.itemsOnPage = +itemsPerPage;
        const uiItemsOnPage = this.uiCart.querySelector('.items-on-page-value') as HTMLInputElement;
        uiItemsOnPage.value = this.itemsOnPage.toString();
      }
    }
    this.save();
  }

  searchQueryChange(): void {
    if (this.searchQuery.has('page')) {
      this.searchQuery.delete('page');
    }
    if (this.searchQuery.has('items')) {
      this.searchQuery.delete('items');
    }
    this.searchQuery.append('page', this.page.toString());
    this.searchQuery.append('items', this.itemsOnPage.toString());

    const questionMark = !this.searchQuery.toString() || this.searchQuery.toString()[0] === '?' ? '' : '?';
    window.history.replaceState({}, '', `${window.location.pathname}${questionMark}${this.searchQuery.toString()}`);
  }
}
