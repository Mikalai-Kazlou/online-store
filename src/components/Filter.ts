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

  refreshCounter(foundItems: number[]): void {
    if (foundItems.length > 0) {
      this.counter.innerHTML = `Found: ${foundItems.length}`;
    } else {
      // this.counter.innerHTML = `Found: ${this.getTotalProducts()}`;
      this.counter.innerHTML = `Found: 0`;
    }
  }

  getMatchedResults(uiElement: HTMLElement) {
    this.setMatchedResults(this.uiElement);
    this.refreshCounter(this.foundItems);
    // this.recalculateSliders(this.uiElement, this.foundItems);
    this.hideItems();
    console.log(this.foundItems);
  }

  setMatchedResults(uiElement: HTMLElement) {
    let matrix: Goods[][] = [];
    if (this.findByText(this.uiElement).length > 0) {
      matrix.push(this.findByText(this.uiElement));
    }
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
    this.foundItems = result?.map((item) => item.id) || [0];
  }

  findByText(uiElement: HTMLElement) {
    const searchQueryContainer = uiElement.querySelector('.search-input') as HTMLInputElement;
    let searchQuery = searchQueryContainer.value;
    let searchResults: Goods[] = [];
    for (let i = 0; i < goodsData.products.length; i++) {
      if (goodsData.products[i].brand.toLowerCase().includes(searchQuery.toLowerCase())) {
        searchResults.push(goodsData.products[i]);
      } else if (goodsData.products[i].title.toLowerCase().includes(searchQuery.toLowerCase())) {
        searchResults.push(goodsData.products[i]);
      }
    }
    let result = [...new Set(searchResults)];
    if (searchQuery.length > 0 && result.length === 0) {
      searchQueryContainer.setAttribute('maxlength', `${searchQuery.length - 1}`);
    } else {
      searchQueryContainer.removeAttribute('maxlength');
    }
    return result;
  }

  findByCategories(uiElement: HTMLElement): Goods[] {
    const categories = Array.from(uiElement.querySelectorAll('.category-button'));
    const selectedCategories = categories
      .filter((item) => item.classList.contains('selected'))
      .map((item) => item.innerHTML.toLowerCase());
    const result = goodsData.products.filter((item) => selectedCategories.includes(item.category));
    const brands = Array.from(uiElement.querySelectorAll('.brand-button'));
    this.buttonsDisabler(result, brands, selectedCategories, 'brand');
    return result;
  }

  findByBrands(uiElement: HTMLElement): Goods[] {
    const brands = Array.from(uiElement.querySelectorAll('.brand-button'));
    const selectedBrands = brands.filter((item) => item.classList.contains('selected')).map((item) => item.innerHTML);
    const result = goodsData.products.filter((item) => selectedBrands.includes(item.brand));
    const categories = Array.from(uiElement.querySelectorAll('.category-button'));
    this.buttonsDisabler(result, categories, selectedBrands, 'category');
    return result;
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

  hideItems(): void {
    const allItems = document.querySelectorAll('.good-item');
    allItems.forEach((item) => {
      if (item.classList.contains('hide')) item.classList.remove('hide');
    });
    allItems.forEach((item) => {
      if (!this.foundItems.includes(+item.id)) {
        item.classList.add('hide');
      }
    });
  }

  // recalculateSliders(uiElement: HTMLElement, foundItems: number[]) {
  //   if (foundItems.length > 0) {
  //   const minPrice = uiElement.querySelector('.price-slider-from') as HTMLInputElement;
  //   const maxPrice = uiElement.querySelector('.price-slider-to') as HTMLInputElement;
  //   const minStock = uiElement.querySelector('.stock-slider-from') as HTMLInputElement;
  //   const maxStock = uiElement.querySelector('.stock-slider-to') as HTMLInputElement;
  //   const priceRange = foundItems.map((item) => goodsData.products[item + 1].price);
  //   const stockRange = foundItems.map((item) => goodsData.products[item + 1].stock);
  //   minPrice.value = `${Math.min(...priceRange)}`;
  //   maxPrice.value = `${Math.max(...priceRange)}`;
  //   minStock.value = `${Math.min(...stockRange)}`;
  //   maxStock.value = `${Math.max(...stockRange)}`;
  //   }
  // }

  private buttonsDisabler(result: Goods[], buttons: Element[], selected: string[], prop: string): void {
    buttons.forEach((item) => {
      if (item.classList.contains('disabled')) item.classList.remove('disabled');
    });
    if (prop === 'brand') {
      buttons.forEach((item) => {
        if (!result.map((v) => v.brand).includes(item.id) && selected.length > 0) {
          item.classList.add('disabled');
        }
      });
    } else if (prop === 'category') {
      buttons.forEach((item) => {
        if (!result.map((v) => v.category).includes(item.id) && selected.length > 0) {
          item.classList.add('disabled');
        }
      });
    }
  }

  private getTotalProducts() {
    return goodsData.products.length;
  }

  private createPath(): void {
    location.search = `../../details.html?id=${this.goods.id}`;
  }
}