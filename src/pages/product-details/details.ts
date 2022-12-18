import goodsData from '../../goods';
import Goods from '../../components/Goods/Goods';
import GoodsCatalogItem from '../../components/GoodsCatalogItem/GoodsCatalogItem';
import { elementNullCheck } from '../../types/type-checks';
import Cart from '../../components/Cart/Cart';
import Header from '../../components/Header/Header';

const categoryContainer = elementNullCheck(document, '.product-category');
const brandContainer = elementNullCheck(document, '.product-brand');
const nameContainer = elementNullCheck(document, '.product-name');
const currentProductID = +document.location.search.toString().split('=')[1];
const currentProduct = new Goods(currentProductID);
const uiElement = elementNullCheck(document, '.main-container-product') as HTMLElement;
const cart = new Cart();
const currentItem = new GoodsCatalogItem(uiElement, currentProduct, cart);
currentItem.fillProductInfo();

const totalContainer = elementNullCheck(document, '.total') as HTMLParagraphElement;
const basketContainer = elementNullCheck(document, '.basket-amount') as HTMLSpanElement;
const header = new Header(totalContainer, basketContainer, cart);
header.refreshHeader();

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
  infoTitle.innerHTML = `Product name: ${product.title};`;
  infoBrand.innerHTML = `Brand: ${product.brand};`;
  infoRating.innerHTML = `Rating: ${product.rating};`;
  infoDiscount.innerHTML = `Discount percentage: ${product.discountPercentage}%;`;
  infoDescription.innerHTML = `Description: ${product.description};`;
  infoStock.innerHTML = `Stock: ${product.stock};`;

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
  setPrice(infoPrice, product.price, currentStock);
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

function setPrice(parent: Element, price: number, selectedStock: number) {
  const finalPrice = price * selectedStock;
  parent.innerHTML = `$${finalPrice}`;
}

const stockButtons = elementNullCheck(document, '.amount-buttons');
let currentStock = 1;

const setStock = function (event: Event): void {
  const maxStock = currentProduct.stock;
  const selectedStockContainer = elementNullCheck(document, '.selected-stock');
  const infoPrice = elementNullCheck(document, '.info-price');
  if (event.target) {
    const target = event.target as HTMLButtonElement;
    const clickedOption = target.closest('button');
    if (clickedOption?.innerHTML === '+' && currentStock < maxStock) {
      console.log();
      currentStock++;
      selectedStockContainer.innerHTML = `${currentStock}`;
      setPrice(infoPrice, currentProduct.price, currentStock);
      if (cart.has(currentProduct)) {
        cart.add(currentProduct);
      }
    } else if (clickedOption?.innerHTML === '-' && currentStock > 1) {
      currentStock--;
      selectedStockContainer.innerHTML = `${currentStock}`;
      setPrice(infoPrice, currentProduct.price, currentStock);
      if (cart.has(currentProduct)) {
        cart.drop(currentProduct);
      }
    }
  }
  currentItem.saveState();
  header.refreshHeader();
};

const pageBreadcrumb = new Breadcrumb(currentProduct.category, currentProduct.brand, currentProduct.title);
pageBreadcrumb.fillBreadcrumb(categoryContainer, brandContainer, nameContainer);
fillProductPage(currentProduct);

stockButtons.addEventListener('click', setStock);
const addToCardButton = document.querySelector('.add-to-cart') as HTMLButtonElement;
