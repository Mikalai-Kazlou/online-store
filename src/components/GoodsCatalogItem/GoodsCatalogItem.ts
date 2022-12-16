import Cart from "../Cart/Cart";
import Goods from "../Goods/Goods";

export default class GoodsCatalogItem {
  private uiElement: HTMLElement;
  private goods: Goods;
  private cart: Cart;

  constructor(uiElement: HTMLElement, goods: Goods, cart: Cart) {
    this.uiElement = uiElement;
    this.goods = goods;
    this.cart = cart;
  }

  draw() {
    const uiPicture = document.createElement('div');
    uiPicture.classList.add('picture');
    uiPicture.style.backgroundImage = `url("${this.goods.thumbnail}")`;

    const uiProductName = document.createElement('div');
    uiProductName.innerHTML = `${this.goods.title}`;
    uiProductName.classList.add('main-text');

    const uiPrice = document.createElement('div');
    uiPrice.classList.add('small-text');
    uiPrice.innerHTML = `$${this.goods.price}`;

    const uiDescription = document.createElement('div');
    uiDescription.classList.add('small-text');
    uiDescription.innerHTML = `${this.goods.description}`;

    const uiAddToCart = document.createElement('button');
    uiAddToCart.classList.add('add-to-cart');
    uiAddToCart.addEventListener('click', () => this.addToCart(this.goods));

    const uiDetails = document.createElement('button');
    uiDetails.classList.add('details');
    uiDetails.textContent = 'Details';
    uiDetails.addEventListener('click', () => this.showDetails(this.goods));

    this.uiElement.setAttribute('id', this.goods.id.toString());
    this.uiElement.append(uiPicture);
    this.uiElement.append(uiProductName);
    this.uiElement.append(uiPrice);
    this.uiElement.append(uiDescription);
    this.uiElement.append(uiAddToCart);
    this.uiElement.append(uiDetails);

    this.refresh();
  }

  private refresh() {
    const uiAddToCart = this.uiElement.querySelector('.add-to-cart') as HTMLElement;
    if (!this.cart.has(this.goods)) {
      uiAddToCart.textContent = 'Add to Cart';
    } else {
      uiAddToCart.textContent = 'Drop from Cart';
    }
  }

  private addToCart(goods: Goods) {
    if (this.cart.has(goods)) {
      this.cart.drop(goods);
    } else {
      this.cart.add(goods);
    }
    this.refresh();
  }

  private showDetails(goods: Goods) {
    location.href = `../../details.html?id=${goods.id}`;
  }
}