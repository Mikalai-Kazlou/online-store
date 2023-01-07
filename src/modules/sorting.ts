import Filter from '../components/Filter';

import goodsData from './goods';
import { elementNullCheck } from './helpers';
import { isCatalogPage } from './pages';
import { FilterType, sortingType, viewType, SearchQueryParameters } from './enums';

if (isCatalogPage(document.location.pathname)) {
  const sortingContainer = elementNullCheck(document, '.sort-input') as HTMLSelectElement;
  const viewContainer = elementNullCheck(document, '.view-input') as HTMLSelectElement;
  const goodsItems = elementNullCheck(document, '.goods-items');

  const goodsNumber = elementNullCheck(document, '.goods-number') as HTMLElement;
  const filterContent = elementNullCheck(document, '.filters-content') as HTMLElement;
  const filter = new Filter(filterContent, goodsNumber);

  function disableDefaultSort(): void {
    const defaultSortValue = document.querySelector('#sort-by>option[value=default]') as HTMLOptionElement;
    defaultSortValue.disabled = true;
  }

  function setSort(uiElement: HTMLSelectElement): void {
    const allItems = document.querySelectorAll('.good-item');

    filter.searchQueryRefresh();

    if (uiElement.value === sortingType.PriceAscending) {
      filter.searchQueryAppend(SearchQueryParameters.sorting, sortingType.PriceAscending, filter.searchQuery);
      const itemsArr = [];
      for (const i in allItems) {
        if (allItems[i].nodeType == 1) {
          itemsArr.push(allItems[i]);
        }
      }

      itemsArr.sort(function (a, b) {
        const productAPrice = goodsData.products[+a.id - 1].price;
        const productBPrice = goodsData.products[+b.id - 1].price;
        return productAPrice == productBPrice ? 0 : productAPrice > productBPrice ? 1 : -1;
      });

      for (let i = 0; i < itemsArr.length; ++i) {
        goodsItems.appendChild(itemsArr[i]);
      }
    } else if (uiElement.value === sortingType.PriceDescending) {
      const itemsArr = [];
      filter.searchQueryAppend(SearchQueryParameters.sorting, sortingType.PriceDescending, filter.searchQuery);
      for (const i in allItems) {
        if (allItems[i].nodeType == 1) {
          itemsArr.push(allItems[i]);
        }
      }

      itemsArr.sort(function (a, b) {
        const productAPrice = goodsData.products[+a.id - 1].price;
        const productBPrice = goodsData.products[+b.id - 1].price;
        return productAPrice == productBPrice ? 0 : productAPrice < productBPrice ? 1 : -1;
      });

      for (let i = 0; i < itemsArr.length; ++i) {
        goodsItems.appendChild(itemsArr[i]);
      }
    } else if (uiElement.value === sortingType.NameAscending) {
      filter.searchQueryAppend(SearchQueryParameters.sorting, sortingType.NameAscending, filter.searchQuery);
      const itemsArr = [];
      for (const i in allItems) {
        if (allItems[i].nodeType == 1) {
          itemsArr.push(allItems[i]);
        }
      }

      itemsArr.sort(function (a, b) {
        const productATitle = goodsData.products[+a.id - 1].title;
        const productBTitle = goodsData.products[+b.id - 1].title;
        return productATitle == productBTitle ? 0 : productATitle > productBTitle ? 1 : -1;
      });

      for (let i = 0; i < itemsArr.length; ++i) {
        goodsItems.appendChild(itemsArr[i]);
      }
    } else if (uiElement.value === sortingType.NameDescending) {
      filter.searchQueryAppend(SearchQueryParameters.sorting, sortingType.NameDescending, filter.searchQuery);
      const itemsArr = [];
      for (const i in allItems) {
        if (allItems[i].nodeType == 1) {
          itemsArr.push(allItems[i]);
        }
      }

      itemsArr.sort(function (a, b) {
        const productATitle = goodsData.products[+a.id - 1].title;
        const productBTitle = goodsData.products[+b.id - 1].title;
        return productATitle == productBTitle ? 0 : productATitle < productBTitle ? 1 : -1;
      });

      for (let i = 0; i < itemsArr.length; ++i) {
        goodsItems.appendChild(itemsArr[i]);
      }
    }

    filter.getMatchedResults(FilterType.sorting);
  }

  function setView(uiElement: HTMLSelectElement): void {
    const allItems = document.querySelectorAll('.good-item');
    const allDescriptions = document.querySelectorAll('.product-description');

    filter.searchQueryRefresh();

    if (uiElement.value === viewType.Standard) {
      filter.searchQueryAppend(SearchQueryParameters.view, viewType.Standard, filter.searchQuery);
      allItems.forEach((item) => {
        if (item.classList.contains(viewType.Small)) item.classList.remove(viewType.Small);
      });
      allDescriptions.forEach((item) => {
        if (item.classList.contains('hide')) item.classList.remove('hide');
      });
    } else if (uiElement.value === viewType.Small) {
      filter.searchQueryAppend(SearchQueryParameters.view, viewType.Small, filter.searchQuery);
      allItems.forEach((item) => {
        if (!item.classList.contains(viewType.Small)) item.classList.add(viewType.Small);
      });
      allDescriptions.forEach((item) => {
        if (!item.classList.contains('hide')) item.classList.add('hide');
      });
    }

    filter.getMatchedResults(FilterType.view);
  }

  function onViewChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    setView(target);
  }

  function onSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    disableDefaultSort();
    setSort(target);
  }

  function setViewOnLoad(): void {
    const viewInput = document.querySelector('.view-input') as HTMLSelectElement;
    setView(viewInput);

    const sortInput = document.querySelector('.sort-input') as HTMLSelectElement;
    setSort(sortInput);
  }

  sortingContainer.addEventListener('change', onSortChange);
  viewContainer.addEventListener('change', onViewChange);

  window.addEventListener('load', setViewOnLoad);
}
