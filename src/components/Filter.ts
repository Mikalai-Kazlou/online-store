import Goods from './Goods';
import goodsData from '../modules/goods';
import { sortingType, viewType, FilterType, SearchQueryParameters } from '../modules/enums';

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

  getMatchedResults(filterType: FilterType) {
    // this method is for use on clicks
    this.setMatchedResults(this.uiElement, filterType);
    this.refreshCounter(this.foundItems);
    this.hideItems();
    this.setAmountRemainder(this.uiElement, this.foundItems);
    this.save(this.foundItems);
    this.checkSearch(this.searchQuery, this.foundItems);
    this.setPriceSlider(this.foundItems);
    this.setStockSlider(this.foundItems);
  }

  private save(result: number[]): void {
    localStorage.setItem('RS Online-Store SearchResults', JSON.stringify(result));
  }

  checkSearch(searchQuery: URLSearchParams, foundItems: number[], filterType: FilterType): void {
    if (foundItems.length !== goodsData.products.length || [FilterType.view, FilterType.sorting].includes(filterType)) {
      window.history.pushState({}, '', `/?${searchQuery}`);
    } else {
      for (let key of Array.from(searchQuery.keys())) {
        searchQuery.delete(key);
      }
    }
    const questionMark = !searchQuery.toString() || searchQuery.toString()[0] === '?' ? '' : '?';
    window.history.replaceState({}, '', `${window.location.pathname}${questionMark}${searchQuery.toString()}`);
  }

  parseQueryString(searchQuery: URLSearchParams): void {
    // this method is for use on load
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
      if (searchQuery.has(SearchQueryParameters.stock)) {
        const range = searchQuery.get(SearchQueryParameters.stock) || '';
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
      if (searchQuery.has(SearchQueryParameters.search)) {
        const searchText = searchQuery.get(SearchQueryParameters.search) || '';
        const searchResults: Goods[] = [];
        for (let i = 0; i < goodsData.products.length; i++) {
          if (goodsData.products[i].brand.toLowerCase().includes(searchText.toLowerCase())) {
            searchResults.push(goodsData.products[i]);
          }
          if (goodsData.products[i].title.toLowerCase().includes(searchText.toLowerCase())) {
            searchResults.push(goodsData.products[i]);
          }
          if (goodsData.products[i].price.toString().includes(searchText.toLowerCase())) {
            searchResults.push(goodsData.products[i]);
          }
          if (goodsData.products[i].stock.toString().includes(searchText.toLowerCase())) {
            searchResults.push(goodsData.products[i]);
          }
          if (goodsData.products[i].description.toLowerCase().includes(searchText.toLowerCase())) {
            searchResults.push(goodsData.products[i]);
          }
          if (goodsData.products[i].rating.toString().includes(searchText.toLowerCase())) {
            searchResults.push(goodsData.products[i]);
          }
        }
        const searchQueryContainer = document.querySelector('.search-input') as HTMLInputElement;
        searchQueryContainer.value = searchText;
        const result = [...new Set(searchResults)];
        matrix.push(result);
      }
      if (searchQuery.has('sorting')) {
        const sorting = searchQuery.get('sorting');
        const sortInput = document.querySelector('.sort-input') as HTMLSelectElement;
        if (sorting === sortingType.NameAscending) {
          sortInput.value = sortingType.NameAscending;
        }
        if (sorting === sortingType.NameDescending) {
          sortInput.value = sortingType.NameDescending;
        }
        if (sorting === sortingType.PriceAscending) {
          sortInput.value = sortingType.PriceAscending;
        }
        if (sorting === sortingType.PriceDescending) {
          sortInput.value = sortingType.PriceDescending;
        }
      }
      if (searchQuery.has('view')) {
        const view = searchQuery.get('view');
        const viewInput = document.querySelector('.view-input') as HTMLSelectElement;
        if (view === viewType.Standard) {
          viewInput.value = viewType.Standard;
        }
        if (view === viewType.Small) {
          viewInput.value = viewType.Small;
        }
      }
    }
    const resultGoods: Goods[] | undefined = matrix.shift()?.filter(function (v) {
      return matrix.every(function (a) {
        return a.indexOf(v) !== -1;
      });
    });

    if (typeof resultGoods !== 'undefined'){
    const result = resultGoods.map((item) => item.id);
    if (result.length > 0) {
      this.foundItems = result;
      this.getMatchedResults(FilterType.empty);
    }}
  }

  setSliderValue(container: HTMLInputElement, value: string): void {
    container.setAttribute('value', value);
    container.value = value;
  }

  reset(/*foundItems: number[]*/) {
    //foundItems = [];
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

  private setMatchedResults(uiElement: HTMLElement, filterType: FilterType) {
    const matrix: Goods[][] = [];
    matrix.push(goodsData.products);

    if (
      [FilterType.reset, FilterType.search].includes(filterType) ||
      this.searchQuery.has(SearchQueryParameters.search)
    ) {
      const resultByText = this.findByText(uiElement);
      if (resultByText.length > 0 && resultByText.length !== goodsData.products.length) {
        matrix.push(resultByText);
      }
    }

    if (
      [FilterType.reset, FilterType.category].includes(filterType) ||
      this.searchQuery.has(SearchQueryParameters.category)
    ) {
      const resultByCategory = this.findByCategories(this.uiElement);
      if (resultByCategory.length > 0 && resultByCategory.length !== goodsData.products.length) {
        matrix.push(resultByCategory);
      }
    }

    if (
      [FilterType.reset, FilterType.brand].includes(filterType) ||
      this.searchQuery.has(SearchQueryParameters.brand)
    ) {
      const resultByBrand = this.findByBrands(this.uiElement);
      if (resultByBrand.length > 0 && resultByBrand.length !== goodsData.products.length) {
        matrix.push(resultByBrand);
      }
    }

    if (
      [FilterType.reset, FilterType.price].includes(filterType) ||
      this.searchQuery.has(SearchQueryParameters.price)
    ) {
      const resultByPrice = this.findByPriceRange(this.uiElement);
      if (resultByPrice.length > 0 && resultByPrice.length !== goodsData.products.length) {
        matrix.push(resultByPrice);
      }
    }

    if (
      [FilterType.reset, FilterType.stock].includes(filterType) ||
      this.searchQuery.has(SearchQueryParameters.stock)
    ) {
      const resultByStock = this.findByStockRange(this.uiElement);
      if (resultByStock.length > 0 && resultByStock.length !== goodsData.products.length) {
        matrix.push(resultByStock);
      }
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

  private findByText(uiElement: HTMLElement) {
    const searchQueryContainer = uiElement.querySelector('.search-input') as HTMLInputElement;
    const searchQueryInput = searchQueryContainer.value;
    const searchResults: Goods[] = [];
    searchQueryContainer.setAttribute('value', `${searchQueryContainer.value}`);
    for (let i = 0; i < goodsData.products.length; i++) {
      if (goodsData.products[i].brand.toLowerCase().includes(searchQueryInput.toLowerCase())) {
        searchResults.push(goodsData.products[i]);
      }
      if (goodsData.products[i].title.toLowerCase().includes(searchQueryInput.toLowerCase())) {
        searchResults.push(goodsData.products[i]);
      }
      if (goodsData.products[i].description.toLowerCase().includes(searchQueryInput.toLowerCase())) {
        searchResults.push(goodsData.products[i]);
      }
      if (goodsData.products[i].category.toLowerCase().includes(searchQueryInput.toLowerCase())) {
        searchResults.push(goodsData.products[i]);
      }
      if (goodsData.products[i].rating.toString().includes(searchQueryInput.toLowerCase())) {
        searchResults.push(goodsData.products[i]);
      }
      if (goodsData.products[i].price.toString().includes(searchQueryInput.toLowerCase())) {
        searchResults.push(goodsData.products[i]);
      }
      if (goodsData.products[i].stock.toString().includes(searchQueryInput.toLowerCase())) {
        searchResults.push(goodsData.products[i]);
      }
    }
    const result = [...new Set(searchResults)];
    if (searchQueryInput.length > 0 && result.length === 0) {
      searchQueryContainer.setAttribute('maxlength', `${searchQueryInput.length - 1}`);
      searchQueryContainer.value = searchQueryContainer.value.slice(0, -1);
      return this.foundItems.map((item) => goodsData.products[item - 1]);
    } else {
      searchQueryContainer.removeAttribute('maxlength');
    }
    const brands = Array.from(uiElement.querySelectorAll('.brand-button'));
    const categories = Array.from(uiElement.querySelectorAll('.category-button'));
    this.buttonsDisablerText(result, brands, categories);
    this.searchQueryAppend(SearchQueryParameters.search, `${searchQueryInput}`, this.searchQuery);
    return result;
  }

  private findByCategories(uiElement: HTMLElement): Goods[] {
    const categories = Array.from(uiElement.querySelectorAll('.category-button'));
    const selectedCategories = categories.filter((item) => item.classList.contains('selected')).map((item) => item.id);
    const result = goodsData.products.filter((item) => selectedCategories.includes(item.category));
    const brands = Array.from(uiElement.querySelectorAll('.brand-button'));
    this.buttonsDisabler(result, brands, selectedCategories.length, 'brand');
    this.searchQueryAppend(
      SearchQueryParameters.category,
      `${[...new Set(result.map((item) => item.category))]}`,
      this.searchQuery
    );
    return result;
  }

  private findByBrands(uiElement: HTMLElement): Goods[] {
    const brands = Array.from(uiElement.querySelectorAll('.brand-button'));
    const selectedBrands = brands.filter((item) => item.classList.contains('selected')).map((item) => item.id);
    const result = goodsData.products.filter((item) => selectedBrands.includes(item.brand));
    const categories = Array.from(uiElement.querySelectorAll('.category-button'));
    this.buttonsDisabler(result, categories, selectedBrands.length, 'category');
    this.searchQueryAppend(
      SearchQueryParameters.brand,
      `${[...new Set(result.map((item) => item.brand))]}`,
      this.searchQuery
    );
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
      this.searchQueryAppend(SearchQueryParameters.price, `${minPrice}/${maxPrice}`, this.searchQuery);
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
      this.searchQueryAppend(SearchQueryParameters.stock, `${minStock}/${maxStock}`, this.searchQuery);
    }
    return result;
  }

  searchQueryAppend(name: string, value: string, query: URLSearchParams) {
    query.delete(name);
    if (value.length > 0) {
      query.append(name, value);
    }
  }

  searchQueryRefresh() {
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

  setPriceSlider(foundItems: number[]) {
    const minPrice = document.querySelector('.price-slider-from') as HTMLInputElement;
    const maxPrice = document.querySelector('.price-slider-to') as HTMLInputElement;
    const prices = foundItems.map((item) => goodsData.products[item - 1].price);
    const minPriceValue = Math.min(...prices); //Math.min.apply(Math, prices);
    const maxPriceValue = Math.max(...prices); //Math.max.apply(Math, prices);
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

  setStockSlider(foundItems: number[]) {
    const minStock = document.querySelector('.stock-slider-from') as HTMLInputElement;
    const maxStock = document.querySelector('.stock-slider-to') as HTMLInputElement;
    const stock = foundItems.map((item) => goodsData.products[item - 1].stock);
    const minStockValue = Math.min(...stock); //Math.min.apply(Math, stock);
    const maxStockValue = Math.max(...stock); //Math.max.apply(Math, stock);

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
