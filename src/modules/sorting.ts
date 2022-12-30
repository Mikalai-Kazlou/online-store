import goodsData from './goods';
import { elementNullCheck } from './helpers';
import Filter from '../components/Filter';
import Goods from '../components/Goods';
import {sortingType, viewType} from '../modules/enums';

if (document.location.pathname === '/' || document.location.pathname === '/index.html') {
  const sortingContainer = elementNullCheck(document, '.sort-input') as HTMLSelectElement;
  const viewContainer = elementNullCheck(document, '.view-input') as HTMLSelectElement;
  const goodsItems = elementNullCheck(document, '.goods-items');

  const goodsNumber = elementNullCheck(document, '.goods-number') as HTMLElement;
  const filterContent = elementNullCheck(document, '.filters-content') as HTMLElement;
  const goods = new Goods(0);
  const filter = new Filter(filterContent, goods, goodsNumber);
  const foundItem = filter.foundItems;

  function sort(event: Event): void {
    const target: HTMLSelectElement = event.target as HTMLSelectElement;
    const allItems = document.querySelectorAll('.good-item');
    const allDescriptions = document.querySelectorAll('.product-description');
    if (target.value === sortingType.PriceAscending) {
      filter.searchQueryAppend('sorting', sortingType.PriceAscending, filter.searchQuery);
      const itemsArr = [];
      for (const i in allItems) {
        if (allItems[i].nodeType == 1) {
          itemsArr.push(allItems[i]);
        }
      }

      itemsArr.sort(function (a, b) {
        return goodsData.products[+a.id - 1].price == goodsData.products[+b.id - 1].price
          ? 0
          : goodsData.products[+a.id - 1].price > goodsData.products[+b.id - 1].price
          ? 1
          : -1;
      });

      for (let i = 0; i < itemsArr.length; ++i) {
        goodsItems.appendChild(itemsArr[i]);
      }
    } else if (target.value === sortingType.PriceDescending) {
      const itemsArr = [];
      filter.searchQueryAppend('sorting', sortingType.PriceDescending, filter.searchQuery);
      for (const i in allItems) {
        if (allItems[i].nodeType == 1) {
          itemsArr.push(allItems[i]);
        }
      }

      itemsArr.sort(function (a, b) {
        return goodsData.products[+a.id - 1].price == goodsData.products[+b.id - 1].price
          ? 0
          : goodsData.products[+a.id - 1].price < goodsData.products[+b.id - 1].price
          ? 1
          : -1;
      });

      for (let i = 0; i < itemsArr.length; ++i) {
        goodsItems.appendChild(itemsArr[i]);
      }
    } else if (target.value === sortingType.NameAscending) {
      filter.searchQueryAppend('sorting', sortingType.NameAscending, filter.searchQuery);
      const itemsArr = [];
      for (const i in allItems) {
        if (allItems[i].nodeType == 1) {
          itemsArr.push(allItems[i]);
        }
      }

      itemsArr.sort(function (a, b) {
        return goodsData.products[+a.id - 1].title == goodsData.products[+b.id - 1].title
          ? 0
          : goodsData.products[+a.id - 1].title > goodsData.products[+b.id - 1].title
          ? 1
          : -1;
      });

      for (let i = 0; i < itemsArr.length; ++i) {
        goodsItems.appendChild(itemsArr[i]);
      }
    } else if (target.value === sortingType.NameDescending) {
      filter.searchQueryAppend('sorting', sortingType.NameDescending, filter.searchQuery);
      const itemsArr = [];
      for (const i in allItems) {
        if (allItems[i].nodeType == 1) {
          itemsArr.push(allItems[i]);
        }
      }

      itemsArr.sort(function (a, b) {
        return goodsData.products[+a.id - 1].title == goodsData.products[+b.id - 1].title
          ? 0
          : goodsData.products[+a.id - 1].title < goodsData.products[+b.id - 1].title
          ? 1
          : -1;
      });

      for (let i = 0; i < itemsArr.length; ++i) {
        goodsItems.appendChild(itemsArr[i]);
      }
    } else if (target.value === viewType.Standard) {
      filter.searchQueryAppend('view', viewType.Standard, filter.searchQuery);
      allItems.forEach((item) => {
        if (item.classList.contains(viewType.Small)) item.classList.remove(viewType.Small);
      });
      allDescriptions.forEach((item) => {
        if (item.classList.contains('hide')) item.classList.remove('hide');
      });
    } else if (target.value === viewType.Small) {
      filter.searchQueryAppend('view', viewType.Small, filter.searchQuery);
      allItems.forEach((item) => {
        if (!item.classList.contains(viewType.Small)) item.classList.add(viewType.Small);
      });
      allDescriptions.forEach((item) => {
        if (!item.classList.contains('hide')) item.classList.add('hide');
      });
    }
  }

  sortingContainer.addEventListener('change', sort);
  viewContainer.addEventListener('change', sort);
}
