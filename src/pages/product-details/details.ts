import './details.scss';
import Goods from '../../components/Goods';
import GoodsCatalogItem from '../../components/GoodsCatalogItem';
import { elementNullCheck } from '../../modules/helpers';
import Cart from '../../components/Cart';
import Header from '../../components/Header';
import StockButtons from '../../components/StockButtons';
import * as helpers from '../../modules/helpers';

export default class Breadcrumb {
  private category: string;
  private brand: string;
  private name: string;

  constructor(category: string, brand: string, name: string) {
    this.category = category;
    this.brand = brand;
    this.name = name;
  }

  fillBreadcrumb(categoryBox: Element, brandBox: Element, nameBox: Element) {
    categoryBox.innerHTML = this.category + ' /';
    brandBox.innerHTML = this.brand + ' /';
    nameBox.innerHTML = this.name;
  }
}

if (document.location.pathname.includes('details')) {
  const categoryContainer = elementNullCheck(document, '.product-category');
  const brandContainer = elementNullCheck(document, '.product-brand');
  const nameContainer = elementNullCheck(document, '.product-name');
  const currentProductID = +document.location.search.toString().split('=')[1];
  const currentProduct = new Goods(currentProductID);

  const cart = new Cart();

  const uiHeader = elementNullCheck(document, '.header-content') as HTMLElement;
  const header = new Header(uiHeader);
  header.refresh();

  const infoContainer = elementNullCheck(document, '.info-stock-container') as HTMLElement;
  const stock = new StockButtons(infoContainer, currentProduct, cart, header);
  stock.draw();

  const uiElement = elementNullCheck(document, '.main-container-product') as HTMLElement;
  const currentItem = new GoodsCatalogItem(uiElement, currentProduct, cart);
  currentItem.fillProductInfo();

  function fillProductPage(product: Goods): void {
    const fullName = elementNullCheck(document, '.brand-and-title');
    const sidePicturesContainer = elementNullCheck(document, '.side-pictures');
    const selectedPicture = elementNullCheck(document, '.selected-picture');
    const infoTitle = elementNullCheck(document, '.info-title');
    const infoBrand = elementNullCheck(document, '.info-brand');
    const infoRating = elementNullCheck(document, '.info-rating');
    const infoDiscount = elementNullCheck(document, '.info-discount');
    const infoDescription = elementNullCheck(document, '.info-description');
    const infoStock = elementNullCheck(document, '.info-stock');
    const infoPrice = elementNullCheck(document, '.info-price');

    fullName.innerHTML = `${product.brand} ${product.title}`;
    infoTitle.innerHTML = `Product name: ${product.title}`;
    infoBrand.innerHTML = `Brand: ${product.brand}`;
    infoRating.innerHTML = `Rating: ${product.rating}`;
    infoDiscount.innerHTML = `Discount percentage: ${product.discountPercentage}%`;
    infoDescription.innerHTML = `Description: ${product.description}`;
    infoStock.innerHTML = `Stock: ${product.stock}`;
    infoPrice.innerHTML = `Price: ${helpers.formatAmount(product.stock)}`;

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
    displaySelectedPicture(selectedPicture, product.images, product.title, 0);
    //stock.setPrice(infoPrice, product.price, 1);
  }

  function addPictures(parent: Element, images: string[]): void {
    for (let i = 0; i < images.length; i++) {
      const picture = document.createElement('div');
      picture.classList.add('small-picture');
      picture.style.backgroundImage = `url("${images[i]}")`;
      picture.setAttribute('id', `${i}`);
      parent.appendChild(picture);
    }
  }

  function displaySelectedPicture(parent: Element, images: string[], productName: string, imageID: number): void {
    parent.setAttribute('alt', `${productName}`);
    parent.setAttribute('src', images[imageID]);
  }

  const pageBreadcrumb = new Breadcrumb(currentProduct.category, currentProduct.brand, currentProduct.title);
  pageBreadcrumb.fillBreadcrumb(categoryContainer, brandContainer, nameContainer);
  fillProductPage(currentProduct);
}
