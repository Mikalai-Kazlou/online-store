import goodsData from '../../goods';
import Goods from "../../components/Goods/Goods";
import GoodsCatalogItem from "../../components/GoodsCatalogItem/GoodsCatalogItem";
import { elementNullCheck } from '../../types/type-checks';

const categoryContainer = elementNullCheck(document, '.product-category');
const brandContainer = elementNullCheck(document, '.product-brand');
const NameContainer = elementNullCheck(document, '.product-name');
const currentProductID = +document.location.search.toString().split('=')[1];
const currentProduct = new Goods(currentProductID);

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
      brandBox.innerHTML = this.brand  + ' /';
      nameBox.innerHTML = this.name;
    }
}

const pageBreadcrumb = new Breadcrumb(currentProduct.category, currentProduct.brand, currentProduct.title);
pageBreadcrumb.fillBreadcrumb(categoryContainer, brandContainer, NameContainer);