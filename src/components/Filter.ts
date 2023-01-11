import Goods from './Goods';

import goodsData from '../modules/goods';
import { SortingType, ViewType, FilterType, SearchQueryParameters } from '../modules/enums';

export default class Filter {
  private uiElement: HTMLElement;
  private counter: HTMLElement;

  public foundItems: number[] = [];
  public searchQuery: URLSearchParams = new URLSearchParams(window.location.search);

  constructor(uiElement: HTMLElement, counter: HTMLElement) {
    this.uiElement = uiElement;
    this.counter = counter;
  }

  private refreshCounter(foundItems: number[]): void {
    const noResultsMessage = document.querySelector('.error-message') as HTMLElement;
    if (foundItems.length > 0) {
      this.counter.innerHTML = `Found: ${foundItems.length}`;
      if (!noResultsMessage.classList.contains('hide')) {
        noResultsMessage.classList.add('hide');
      }
    } else {
      this.counter.innerHTML = `Found: 0`;
      if (noResultsMessage.classList.contains('hide')) {
        noResultsMessage.classList.remove('hide');
      }
    }
  }

  getMatchedResults(filterType: FilterType): void {
    this.setMatchedResults(this.uiElement, filterType);
    this.refreshCounter(this.foundItems);
    this.hideItems();
    this.setAmountRemainder(this.uiElement, this.foundItems);
    this.checkSearch(this.searchQuery, this.foundItems);

    if (filterType !== FilterType.price) {
      this.setPriceSlider(this.foundItems);
    }
    if (filterType !== FilterType.stock) {
      this.setStockSlider(this.foundItems);
    }
  }

  checkSearch(searchQuery: URLSearchParams, foundItems: number[]): void {
    if (foundItems.length === goodsData.products.length) {
      for (const key of Array.from(searchQuery.keys())) {
        if (key !== SearchQueryParameters.sorting && key !== SearchQueryParameters.view) {
          searchQuery.delete(key);
        }
      }
    }
    const questionMark: string = !searchQuery.toString() || searchQuery.toString()[0] === '?' ? '' : '?';
    window.history.replaceState({}, '', `${window.location.pathname}${questionMark}${searchQuery.toString()}`);
  }

  private isExistsInGoodsData(goods: Goods, str: string): boolean {
    const isFound =
      goods.brand.toLowerCase().includes(str.toLowerCase()) ||
      goods.title.toLowerCase().includes(str.toLowerCase()) ||
      goods.description.toLowerCase().includes(str.toLowerCase()) ||
      goods.category.toLowerCase().includes(str.toLowerCase()) ||
      goods.rating.toString().includes(str.toLowerCase()) ||
      goods.price.toString().includes(str.toLowerCase()) ||
      goods.stock.toString().includes(str.toLowerCase());

    return isFound;
  }

  parseQueryString(searchQuery: URLSearchParams): void {
    const matrix: Goods[][] = [];
    if (searchQuery) {
      if (searchQuery.has(SearchQueryParameters.brand)) {
        const queryBrands = searchQuery.getAll(SearchQueryParameters.brand)[0].split(',');
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
      if (searchQuery.has(SearchQueryParameters.category)) {
        const queryCategories = searchQuery.getAll(SearchQueryParameters.category)[0].split(',');
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
      if (searchQuery.has(SearchQueryParameters.price)) {
        const range = searchQuery.get(SearchQueryParameters.price) as string;
        if (range.includes('/') && range.length > 2) {
          let minPrice = range.slice(0, range.indexOf('/'));
          let maxPrice = range.slice(range.indexOf('/') + 1);
          if (+minPrice > +maxPrice) {
            [minPrice, maxPrice] = [maxPrice, minPrice];
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
      if (searchQuery.has(SearchQueryParameters.stock)) {
        const range = searchQuery.get(SearchQueryParameters.stock) || '';
        if (range.includes('/') && range.length > 2) {
          let minStock = range.slice(0, range.indexOf('/'));
          let maxStock = range.slice(range.indexOf('/') + 1);
          if (+minStock > +maxStock) {
            [minStock, maxStock] = [maxStock, minStock];
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
      if (searchQuery.has(SearchQueryParameters.search)) {
        const searchText = searchQuery.get(SearchQueryParameters.search) || '';
        const searchResults: Goods[] = [];
        for (let i = 0; i < goodsData.products.length; i++) {
          if (this.isExistsInGoodsData(goodsData.products[i], searchText)) {
            searchResults.push(goodsData.products[i]);
          }
        }
        const searchQueryContainer = document.querySelector('.search-input') as HTMLInputElement;
        searchQueryContainer.value = searchText;
        const result = [...new Set(searchResults)];
        matrix.push(result);
      }
      if (searchQuery.has(SearchQueryParameters.sorting)) {
        const sorting = searchQuery.get(SearchQueryParameters.sorting);
        const sortInput = document.querySelector('.sort-input') as HTMLSelectElement;
        if (sorting === SortingType.nameAscending) {
          sortInput.value = SortingType.nameAscending;
        }
        if (sorting === SortingType.nameDescending) {
          sortInput.value = SortingType.nameDescending;
        }
        if (sorting === SortingType.priceAscending) {
          sortInput.value = SortingType.priceAscending;
        }
        if (sorting === SortingType.priceDescending) {
          sortInput.value = SortingType.priceDescending;
        }
      }
      if (searchQuery.has(SearchQueryParameters.view)) {
        const view = searchQuery.get(SearchQueryParameters.view);
        const viewInput = document.querySelector('.view-input') as HTMLSelectElement;
        if (view === ViewType.standard) {
          viewInput.value = ViewType.standard;
        }
        if (view === ViewType.small) {
          viewInput.value = ViewType.small;
        }
      }
    }
    const resultGoods: Goods[] | undefined = matrix.shift()?.filter(function (v) {
      return matrix.every(function (a) {
        return a.indexOf(v) !== -1;
      });
    });

    if (typeof resultGoods !== 'undefined') {
      const result = resultGoods.map((item) => item.id);
      if (result.length > 0) {
        this.foundItems = result;
        this.getMatchedResults(FilterType.empty);
      }
    }
  }

  setSliderValue(container: HTMLInputElement, value: string): void {
    container.setAttribute('value', value);
    container.value = value;
  }

  reset(): void {
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
    this.getMatchedResults(FilterType.reset);
  }

  private setMatchedResults(uiElement: HTMLElement, filterType: FilterType): void {
    const matrix: Goods[][] = [];
    matrix.push(goodsData.products);

    if (
      [FilterType.reset, FilterType.search].includes(filterType) ||
      this.searchQuery.has(SearchQueryParameters.search)
    ) {
      const resultByText = this.findByText(uiElement);
      matrix.push(resultByText);
    }

    if (
      [FilterType.reset, FilterType.category].includes(filterType) ||
      this.searchQuery.has(SearchQueryParameters.category)
    ) {
      const resultByCategory = this.findByCategories(this.uiElement);
      matrix.push(resultByCategory);
    }

    if (
      [FilterType.reset, FilterType.brand].includes(filterType) ||
      this.searchQuery.has(SearchQueryParameters.brand)
    ) {
      const resultByBrand = this.findByBrands(this.uiElement);
      matrix.push(resultByBrand);
    }

    if (
      [FilterType.reset, FilterType.price].includes(filterType) ||
      this.searchQuery.has(SearchQueryParameters.price)
    ) {
      const resultByPrice = this.findByPriceRange(this.uiElement);
      matrix.push(resultByPrice);
    }

    if (
      [FilterType.reset, FilterType.stock].includes(filterType) ||
      this.searchQuery.has(SearchQueryParameters.stock)
    ) {
      const resultByStock = this.findByStockRange(this.uiElement);
      matrix.push(resultByStock);
    }

    const result: Goods[] | undefined = matrix.shift()?.filter(function (v) {
      return matrix.every(function (a) {
        return a.indexOf(v) !== -1;
      });
    });

    if (typeof result !== 'undefined' && result.length == 0) {
      this.foundItems = [];
    }

    if (typeof result !== 'undefined' && result.length !== 0) {
      this.foundItems = result.map((item) => item.id);
    }
  }

  private findByText(uiElement: HTMLElement): Goods[] {
    const searchQueryContainer = uiElement.querySelector('.search-input') as HTMLInputElement;
    const searchQueryInput = searchQueryContainer.value;
    const searchResults: Goods[] = [];

    searchQueryContainer.setAttribute('value', `${searchQueryContainer.value}`);
    for (let i = 0; i < goodsData.products.length; i++) {
      if (this.isExistsInGoodsData(goodsData.products[i], searchQueryInput)) {
        searchResults.push(goodsData.products[i]);
      }
    }

    const result = [...new Set(searchResults)];
    if (searchQueryInput.length > 0 && result.length === 0) {
      searchQueryContainer.value = searchQueryContainer.value.slice(0, -1);
      return this.foundItems.map((item) => goodsData.products[item - 1]);
    }

    const categories = Array.from(uiElement.querySelectorAll('.category-button'));
    const brands = Array.from(uiElement.querySelectorAll('.brand-button'));
    this.buttonsDisabler(result, categories, 'category', 'disabled1');
    this.buttonsDisabler(result, brands, 'brand', 'disabled1');

    this.searchQueryAppend(SearchQueryParameters.search, `${searchQueryInput}`, this.searchQuery);
    return result;
  }

  private findByCategories(uiElement: HTMLElement): Goods[] {
    let result = goodsData.products;
    this.searchQuery.delete(SearchQueryParameters.category);

    const categories = Array.from(uiElement.querySelectorAll('.category-button'));
    const selectedCategories = categories.filter((item) => item.classList.contains('selected')).map((item) => item.id);
    if (selectedCategories.length > 0) {
      result = goodsData.products.filter((item) => selectedCategories.includes(item.category));
      this.searchQueryAppend(
        SearchQueryParameters.category,
        `${[...new Set(result.map((item) => item.category))]}`,
        this.searchQuery
      );
    }

    const brands = Array.from(uiElement.querySelectorAll('.brand-button'));
    this.buttonsDisabler(result, brands, 'brand', 'disabled2');
    return result;
  }

  private findByBrands(uiElement: HTMLElement): Goods[] {
    let result = goodsData.products;
    this.searchQuery.delete(SearchQueryParameters.brand);

    const brands = Array.from(uiElement.querySelectorAll('.brand-button'));
    const selectedBrands = brands.filter((item) => item.classList.contains('selected')).map((item) => item.id);
    if (selectedBrands.length > 0) {
      result = goodsData.products.filter((item) => selectedBrands.includes(item.brand));
      this.searchQueryAppend(
        SearchQueryParameters.brand,
        `${[...new Set(result.map((item) => item.brand))]}`,
        this.searchQuery
      );
    }

    const categories = Array.from(uiElement.querySelectorAll('.category-button'));
    this.buttonsDisabler(result, categories, 'category', 'disabled3');
    return result;
  }

  private findByPriceRange(uiElement: HTMLElement): Goods[] {
    const fromPriceContainer = uiElement.querySelector('.price-slider-from') as HTMLInputElement;
    const toPriceContainer = uiElement.querySelector('.price-slider-to') as HTMLInputElement;
    const minPrice = Math.min(+fromPriceContainer.value, +toPriceContainer.value);
    const maxPrice = Math.max(+fromPriceContainer.value, +toPriceContainer.value);

    fromPriceContainer.setAttribute('value', `${fromPriceContainer.value}`);
    toPriceContainer.setAttribute('value', `${toPriceContainer.value}`);
    const result = goodsData.products.filter((item) => item.price >= minPrice && item.price <= maxPrice);

    const categories = Array.from(uiElement.querySelectorAll('.category-button'));
    const brands = Array.from(uiElement.querySelectorAll('.brand-button'));
    this.buttonsDisabler(result, categories, 'category', 'disabled4');
    this.buttonsDisabler(result, brands, 'brand', 'disabled4');

    if (result.length !== goodsData.products.length) {
      this.searchQueryAppend(SearchQueryParameters.price, `${minPrice}/${maxPrice}`, this.searchQuery);
    }
    return result;
  }

  private findByStockRange(uiElement: HTMLElement): Goods[] {
    const fromStockContainer = uiElement.querySelector('.stock-slider-from') as HTMLInputElement;
    const toStockContainer = uiElement.querySelector('.stock-slider-to') as HTMLInputElement;
    const minStock = Math.min(+fromStockContainer.value, +toStockContainer.value);
    const maxStock = Math.max(+fromStockContainer.value, +toStockContainer.value);

    fromStockContainer.setAttribute('value', `${fromStockContainer.value}`);
    toStockContainer.setAttribute('value', `${toStockContainer.value}`);
    const result = goodsData.products.filter((item) => item.stock >= minStock && item.stock <= maxStock);

    const categories = Array.from(uiElement.querySelectorAll('.category-button'));
    const brands = Array.from(uiElement.querySelectorAll('.brand-button'));
    this.buttonsDisabler(result, categories, 'category', 'disabled5');
    this.buttonsDisabler(result, brands, 'brand', 'disabled5');

    if (result.length !== goodsData.products.length) {
      this.searchQueryAppend(SearchQueryParameters.stock, `${minStock}/${maxStock}`, this.searchQuery);
    }
    return result;
  }

  searchQueryAppend(name: string, value: string, query: URLSearchParams): void {
    query.delete(name);
    if (value.length > 0) {
      query.append(name, value);
    }
  }

  searchQueryRefresh(): void {
    this.searchQuery = new URLSearchParams(document.location.search);
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

  setPriceSlider(foundItems: number[]): void {
    const minPrice = document.querySelector('.price-slider-from') as HTMLInputElement;
    const maxPrice = document.querySelector('.price-slider-to') as HTMLInputElement;
    const prices = foundItems.map((item) => goodsData.products[item - 1].price);
    const minPriceValue = Math.min(...prices);
    const maxPriceValue = Math.max(...prices);
    if (foundItems.length > 0) {
      if (+minPrice.value !== minPriceValue) {
        this.setSliderValue(minPrice, minPriceValue.toString());
      }
      if (+maxPrice.value !== maxPriceValue) {
        this.setSliderValue(maxPrice, maxPriceValue.toString());
      }
    } else {
      minPrice.setAttribute('value', `${minPrice.value}`);
      maxPrice.setAttribute('value', `${maxPrice.value}`);
    }
  }

  setStockSlider(foundItems: number[]): void {
    const minStock = document.querySelector('.stock-slider-from') as HTMLInputElement;
    const maxStock = document.querySelector('.stock-slider-to') as HTMLInputElement;
    const stock = foundItems.map((item) => goodsData.products[item - 1].stock);
    const minStockValue = Math.min(...stock);
    const maxStockValue = Math.max(...stock);

    if (foundItems.length > 0) {
      if (+minStock.value !== +minStockValue) {
        this.setSliderValue(minStock, minStockValue.toString());
      }
      if (+maxStock.value !== +maxStockValue) {
        this.setSliderValue(maxStock, maxStockValue.toString());
      }
    } else {
      minStock.setAttribute('value', `${minStock.value}`);
      maxStock.setAttribute('value', `${maxStock.value}`);
    }
  }

  private buttonsDisabler(result: Goods[], buttons: Element[], property: keyof Goods, classCSS: string): void {
    buttons.forEach((item) => {
      if (item.classList.contains(classCSS)) item.classList.remove(classCSS);
    });
    buttons.forEach((item) => {
      if (!result.map((v) => v[property]).includes(item.id)) {
        item.classList.add(classCSS);
      }
    });
  }

  private setAmountRemainder(uiElement: HTMLElement, foundItems: number[]): void {
    const brandRemainder = uiElement.querySelectorAll('.brand-remainder');
    const categoryRemainder = uiElement.querySelectorAll('.category-remainder');
    const items = foundItems.map((item) => goodsData.products[item - 1]);

    brandRemainder.forEach((item) => {
      const a1 = items.filter((v) => {
        return v.brand === item.id.toString().slice(item.id.indexOf(' ') + 1);
      });
      const a2 = goodsData.products.filter((v) => {
        return v.brand === item.id.toString().slice(item.id.indexOf(' ') + 1);
      });
      item.innerHTML = `(${a1.length}/${a2.length})`;
    });
    categoryRemainder.forEach((item) => {
      const a1 = items.filter((v) => {
        return v.category === item.id.toString().slice(item.id.indexOf(' ') + 1);
      });
      const a2 = goodsData.products.filter((v) => {
        return v.category === item.id.toString().slice(item.id.indexOf(' ') + 1);
      });
      item.innerHTML = `(${a1.length}/${a2.length})`;
    });
  }
}
