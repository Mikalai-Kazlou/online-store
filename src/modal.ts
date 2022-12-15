import goodsData from './goods';
import { elementNullCheck } from './types/type-checks';

const modal: HTMLElement = elementNullCheck(document, '.modal') as HTMLElement;
const overlay: HTMLElement = document.querySelector('.overlay') as HTMLElement;
const btnCloseModal: HTMLElement = document.querySelector('.close-modal') as HTMLElement;
const btnOpenModal: HTMLElement = document.querySelector('.goods-items') as HTMLElement;

function addModalProduct(id: number, parent: HTMLElement): void {
  let good = document.createElement('button');
  good.classList.add('good-item-modal');

  let picture = document.createElement('div');
  picture.classList.add('picture');
  picture.classList.add('big-picture');
  picture.style.backgroundImage = `url("${goodsData.products[id - 1].images[0]}")`;

  let goodInfo = document.createElement('div');
  goodInfo.classList.add('good-info');

  let productName = document.createElement('p');
  productName.innerHTML = `${goodsData.products[id - 1].title}`;
  productName.classList.add('main-text');

  let price = document.createElement('p');
  price.classList.add('main-text');
  price.innerHTML = `$${goodsData.products[id - 1].price}`;

  let inStock = document.createElement('p');
  inStock.classList.add('small-text');
  inStock.innerHTML = `In stock: ${goodsData.products[id - 1].stock}`;

  let description = document.createElement('p');
  description.classList.add('small-text');
  description.innerHTML = `${goodsData.products[id - 1].description}`;

  let amountButtons = document.createElement('div');
  amountButtons.classList.add('amount-buttons');
  amountButtons.classList.add('main-text');

  let minusButton = document.createElement('button');
  minusButton.classList.add('amount-button');
  minusButton.classList.add('main-text');
  minusButton.innerHTML = '-';

  let selectedAmount = document.createElement('p');
  selectedAmount.classList.add('main-text');
  selectedAmount.innerHTML = '1';

  let plusButton = document.createElement('button');
  plusButton.classList.add('amount-button');
  plusButton.classList.add('main-text');
  plusButton.innerHTML = '+';

  let addToCard = document.createElement('button');
  addToCard.classList.add('button-add-card');
  addToCard.classList.add('main-text');
  addToCard.innerHTML = `Add to card`;

  parent.appendChild(good);
  good.setAttribute('id', goodsData.products[id - 1].id.toString());
  good.appendChild(picture);
  good.appendChild(goodInfo);
  goodInfo.appendChild(productName);
  goodInfo.appendChild(price);
  goodInfo.appendChild(inStock);
  goodInfo.appendChild(description);
  goodInfo.appendChild(amountButtons);
  amountButtons.appendChild(minusButton);
  amountButtons.appendChild(selectedAmount);
  amountButtons.appendChild(plusButton);
  goodInfo.appendChild(addToCard);
}

let openModal = function (event: Event): void {
  if (event.target) {
    const target = event.target as HTMLButtonElement;
    const clickedOption = target.closest('button');
    if (clickedOption) {
      const id: number = +clickedOption.id;
      addModalProduct(id, modal);
      console.log(clickedOption);
      modal.classList.remove('hide');
      overlay.classList.remove('hide');
    }
  }
};

let closeModal = function (): void {
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
