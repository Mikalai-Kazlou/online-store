import Filter from '../components/Filter';

import goodsData from './goods';
import { getNullCheckedElement } from './helpers';
import { isCatalogPage } from './pages';
import { FilterType, SortingType, ViewType, SearchQueryParameters } from './enums';

if (isCatalogPage(document.location.pathname)) {
  const sortingContainer = getNullCheckedElement(document, '.sort-input') as HTMLSelectElement;
  const viewContainer = getNullCheckedElement(document, '.view-input') as HTMLSelectElement;
  const goodsItems = getNullCheckedElement(document, '.goods-items');

  const goodsNumber = getNullCheckedElement(document, '.goods-number') as HTMLElement;
  const filterContent = getNullCheckedElement(document, '.filters-content') as HTMLElement;
  const filter = new Filter(filterContent, goodsNumber);

  function disableDefaultSort(): void {
    const defaultSortValue = document.querySelector('#sort-by>option[value=default]') as HTMLOptionElement;
    defaultSortValue.disabled = true;
  }

  function setSort(uiElement: HTMLSelectElement): void {
    const allItems = document.querySelectorAll('.good-item');

    filter.searchQueryRefresh();

    if (uiElement.value === SortingType.PriceAscending) {
      filter.searchQueryAppend(SearchQueryParameters.sorting, SortingType.PriceAscending, filter.searchQuery);
      const itemsArr: Element[] = [];
      for (const i in allItems) {
        if (allItems[i].nodeType == 1) {
          itemsArr.push(allItems[i]);
        }
      }

      itemsArr
        .sort(function (a, b) {
          const productAPrice = goodsData.products[+a.id - 1].price;
          const productBPrice = goodsData.products[+b.id - 1].price;
          return productAPrice == productBPrice ? 0 : productAPrice > productBPrice ? 1 : -1;
        })
        .forEach((item) => goodsItems.appendChild(item));

    } else if (uiElement.value === SortingType.PriceDescending) {
      const itemsArr: Element[] = [];
      filter.searchQueryAppend(SearchQueryParameters.sorting, SortingType.PriceDescending, filter.searchQuery);
      for (const i in allItems) {
        if (allItems[i].nodeType == 1) {
          itemsArr.push(allItems[i]);
        }
      }

      itemsArr
        .sort(function (a, b) {
          const productAPrice = goodsData.products[+a.id - 1].price;
          const productBPrice = goodsData.products[+b.id - 1].price;
          return productAPrice == productBPrice ? 0 : productAPrice < productBPrice ? 1 : -1;
        })
        .forEach((item) => goodsItems.appendChild(item));

    } else if (uiElement.value === SortingType.NameAscending) {
      filter.searchQueryAppend(SearchQueryParameters.sorting, SortingType.NameAscending, filter.searchQuery);
      const itemsArr: Element[] = [];
      for (const i in allItems) {
        if (allItems[i].nodeType == 1) {
          itemsArr.push(allItems[i]);
        }
      }

      itemsArr
        .sort(function (a, b) {
          const productATitle = goodsData.products[+a.id - 1].title;
          const productBTitle = goodsData.products[+b.id - 1].title;
          return productATitle == productBTitle ? 0 : productATitle > productBTitle ? 1 : -1;
        })
        .forEach((item) => goodsItems.appendChild(item));

    } else if (uiElement.value === SortingType.NameDescending) {
      filter.searchQueryAppend(SearchQueryParameters.sorting, SortingType.NameDescending, filter.searchQuery);
      const itemsArr: Element[] = [];
      for (const i in allItems) {
        if (allItems[i].nodeType == 1) {
          itemsArr.push(allItems[i]);
        }
      }

      itemsArr
        .sort(function (a, b) {
          const productATitle = goodsData.products[+a.id - 1].title;
          const productBTitle = goodsData.products[+b.id - 1].title;
          return productATitle == productBTitle ? 0 : productATitle < productBTitle ? 1 : -1;
        })
        .forEach((item) => goodsItems.appendChild(item));
    }

    filter.getMatchedResults(FilterType.sorting);
  }

  function setView(uiElement: HTMLSelectElement): void {
    const allItems = document.querySelectorAll('.good-item');
    const allDescriptions = document.querySelectorAll('.product-description');

    filter.searchQueryRefresh();

    if (uiElement.value === ViewType.Standard) {
      filter.searchQueryAppend(SearchQueryParameters.view, ViewType.Standard, filter.searchQuery);
      allItems.forEach((item) => {
        if (item.classList.contains(ViewType.Small)) item.classList.remove(ViewType.Small);
      });
      allDescriptions.forEach((item) => {
        if (item.classList.contains('hide')) item.classList.remove('hide');
      });
    } else if (uiElement.value === ViewType.Small) {
      filter.searchQueryAppend(SearchQueryParameters.view, ViewType.Small, filter.searchQuery);
      allItems.forEach((item) => {
        if (!item.classList.contains(ViewType.Small)) item.classList.add(ViewType.Small);
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
