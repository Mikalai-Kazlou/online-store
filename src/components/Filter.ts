import Goods from './Goods';
import goodsData from '../modules/goods';

export default class GoodsCatalogItem {
  private uiElement: HTMLElement;
  private goods: Goods;
  private counter: HTMLElement;
  public foundItems: number[] = [];

  constructor(uiElement: HTMLElement, goods: Goods, counter: HTMLElement) {
    this.uiElement = uiElement;
    this.goods = goods;
    this.counter = counter;
  }

  refreshCounter(foundItems: number[]): void {
    if (foundItems.length > 0) {
      this.counter.innerHTML = `Found: ${foundItems.length}`;
    } else {
      this.counter.innerHTML = `Found: 0`;
    }
  }

  getMatchedResults(uiElement: HTMLElement) {
    this.setMatchedResults(this.uiElement);
    this.setPriceSlider(this.foundItems);
    // this.setStockSlider(this.foundItems);
    this.refreshCounter(this.foundItems);
    this.hideItems();
    this.setAmountRemainder(this.uiElement, this.foundItems);
  }

  private setMatchedResults(uiElement: HTMLElement) {
    let matrix: Goods[][] = [];
    if (this.findByText(uiElement).length > 0) {
      matrix.push(this.findByText(uiElement));
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

  private findByText(uiElement: HTMLElement) {
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
    const brands = Array.from(uiElement.querySelectorAll('.brand-button'));
    const categories = Array.from(uiElement.querySelectorAll('.category-button'));
    this.buttonsDisablerText(result, brands, categories);
    return result;
  }

  private findByCategories(uiElement: HTMLElement): Goods[] {
    const categories = Array.from(uiElement.querySelectorAll('.category-button'));
    const selectedCategories = categories.filter((item) => item.classList.contains('selected')).map((item) => item.id);
    const result = goodsData.products.filter((item) => selectedCategories.includes(item.category));
    const brands = Array.from(uiElement.querySelectorAll('.brand-button'));
    this.buttonsDisabler(result, brands, selectedCategories.length, 'brand');
    return result;
  }

  private findByBrands(uiElement: HTMLElement): Goods[] {
    const brands = Array.from(uiElement.querySelectorAll('.brand-button'));
    const selectedBrands = brands.filter((item) => item.classList.contains('selected')).map((item) => item.id);
    const result = goodsData.products.filter((item) => selectedBrands.includes(item.brand));
    const categories = Array.from(uiElement.querySelectorAll('.category-button'));
    this.buttonsDisabler(result, categories, selectedBrands.length, 'category');
    return result;
  }

  private findByPriceRange(uiElement: HTMLElement): Goods[] {
    const fromPriceCOntainer = uiElement.querySelector('.price-slider-from') as HTMLInputElement;
    const toPriceContainer = uiElement.querySelector('.price-slider-to') as HTMLInputElement;
    const minPrice = +fromPriceCOntainer.value;
    const maxPrice = +toPriceContainer.value;
    fromPriceCOntainer.setAttribute('value', `${fromPriceCOntainer.value}`);
    toPriceContainer.setAttribute('value', `${toPriceContainer.value}`);
    const result = goodsData.products.filter((item) => item.price >= minPrice && item.price <= maxPrice);
    const categories = Array.from(uiElement.querySelectorAll('.category-button'));
    const brands = Array.from(uiElement.querySelectorAll('.brand-button'));
    this.buttonsDisablerSlider(result, brands, categories, result.length);
    return result;
  }

  private findByStockRange(uiElement: HTMLElement): Goods[] {
    const fromStockCOntainer = uiElement.querySelector('.stock-slider-from') as HTMLInputElement;
    const toStockContainer = uiElement.querySelector('.stock-slider-to') as HTMLInputElement;
    const minStock = +fromStockCOntainer.value;
    const maxStock = +toStockContainer.value;
    fromStockCOntainer.setAttribute('value', `${fromStockCOntainer.value}`);
    toStockContainer.setAttribute('value', `${toStockContainer.value}`);
    const result = goodsData.products.filter((item) => item.stock >= minStock && item.stock <= maxStock);
    const categories = Array.from(uiElement.querySelectorAll('.category-button'));
    const brands = Array.from(uiElement.querySelectorAll('.brand-button'));
    this.buttonsDisablerSlider(result, brands, categories, result.length);
    return result;
  }

  private hideItems(): void {
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
  //     let minPrice = uiElement.querySelector('.price-slider-from') as HTMLInputElement;
  //     let maxPrice = uiElement.querySelector('.price-slider-to') as HTMLInputElement;
  //     const minStock = uiElement.querySelector('.stock-slider-from') as HTMLInputElement;
  //     const maxStock = uiElement.querySelector('.stock-slider-to') as HTMLInputElement;
  //     const prices = foundItems.map((item) => goodsData.products[item - 1].price);
  //     const stock = foundItems.map((item) => goodsData.products[item - 1].stock);
  //     const minPriceValue = Math.min.apply(Math, prices);
  //     const maxPriceValue = Math.max.apply(Math, prices);
  //     const minStockValue = Math.min.apply(Math, stock);
  //     const maxStockValue = Math.max.apply(Math, stock);
  //   }
  // }

  setPriceSlider(foundItems: number[]) {
    let minPrice = document.querySelector('.price-slider-from') as HTMLInputElement;
    let maxPrice = document.querySelector('.price-slider-to') as HTMLInputElement;
    const prices = foundItems.map((item) => goodsData.products[item - 1].price);
    const minPriceValue = Math.min.apply(Math, prices);
    const maxPriceValue = Math.max.apply(Math, prices);
    const range = [minPriceValue, maxPriceValue]
    if (foundItems.length > 0) {
      if (minPrice.value < minPriceValue.toString()) {
        minPrice.value = minPriceValue.toString();
        minPrice.setAttribute('value', `${minPriceValue}`);
      }
      if (maxPrice.value > maxPriceValue.toString()) {
        maxPrice.setAttribute('value', `${maxPriceValue}`);
        maxPrice.value = maxPriceValue.toString();
      }
    } else {
      minPrice.setAttribute('value', `${minPrice.value}`);
      maxPrice.setAttribute('value', `${maxPrice.value}`);
    }
  }

  setStockSlider(foundItems: number[]) {
    let minStock = document.querySelector('.price-slider-from') as HTMLInputElement;
    let maxStock = document.querySelector('.price-slider-to') as HTMLInputElement;
    const stock = foundItems.map((item) => goodsData.products[item - 1].stock);
    const minStockValue = Math.min.apply(Math, stock);
    const maxStockValue = Math.max.apply(Math, stock);
    const range = [minStockValue, maxStockValue]
    if (foundItems.length > 0) {
      if (minStock.value < minStockValue.toString()) {
        minStock.value = minStockValue.toString();
        minStock.setAttribute('value', `${minStockValue}`);
        console.log(range)
      } else if (maxStock.value > maxStockValue.toString()) {
        maxStock.setAttribute('value', `${maxStockValue}`);
        maxStock.value = maxStockValue.toString();
      }
    } else {
      minStock.setAttribute('value', `${minStock.value}`);
      maxStock.setAttribute('value', `${maxStock.value}`);
    }
  }

  private buttonsDisabler(result: Goods[], buttons: Element[], selected: number, prop: string): void {
    buttons.forEach((item) => {
      if (item.classList.contains('disabled')) item.classList.remove('disabled');
    });
    if (prop === 'brand') {
      buttons.forEach((item) => {
        if (!result.map((v) => v.brand).includes(item.id) && selected > 0) {
          item.classList.add('disabled');
        }
      });
    } else if (prop === 'category') {
      buttons.forEach((item) => {
        if (!result.map((v) => v.category).includes(item.id) && selected > 0) {
          item.classList.add('disabled');
        }
      });
    }
  }

  private buttonsDisablerText(result: Goods[], buttonsBrand: Element[], buttonsCateg: Element[]): void {
    buttonsBrand.forEach((item) => {
      if (item.classList.contains('disable')) item.classList.remove('disable');
    });
    buttonsCateg.forEach((item) => {
      if (item.classList.contains('disable')) item.classList.remove('disable');
    });
    buttonsBrand.forEach((item) => {
      if (!result.map((v) => v.brand).includes(item.id) && result.length > 0) {
        item.classList.add('disable');
      }
    });
    buttonsCateg.forEach((item) => {
      if (!result.map((v) => v.category).includes(item.id) && result.length > 0) {
        item.classList.add('disable');
      }
    });
  }

  private buttonsDisablerSlider(
    result: Goods[],
    buttonsBrand: Element[],
    buttonsCateg: Element[],
    selected: number
  ): void {
    buttonsBrand.forEach((item) => {
      if (!result.map((v) => v.brand).includes(item.id) && selected > 0) {
        item.classList.add('disabled');
      }
    });
    buttonsCateg.forEach((item) => {
      if (!result.map((v) => v.category).includes(item.id) && selected > 0) {
        item.classList.add('disabled');
      }
    });
  }

  private setAmountRemainder(uiElement: HTMLElement, foundItems: number[]) {
    const brandRemainder = uiElement.querySelectorAll('.brand-remainder');
    const categoryRemainder = uiElement.querySelectorAll('.category-remainder');
    const items = foundItems.map((item) => goodsData.products[item - 1]);
    if (foundItems.length > 0) {
      brandRemainder.forEach(
        (item) =>
          (item.innerHTML = `(${
            items.filter((v) => v.brand === item.id.toString().substr(item.id.indexOf(' ') + 1)).length
          }/${
            goodsData.products.filter((v) => v.brand === item.id.toString().substr(item.id.indexOf(' ') + 1)).length
          })`)
      );
      categoryRemainder.forEach(
        (item) =>
          (item.innerHTML = `(${
            items.filter((v) => v.category === item.id.toString().substr(item.id.indexOf(' ') + 1)).length
          }/${
            goodsData.products.filter((v) => v.category === item.id.toString().substr(item.id.indexOf(' ') + 1)).length
          })`)
      );
    }
  }

  private getTotalProducts() {
    return goodsData.products.length;
  }

  private createPath(): void {
    location.search = `../../details.html?id=${this.goods.id}`;
  }
}