import Goods from '../Goods/Goods';

export default class Cart {
  private readonly uiCart: HTMLElement | undefined;
  goods: Goods[] = [];

  constructor(uiCart?: HTMLElement) {
    this.uiCart = uiCart;
    this.restore();
  }

  draw() {
    if (!this.uiCart) return;
    let uiElement: HTMLElement;

    const uiTemplate: HTMLTemplateElement = this.uiCart.querySelector('#cart-item-template') as HTMLTemplateElement;
    const uiFragment: DocumentFragment = document.createDocumentFragment();

    this.goods.forEach((goods) => {
      const clone: HTMLElement = uiTemplate.content.cloneNode(true) as HTMLElement;

      const uiImage: HTMLImageElement = clone.querySelector('.small-picture') as HTMLImageElement;
      uiImage.src = goods.thumbnail;
      uiImage.alt = goods.title;

      uiElement = clone.querySelector('.info-title') as HTMLElement;
      uiElement.textContent = `Title: ${goods.title}`;

      uiElement = clone.querySelector('.info-brand') as HTMLElement;
      uiElement.textContent = `Brand: ${goods.brand}`;

      uiElement = clone.querySelector('.info-rating') as HTMLElement;
      uiElement.textContent = `Rating: ${goods.rating}`;

      uiElement = clone.querySelector('.info-discount') as HTMLElement;
      uiElement.textContent = `Discount: ${goods.discountPercentage}`;

      uiElement = clone.querySelector('.info-description') as HTMLElement;
      uiElement.textContent = `Description: ${goods.description}`;

      uiElement = clone.querySelector('.info-stock') as HTMLElement;
      uiElement.textContent = `Stock: ${goods.stock}`;

      uiElement = clone.querySelector('.info-price') as HTMLElement;
      uiElement.textContent = `Price: $${goods.price}`;

      uiFragment.append(clone);
    });

    const uiCartItems = this.uiCart.querySelector('.cart-items') as HTMLElement;
    uiCartItems.innerHTML = '';
    uiCartItems.append(uiFragment);

    uiElement = this.uiCart.querySelector('.total-quantity') as HTMLElement;
    uiElement.textContent = `Products: ${this.getLength()}`;

    uiElement = this.uiCart.querySelector('.total-amount') as HTMLElement;
    uiElement.textContent = `Total: $${this.getTotal()}`;
  }

  has(goods: Goods): boolean {
    return this.goods.includes(goods);
  }

  add(goods: Goods): void {
    this.goods.push(goods);
    this.save();
  }

  drop(goods: Goods): void {
    this.goods = this.goods.filter((item) => item.id !== goods.id);
    this.save();
  }

  getLength(): number {
    return this.goods.length;
  }

  getTotal(): number {
    return this.goods.reduce((total, goods) => total + goods.price, 0);
  }

  getEntries(): Goods[] {
    return this.goods;
  }

  private save(): void {
    const goods: number[] = this.goods.map((item) => item.id);
    localStorage.setItem('rs-online-store-cart-goods', JSON.stringify(goods));
  }

  private restore(): void {
    const goods: number[] = JSON.parse(localStorage.getItem('rs-online-store-cart-goods') as string) || [];
    this.goods = goods.map((id) => new Goods(id));
  }
}
