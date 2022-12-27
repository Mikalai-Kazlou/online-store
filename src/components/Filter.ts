import Goods from './Goods';
import goodsData from '../modules/goods';

export default class GoodsCatalogItem {
  private uiElement: HTMLElement;
  private goods: Goods;
  private counter: HTMLElement;
  public foundItems: number[] = [];
  public searchQuery: URLSearchParams = new URLSearchParams(window.location.search);

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
    this.setMatchedResults(this.uiElement, this.searchQuery);
    this.refreshCounter(this.foundItems);
    this.hideItems();
    this.setAmountRemainder(this.uiElement, this.foundItems);
    this.save(this.foundItems);
    this.checkSearch(this.searchQuery, this.foundItems);
  }

  save(result: number[]): void {
    localStorage.setItem('RS Online-Store SearchResults', JSON.stringify(result));
  }

  checkSearch(searchQuery: URLSearchParams, foundItems: number[]): void {
    if (foundItems.length > 0 && foundItems.length !== goodsData.products.length) {
      window.history.pushState({}, '', `/?${searchQuery}`);
    } else {
      for (const key of searchQuery.keys()) {
        searchQuery.delete(key);
      }
      window.history.replaceState({}, '', `/${searchQuery}`);
    }
  }

  reset(foundItems: number[]) {
    foundItems = [];
    const allItems = document.querySelectorAll('.good-item');
    const categories = document.querySelectorAll('.category-button');
    const brands = document.querySelectorAll('.brand-button');
    allItems.forEach((item) => {
      if (item.classList.contains('hide')) item.classList.remove('hide');
    });
    categories.forEach((item) => {
      if (item.classList.contains('selected')) item.classList.remove('selected');
    });
    brands.forEach((item) => {
      if (item.classList.contains('selected')) item.classList.remove('selected');
    });
    this.getMatchedResults(this.uiElement);
  }

  private setMatchedResults(uiElement: HTMLElement, searchQuery: URLSearchParams) {
    const matrix: Goods[][] = [];
    if (this.findByText(uiElement).length > 0) {
      matrix.push(this.findByText(uiElement));
    }
    if (this.findByCategories(this.uiElement, searchQuery).length > 0) {
      matrix.push(this.findByCategories(this.uiElement, searchQuery));
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
    const searchQueryInput = searchQueryContainer.value;
    const searchResults: Goods[] = [];
    searchQueryContainer.setAttribute('value', `${searchQueryContainer.value}`);
    for (let i = 0; i < goodsData.products.length; i++) {
      if (goodsData.products[i].brand.toLowerCase().includes(searchQueryInput.toLowerCase())) {
        searchResults.push(goodsData.products[i]);
      } else if (goodsData.products[i].title.toLowerCase().includes(searchQueryInput.toLowerCase())) {
        searchResults.push(goodsData.products[i]);
      }
    }
    const result = [...new Set(searchResults)];
    if (searchQueryInput.length > 0 && result.length === 0) {
      searchQueryContainer.setAttribute('maxlength', `${searchQueryInput.length - 1}`);
    } else {
      searchQueryContainer.removeAttribute('maxlength');
    }
    const brands = Array.from(uiElement.querySelectorAll('.brand-button'));
    const categories = Array.from(uiElement.querySelectorAll('.category-button'));
    this.buttonsDisablerText(result, brands, categories);
    this.searchQueryAppend('searchQuery', `${searchQueryInput}`, this.searchQuery);
    return result;
  }

  private findByCategories(uiElement: HTMLElement, searchQuery: URLSearchParams): Goods[] {
    const categories = Array.from(uiElement.querySelectorAll('.category-button'));
    const selectedCategories = categories.filter((item) => item.classList.contains('selected')).map((item) => item.id);
    const result = goodsData.products.filter((item) => selectedCategories.includes(item.category));
    const brands = Array.from(uiElement.querySelectorAll('.brand-button'));
    this.buttonsDisabler(result, brands, selectedCategories.length, 'brand');
    this.searchQueryAppend('category', `${[...new Set(result.map((item) => item.category))]}`, this.searchQuery);
    return result;
  }

  private findByBrands(uiElement: HTMLElement): Goods[] {
    const brands = Array.from(uiElement.querySelectorAll('.brand-button'));
    const selectedBrands = brands.filter((item) => item.classList.contains('selected')).map((item) => item.id);
    const result = goodsData.products.filter((item) => selectedBrands.includes(item.brand));
    const categories = Array.from(uiElement.querySelectorAll('.category-button'));
    this.buttonsDisabler(result, categories, selectedBrands.length, 'category');
    this.searchQueryAppend('brand', `${[...new Set(result.map((item) => item.brand))]}`, this.searchQuery);
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
    if (result.length !== goodsData.products.length) {
      this.searchQueryAppend('price', `${minPrice}/${maxPrice}`, this.searchQuery);
    }
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
    if (result.length !== goodsData.products.length) {
      this.searchQueryAppend('stock', `${minStock}/${maxStock}`, this.searchQuery);
    }
    return result;
  }

  searchQueryAppend(name: string, value: string, query: URLSearchParams) {
    query.delete(name);
    if (value.length > 0) {
      query.append(name, value);
    }
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

  setPriceSlider(foundItems: number[]) {
    const minPrice = document.querySelector('.price-slider-from') as HTMLInputElement;
    const maxPrice = document.querySelector('.price-slider-to') as HTMLInputElement;
    const prices = foundItems.map((item) => goodsData.products[item - 1].price);
    const minPriceValue = Math.min.apply(Math, prices);
    const maxPriceValue = Math.max.apply(Math, prices);
    const range = [minPriceValue, maxPriceValue];
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
    const minStock = document.querySelector('.price-slider-from') as HTMLInputElement;
    const maxStock = document.querySelector('.price-slider-to') as HTMLInputElement;
    const stock = foundItems.map((item) => goodsData.products[item - 1].stock);
    const minStockValue = Math.min.apply(Math, stock);
    const maxStockValue = Math.max.apply(Math, stock);
    const range = [minStockValue, maxStockValue];
    if (foundItems.length > 0) {
      if (minStock.value < minStockValue.toString()) {
        minStock.value = minStockValue.toString();
        minStock.setAttribute('value', `${minStockValue}`);
        console.log(range);
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
}
