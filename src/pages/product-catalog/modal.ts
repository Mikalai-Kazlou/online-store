import goodsData from '../../modules/goods';
import { elementNullCheck } from '../../modules/helpers';
import Header from '../../components/Header';
import Cart from '../../components/Cart';
import GoodsCatalogItem from '../../components/GoodsCatalogItem';
import Goods from '../../components/Goods';

if (document.location.pathname === '/' || document.location.pathname === '/index.html') {
  const modal: HTMLElement = elementNullCheck(document, '.modal') as HTMLElement;
  const overlay: HTMLElement = document.querySelector('.overlay') as HTMLElement;
  const btnCloseModal: HTMLElement = document.querySelector('.close-modal') as HTMLElement;
  const btnOpenModal: HTMLElement = document.querySelector('.goods-items') as HTMLElement;

  function addModalProduct(id: number, parent: HTMLElement): void {
    const good = document.createElement('button');
    good.classList.add('good-item-modal');

    const picture = document.createElement('div');
    picture.classList.add('picture');
    picture.classList.add('big-picture');
    picture.style.backgroundImage = `url("${goodsData.products[id - 1].images[0]}")`;

    const goodInfo = document.createElement('div');
    goodInfo.classList.add('good-info');

    const productName = document.createElement('p');
    productName.innerHTML = `${goodsData.products[id - 1].title}`;
    productName.classList.add('main-text');

    const price = document.createElement('p');
    price.classList.add('main-text');
    price.innerHTML = `$${goodsData.products[id - 1].price}`;

    const inStock = document.createElement('p');
    inStock.classList.add('small-text');
    inStock.innerHTML = `In stock: ${goodsData.products[id - 1].stock}`;

    const rating = document.createElement('p');
    rating.classList.add('small-text');
    rating.innerHTML = `Rating: ${goodsData.products[id - 1].rating}`;

    const description = document.createElement('p');
    description.classList.add('small-text');
    description.innerHTML = `${goodsData.products[id - 1].description}`;

    const amountButtons = document.createElement('div');
    amountButtons.classList.add('amount-buttons');
    amountButtons.classList.add('main-text');

    const minusButton = document.createElement('button');
    minusButton.classList.add('amount-button');
    minusButton.classList.add('main-text');
    minusButton.innerHTML = '-';

    const selectedAmount = document.createElement('p');
    selectedAmount.classList.add('main-text');
    selectedAmount.innerHTML = '1';

    const plusButton = document.createElement('button');
    plusButton.classList.add('amount-button');
    plusButton.classList.add('main-text');
    plusButton.innerHTML = '+';

    const addToCart = document.createElement('button');
    addToCart.classList.add('add-to-cart');
    addToCart.classList.add('big-button');
    addToCart.innerHTML = `Add to cart`;

    parent.appendChild(good);
    good.setAttribute('id', goodsData.products[id - 1].id.toString());
    good.appendChild(picture);
    good.appendChild(goodInfo);
    goodInfo.appendChild(productName);
    goodInfo.appendChild(price);
    goodInfo.appendChild(inStock);
    goodInfo.appendChild(rating);
    goodInfo.appendChild(description);
    goodInfo.appendChild(amountButtons);
    amountButtons.appendChild(minusButton);
    amountButtons.appendChild(selectedAmount);
    amountButtons.appendChild(plusButton);
    goodInfo.appendChild(addToCart);

    const cart = new Cart();
    const currentProductID = goodsData.products[id - 1].id;
    const currentProduct = new Goods(currentProductID);
    const uiElement = good;
    const currentItem = new GoodsCatalogItem(uiElement, currentProduct, cart);
    currentItem.fillProductInfo();
  }

  const openModal = function (event: Event): void {
    if (event.target) {
      const target = event.target as HTMLButtonElement;
      const clickedOption = target.closest('button');
      if (clickedOption) {
        const id: number = +clickedOption.id;
        addModalProduct(id, modal);
        modal.classList.remove('hide');
        overlay.classList.remove('hide');
      }
    }
  };

  const closeModal = function (): void {
    const modalContent: HTMLElement = <HTMLElement>document.querySelector('.modal');
    removeItem(modalContent);
    modal.classList.add('hide');
    overlay.classList.add('hide');
  };

  function removeItem(parent: HTMLElement): void {
    while (parent.firstChild) {
      parent.removeChild(parent.lastChild as Node);
    }
  }

  btnOpenModal.addEventListener('click', openModal);
  btnCloseModal.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
}
