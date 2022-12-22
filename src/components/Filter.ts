import Goods from './Goods';
import goodsData from '../modules/goods';

export default class GoodsCatalogItem {
  private uiElement: HTMLElement;
  private goods: Goods;
  private counter: HTMLElement;
  private foundItems: number[] = [];

  constructor(uiElement: HTMLElement, goods: Goods, counter: HTMLElement) {
    this.uiElement = uiElement;
    this.goods = goods;
    this.counter = counter;
  }

  refreshCounter(): void {
    if (this.foundItems.length > 0) {
      this.counter.innerHTML = `Found: ${this.foundItems.length}`;
    }
    this.counter.innerHTML = `Found: ${this.getTotalProducts}`;
  }

  getMatchedResults(uiElement: HTMLElement) {
    let matrix: Goods[][] = [];
    if (this.findByCategories(this.uiElement).length > 0) {
      matrix.push(this.findByCategories(this.uiElement));
    }
    if (this.findByBrands(this.uiElement).length > 0) {
      matrix.push(this.findByBrands(this.uiElement));
    }
    if (this.findByPriceRange(this.uiElement).length > 0) {
      matrix.push(this.findByPriceRange(this.uiElement));
    }
    if (this.findByStockRange(this.uiElement).length > 0) {
      matrix.push(this.findByStockRange(this.uiElement));
    }
    const result: Goods[] | undefined = matrix.shift()?.filter(function (v) {
      return matrix.every(function (a) {
        return a.indexOf(v) !== -1;
      });
    });
    return matrix;
  }

  findByCategories(uiElement: HTMLElement): Goods[] {
    const categories = Array.from(uiElement.querySelectorAll('category-button'));
    const selectedCategories = categories
      .filter((item) => item.classList.contains('selected'))
      .map((item) => item.innerHTML);
    return goodsData.products.filter((item) => selectedCategories.includes(item.category));
  }

  findByBrands(uiElement: HTMLElement): Goods[] {
    const brands = Array.from(uiElement.querySelectorAll('brand-button'));
    const selectedBrands = brands.filter((item) => item.classList.contains('selected')).map((item) => item.innerHTML);
    return goodsData.products.filter((item) => selectedBrands.includes(item.brand));
  }

  findByPriceRange(uiElement: HTMLElement): Goods[] {
    const fromPriceCOntainer = uiElement.querySelector('.price-slider-from') as HTMLInputElement;
    const toPriceContainer = uiElement.querySelector('.price-slider-to') as HTMLInputElement;
    const minPrice = +fromPriceCOntainer.value;
    const maxPrice = +toPriceContainer.value;
    return goodsData.products.filter((item) => item.price >= minPrice && item.price <= maxPrice);
  }

  findByStockRange(uiElement: HTMLElement): Goods[] {
    const fromStockCOntainer = uiElement.querySelector('.stock-slider-from') as HTMLInputElement;
    const toStockContainer = uiElement.querySelector('.stock-slider-to') as HTMLInputElement;
    const minStock = +fromStockCOntainer.value;
    const maxStock = +toStockContainer.value;
    return goodsData.products.filter((item) => item.stock >= minStock && item.stock <= maxStock);
  }

  private getTotalProducts() {
    return goodsData.products.length + 1;
  }

  private createPath(): void {
    location.search = `../../details.html?id=${this.goods.id}`;
  }
}