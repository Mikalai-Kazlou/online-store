import Goods from './Goods';
import goodsData from '../modules/goods';

export default class Filter {
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

  private refreshCounter(foundItems: number[]): void {
    if (foundItems.length > 0) {
      this.counter.innerHTML = `Found: ${foundItems.length}`;
    } else {
      this.counter.innerHTML = `Found: 0`;
    }
  }

  getMatchedResults(uiElement: HTMLElement) {
    // this method is for use on clicks
    this.setMatchedResults(this.uiElement, this.searchQuery);
    this.refreshCounter(this.foundItems);
    this.hideItems();
    this.setAmountRemainder(this.uiElement, this.foundItems);
    this.save(this.foundItems);
    this.checkSearch(this.searchQuery, this.foundItems);
    // this.setPriceSlider(this.foundItems);
  }

  private save(result: number[]): void {
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

  parseQueryString(searchQuery: URLSearchParams): void {
    // this method is for use on load
    const matrix: Goods[][] = [];
    if (searchQuery) {
      if (searchQuery.has('brand')) {
        const queryBrands = searchQuery.getAll('brand')[0].split(',');
        const result = goodsData.products.filter((item) => queryBrands.includes(item.brand));
        const brandButtons = document.querySelectorAll('.brand-button');
        brandButtons.forEach((item) => {
          if (result.map((v) => v.brand).includes(item.id)) {
            if (!item.classList.contains('selected')) {
              item.classList.add('selected');
            }
          }
        });
        matrix.push(result);
      }
      if (searchQuery.has('category')) {
        const queryCategories = searchQuery.getAll('category')[0].split(',');
        const result = goodsData.products.filter((item) => queryCategories.includes(item.category));
        const brandCategory = document.querySelectorAll('.category-button');
        brandCategory.forEach((item) => {
          if (result.map((v) => v.category).includes(item.id)) {
            if (!item.classList.contains('selected')) {
              item.classList.add('selected');
            }
          }
        });
        matrix.push(result);
      }
      if (searchQuery.has('price')) {
        const range = searchQuery.get('price') as String;
        if (range.includes('/') && range.length > 2) {
          let minPrice = range.slice(0, range.indexOf('/'));
          let maxPrice = range.slice(range.indexOf('/') + 1);
          if (+minPrice > +maxPrice) {
            const temp = minPrice;
            minPrice = maxPrice;
            maxPrice = temp;
          }
          const result = goodsData.products.filter((item) => item.price >= +minPrice && item.price <= +maxPrice);
          const fromPriceCOntainer = document.querySelector('.price-slider-from') as HTMLInputElement;
          const toPriceContainer = document.querySelector('.price-slider-to') as HTMLInputElement;
          this.setSliderValue(fromPriceCOntainer, minPrice);
          this.setSliderValue(toPriceContainer, maxPrice);
          if (result.length !== goodsData.products.length && result.length > 0) {
            matrix.push(result);
          }
        }
      }
      if (searchQuery.has('stock')) {
        const range = searchQuery.get('stock') || '';
        if (range.includes('/') && range.length > 2) {
          let minStock = range.slice(0, range.indexOf('/'));
          let maxStock = range.slice(range.indexOf('/') + 1);
          if (+minStock > +maxStock) {
            const temp = minStock;
            minStock = maxStock;
            maxStock = temp;
          }
          const result = goodsData.products.filter((item) => item.stock >= +minStock && item.stock <= +maxStock);
          const fromStockCOntainer = document.querySelector('.stock-slider-from') as HTMLInputElement;
          const toStockContainer = document.querySelector('.stock-slider-to') as HTMLInputElement;
          this.setSliderValue(fromStockCOntainer, minStock);
          this.setSliderValue(toStockContainer, maxStock);
          if (result.length !== goodsData.products.length && result.length > 0) {
            matrix.push(result);
          }
        }
      }
      if (searchQuery.has('searchQuery')) {
        const searchText = searchQuery.get('searchQuery') || '';
        const searchResults: Goods[] = [];
        for (let i = 0; i < goodsData.products.length; i++) {
          if (goodsData.products[i].brand.toLowerCase().includes(searchText.toLowerCase())) {
            searchResults.push(goodsData.products[i]);
          } else if (goodsData.products[i].title.toLowerCase().includes(searchText.toLowerCase())) {
            searchResults.push(goodsData.products[i]);
          }
        }
        const searchQueryContainer = document.querySelector('.search-input') as HTMLInputElement;
        searchQueryContainer.value = searchText;
        const result = [...new Set(searchResults)];
        matrix.push(result);
      }
    }
    const resultGoods: Goods[] | undefined = matrix.shift()?.filter(function (v) {
      return matrix.every(function (a) {
        return a.indexOf(v) !== -1;
      });
    });
    const result = resultGoods?.map((item) => item.id) || [0];
    if (result[0] !== 0) {
      this.foundItems = result;
      this.getMatchedResults(this.uiElement);
    }
  }

  setSliderValue(container: HTMLInputElement, value: string): void {
    container.setAttribute('value', value);
    container.value = value;
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
    // does not work properly
    const minPrice = document.querySelector('.price-slider-from') as HTMLInputElement;
    const maxPrice = document.querySelector('.price-slider-to') as HTMLInputElement;
    const prices = foundItems.map((item) => goodsData.products[item - 1].price);
    const minPriceValue = Math.min.apply(Math, prices);
    const maxPriceValue = Math.max.apply(Math, prices);
    if (foundItems.length > 0) {
      if (+minPrice.value < minPriceValue) {
        this.setSliderValue(minPrice, minPriceValue.toString());
        this.setSliderValue(maxPrice, maxPriceValue.toString());
      }
      if (+maxPrice.value > maxPriceValue) {
        this.setSliderValue(minPrice, minPriceValue.toString());
        this.setSliderValue(maxPrice, maxPriceValue.toString());
      }
    }
    // else {
    //   minPrice.setAttribute('value', `${minPrice.value}`);
    //   maxPrice.setAttribute('value', `${maxPrice.value}`);
    // }
  }

  setStockSlider(foundItems: number[]) {
    // does not work properly
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
}
