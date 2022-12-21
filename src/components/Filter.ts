import Cart from './Cart';
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

  findByCategories(uiElement: HTMLElement) {

  }

  findByPriceRange(uiElement: HTMLElement) {
    const fromPriceCOntainer = uiElement.querySelector('.price-slider-from') as HTMLInputElement;
    const toPriceContainer = uiElement.querySelector('.price-slider-to') as HTMLInputElement;
    const minPrice = +fromPriceCOntainer.value;
    const maxPrice = +toPriceContainer.value;
    return goodsData.products.filter((item) => item.price <= minPrice && item.price <= maxPrice);
  }

  findByStockRange(uiElement: HTMLElement) {
    const fromStockCOntainer = uiElement.querySelector('.stock-slider-from') as HTMLInputElement;
    const toStockContainer = uiElement.querySelector('.stock-slider-to') as HTMLInputElement;
    const minStock = +fromStockCOntainer.value;
    const maxStock = +toStockContainer.value;
    return goodsData.products.filter((item) => item.stock <= minStock && item.stock <= maxStock);
  }

  private getTotalProducts() {
    return goodsData.products.length + 1;
  }

  private createPath(): void {
    location.search = `../../details.html?id=${this.goods.id}`;
  }
}