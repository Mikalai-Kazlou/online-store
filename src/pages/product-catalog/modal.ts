import goodsData from '../../modules/goods';
import { elementNullCheck, formatAmount } from '../../modules/helpers';

if (
  document.location.pathname === '/' ||
  document.location.pathname === '/online-store/' ||
  document.location.pathname.includes('index')
) {
  const modal: HTMLElement = elementNullCheck(document, '.modal') as HTMLElement;
  const overlay: HTMLElement = document.querySelector('.overlay') as HTMLElement;
  const btnOpenModal: HTMLElement = document.querySelector('.goods-items') as HTMLElement;

  function addModalProduct(id: number, parent: HTMLElement): void {
    const closeIcon = document.createElement('button');
    closeIcon.classList.add('close-modal');
    closeIcon.innerHTML = 'X';

    const good = document.createElement('button');
    good.classList.add('good-item-modal');

    const picture = document.createElement('div');
    picture.classList.add('picture');
    picture.classList.add('big-picture');
    picture.style.backgroundImage = `url("${goodsData.products[id - 1].images[0] || goodsData.products[0].images[0]}")`;

    const goodInfo = document.createElement('div');
    goodInfo.classList.add('good-info');

    const productName = document.createElement('p');
    productName.innerHTML = `${goodsData.products[id - 1].title}`;
    productName.classList.add('main-text');

    const brand = document.createElement('p');
    brand.innerHTML = `Brand: ${goodsData.products[id - 1].brand}`;
    brand.classList.add('main-text');

    const price = document.createElement('p');
    price.classList.add('main-text');

    price.innerHTML = `Price: ${formatAmount(goodsData.products[id - 1].price)}`;

    const discount = document.createElement('p');
    discount.classList.add('main-text');
    discount.innerHTML = `Discount: ${goodsData.products[id - 1].discountPercentage}%`;

    const inStock = document.createElement('p');
    inStock.classList.add('small-text');
    inStock.innerHTML = `In stock: ${goodsData.products[id - 1].stock}`;

    const rating = document.createElement('p');
    rating.classList.add('small-text');
    rating.innerHTML = `Rating: ${goodsData.products[id - 1].rating}`;

    const description = document.createElement('p');
    description.classList.add('small-text');
    description.innerHTML = `Description: \n \n${goodsData.products[id - 1].description}`;

    parent.appendChild(closeIcon);
    parent.appendChild(good);
    good.setAttribute('id', goodsData.products[id - 1].id.toString());
    good.appendChild(picture);
    good.appendChild(goodInfo);
    goodInfo.appendChild(productName);
    goodInfo.appendChild(brand);
    goodInfo.appendChild(price);
    goodInfo.appendChild(discount);
    goodInfo.appendChild(inStock);
    goodInfo.appendChild(rating);
    goodInfo.appendChild(description);

    closeIcon.addEventListener('click', () => closeModal());
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
  overlay.addEventListener('click', closeModal);
}
