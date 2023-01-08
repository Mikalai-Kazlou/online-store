import './details.scss';

import Goods from '../../components/Goods';
import GoodsCatalogItem from '../../components/GoodsCatalogItem';
import Cart from '../../components/Cart';
import Header from '../../components/Header';
import StockButtons from '../../components/StockButtons';
import Breadcrumb from '../../components/Breadcrumb';

import { getNullCheckedElement } from '../../modules/helpers';
import * as helpers from '../../modules/helpers';
import { isDetailsPage } from '../../modules/pages';

if (isDetailsPage(document.location.pathname)) {
  const categoryContainer = getNullCheckedElement(document, '.product-category');
  const brandContainer = getNullCheckedElement(document, '.product-brand');
  const nameContainer = getNullCheckedElement(document, '.product-name');
  const currentProductID = +document.location.search.toString().split('=')[1];
  const currentProduct = new Goods(currentProductID);

  const cart = new Cart();

  const uiHeader = getNullCheckedElement(document, '.header-content') as HTMLElement;
  const header = new Header(uiHeader);
  header.refresh();

  const infoContainer = getNullCheckedElement(document, '.info-stock-container') as HTMLElement;
  const stock = new StockButtons(infoContainer, currentProduct, cart, header);
  stock.draw();

  const uiElement = getNullCheckedElement(document, '.main-container-product') as HTMLElement;
  const currentItem = new GoodsCatalogItem(uiElement, currentProduct, cart);
  currentItem.fillProductInfo();

  function fillProductPage(product: Goods): void {
    const fullName = getNullCheckedElement(document, '.brand-and-title');
    const sidePicturesContainer = getNullCheckedElement(document, '.side-pictures');
    const selectedPicture = getNullCheckedElement(document, '.selected-picture') as HTMLElement;
    const infoTitle = getNullCheckedElement(document, '.info-title');
    const infoBrand = getNullCheckedElement(document, '.info-brand');
    const infoRating = getNullCheckedElement(document, '.info-rating');
    const infoDiscount = getNullCheckedElement(document, '.info-discount');
    const infoDescription = getNullCheckedElement(document, '.info-description');
    const infoStock = getNullCheckedElement(document, '.info-stock');
    const infoPrice = getNullCheckedElement(document, '.info-price');

    fullName.innerHTML = `${product.brand} ${product.title}`;
    infoTitle.innerHTML = `Product name: ${product.title}`;
    infoBrand.innerHTML = `Brand: ${product.brand}`;
    infoRating.innerHTML = `Rating: ${product.rating}`;
    infoDiscount.innerHTML = `Discount percentage: ${product.discountPercentage}%`;
    infoDescription.innerHTML = `Description: ${product.description}`;
    infoStock.innerHTML = `Stock: ${product.stock}`;
    infoPrice.innerHTML = `Price: ${helpers.formatAmount(product.price)}`;

    function findImageID(event: Event): void {
      if (event.target) {
        const target = event.target as HTMLElement;
        const clickedOption = target.closest('div');
        if (clickedOption) {
          const id: number = +clickedOption.id;
          selectedPicture.setAttribute('alt', `${product.title}`);
          selectedPicture.setAttribute('src', product.images[id]);
        } else {
          selectedPicture.setAttribute('alt', `${product.title}`);
          selectedPicture.setAttribute('src', product.images[0]);
        }
      }
    }

    sidePicturesContainer.addEventListener('click', findImageID);

    addPictures(sidePicturesContainer, product.images);
    displaySelectedPicture(selectedPicture, product.images[0], product.title);
  }

  function addPictures(parent: Element, images: string[]): void {
    for (let i = 0; i < images.length; i++) {
      const picture = document.createElement('div');
      picture.classList.add('small-picture');
      helpers.loadImage(images[i], picture);
      picture.setAttribute('id', `${i}`);
      parent.appendChild(picture);
    }
  }

  function displaySelectedPicture(parent: HTMLElement, src: string, alt: string): void {
    const loadImage = (src: string, alt: string, uiImage: HTMLElement): void => {
      const image = new Image();
      image.src = src;
      image.onload = () => {
        uiImage.setAttribute('src', src);
        uiImage.setAttribute('alt', alt);
      };
      image.onerror = () => {
        setTimeout(() => loadImage(src, alt, uiImage), 1000);
      };
    }
    loadImage(src, alt, parent);
  }

  const pageBreadcrumb = new Breadcrumb(currentProduct.category, currentProduct.brand, currentProduct.title);
  pageBreadcrumb.fill(categoryContainer, brandContainer, nameContainer);
  fillProductPage(currentProduct);

  function buyNow(): void {
    if (!cart.has(currentProduct)) {
      currentItem.addToCart();
    }
    location.href = './cart.html?action=buy';
  }

  const uiBuyNow = document.querySelector('.buy-now');
  uiBuyNow?.addEventListener('click', buyNow);
}
