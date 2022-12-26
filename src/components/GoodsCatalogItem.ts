import Cart from './Cart';
import Goods from './Goods';
import Header from './Header';

export default class GoodsCatalogItem {
  private uiElement: HTMLElement;
  private goods: Goods;
  private cart: Cart;
  private header?: Header;

  constructor(uiElement: HTMLElement, goods: Goods, cart: Cart, header?: Header) {
    this.uiElement = uiElement;
    this.goods = goods;
    this.cart = cart;
    this.header = header;
  }

  draw() {
    const uiHeader = document.querySelector('.header-content') as HTMLElement;
    const header = new Header(uiHeader);

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
    uiDescription.classList.add('product-description');
    uiDescription.innerHTML = `${this.goods.description}`;

    const uiGoodButtons = document.createElement('div');
    uiGoodButtons.classList.add('good-buttons');

    const uiAddToCart = document.createElement('button');
    uiAddToCart.classList.add('add-to-cart');
    uiAddToCart.classList.add('goods-button');
    uiAddToCart.addEventListener('click', () => this.addToCart(this.goods));
    uiAddToCart.addEventListener('click', () => header.refresh());

    const uiDetails = document.createElement('button');
    uiDetails.classList.add('details');
    uiDetails.classList.add('goods-button');
    uiDetails.textContent = 'Details';
    uiDetails.addEventListener('click', () => this.showDetails(this.goods));

    this.uiElement.setAttribute('id', this.goods.id.toString());
    this.uiElement.append(uiPicture);
    this.uiElement.append(uiProductName);
    this.uiElement.append(uiPrice);
    this.uiElement.append(uiDescription);
    this.uiElement.append(uiGoodButtons);

    uiGoodButtons.append(uiAddToCart);
    uiGoodButtons.append(uiDetails);

    this.refresh();
  }

  fillProductInfo() {
    const uiAddToCart = this.uiElement.querySelector('.add-to-cart') as HTMLButtonElement;
    uiAddToCart.addEventListener('click', () => this.addToCart(this.goods));
    this.refresh();
  }

  saveState() {
    const uiStockNumber = this.uiElement.querySelector('.selected-stock') as HTMLParagraphElement;
    const objectToStringify = {
      ID: this.goods.id,
      Price: this.goods.price * +uiStockNumber.innerHTML,
      SelectedStock: uiStockNumber.innerHTML,
    };
    localStorage.setItem('RS-Saved-Products', JSON.stringify(objectToStringify));
  }

  private refresh() {
    const uiHeader = document.querySelector('.header-content') as HTMLElement;
    const header = new Header(uiHeader);

    const uiAddToCart = this.uiElement.querySelector('.add-to-cart') as HTMLElement;
    if (!this.cart.has(this.goods)) {
      uiAddToCart.textContent = 'Add to Cart';
    } else {
      uiAddToCart.textContent = 'Drop from Cart';
    }
    header.refresh();
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
