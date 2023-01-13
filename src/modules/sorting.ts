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

    if (uiElement.value === SortingType.priceAscending) {
      filter.searchQueryAppend(SearchQueryParameters.sorting, SortingType.priceAscending, filter.searchQuery);
      const itemsArr: Element[] = [];
      for (const i in allItems) {
        if (allItems[i].nodeType == 1) {
          itemsArr.push(allItems[i]);
        }
      }

      itemsArr
        .sort((a, b) => goodsData.products[+a.id - 1].price - goodsData.products[+b.id - 1].price)
        .forEach((item) => goodsItems.appendChild(item));
    } else if (uiElement.value === SortingType.priceDescending) {
      const itemsArr: Element[] = [];
      filter.searchQueryAppend(SearchQueryParameters.sorting, SortingType.priceDescending, filter.searchQuery);
      for (const i in allItems) {
        if (allItems[i].nodeType == 1) {
          itemsArr.push(allItems[i]);
        }
      }

      itemsArr
        .sort((a, b) => goodsData.products[+b.id - 1].price - goodsData.products[+a.id - 1].price)
        .forEach((item) => goodsItems.appendChild(item));
    } else if (uiElement.value === SortingType.nameAscending) {
      filter.searchQueryAppend(SearchQueryParameters.sorting, SortingType.nameAscending, filter.searchQuery);
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
    } else if (uiElement.value === SortingType.nameDescending) {
      filter.searchQueryAppend(SearchQueryParameters.sorting, SortingType.nameDescending, filter.searchQuery);
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

    if (uiElement.value === ViewType.standard) {
      filter.searchQueryAppend(SearchQueryParameters.view, ViewType.standard, filter.searchQuery);
      allItems.forEach((item) => {
        if (item.classList.contains(ViewType.small)) item.classList.remove(ViewType.small);
      });
      allDescriptions.forEach((item) => {
        if (item.classList.contains('hide')) item.classList.remove('hide');
      });
    } else if (uiElement.value === ViewType.small) {
      filter.searchQueryAppend(SearchQueryParameters.view, ViewType.small, filter.searchQuery);
      allItems.forEach((item) => {
        if (!item.classList.contains(ViewType.small)) item.classList.add(ViewType.small);
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
