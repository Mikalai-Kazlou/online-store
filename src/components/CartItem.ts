import Goods from './Goods';

export default class CartItem {
  private uiQuantity: HTMLElement | undefined;
  goods: Goods;
  quantity = 1;

  constructor(goods: Goods, quantity: number) {
    this.goods = goods;
    this.quantity = quantity;
  }

  draw(uiCartItem: HTMLElement) {
    let uiElement: HTMLElement;

    const uiImage: HTMLImageElement = uiCartItem.querySelector('.small-picture') as HTMLImageElement;
    uiImage.src = this.goods.thumbnail;
    uiImage.alt = this.goods.title;

    uiElement = uiCartItem.querySelector('.info-title') as HTMLElement;
    uiElement.textContent = `Title: ${this.goods.title}`;

    uiElement = uiCartItem.querySelector('.info-brand') as HTMLElement;
    uiElement.textContent = `Brand: ${this.goods.brand}`;

    uiElement = uiCartItem.querySelector('.info-rating') as HTMLElement;
    uiElement.textContent = `Rating: ${this.goods.rating}`;

    uiElement = uiCartItem.querySelector('.info-discount') as HTMLElement;
    uiElement.textContent = `Discount: ${this.goods.discountPercentage}`;

    uiElement = uiCartItem.querySelector('.info-description') as HTMLElement;
    uiElement.textContent = `Description: ${this.goods.description}`;

    uiElement = uiCartItem.querySelector('.info-stock') as HTMLElement;
    uiElement.textContent = `Stock: ${this.goods.stock}`;

    uiElement = uiCartItem.querySelector('.info-price') as HTMLElement;
    uiElement.textContent = `Price: $${this.goods.price}`;

    this.uiQuantity = uiCartItem.querySelector('.selected-stock') as HTMLElement;
    this.uiQuantity.textContent = String(this.quantity);

    uiElement = uiCartItem.querySelector('.button-decrement') as HTMLElement;
    uiElement.addEventListener('click', () => this.decreaseQuantity());

    uiElement = uiCartItem.querySelector('.button-increment') as HTMLElement;
    uiElement.addEventListener('click', () => this.increaseQuantity());
  }

  refresh() {
    if (this.uiQuantity) {
      this.uiQuantity.textContent = String(this.quantity);
    }
  }

  increaseQuantity() {
    if (this.quantity < this.goods.stock) {
      this.quantity++;
      this.refresh();

      const event = new Event('carthasbeenchanged');
      document.body.dispatchEvent(event);
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
      this.refresh();

      const event = new Event('carthasbeenchanged');
      document.body.dispatchEvent(event);
    }
  }
}
