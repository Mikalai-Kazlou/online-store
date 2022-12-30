import goodsData from './goods';
import { elementNullCheck } from './helpers';
import Filter from '../components/Filter';
import Goods from '../components/Goods';

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
    if (target.value === `price-lowest`) {
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
    } else if (target.value === `price-highest`) {
      const itemsArr = [];
      filter.searchQueryAppend('sorting', `price-highest`, filter.searchQuery);
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
    } else if (target.value === `name-a`) {
      filter.searchQueryAppend('sorting', `name-a`, filter.searchQuery);
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
    } else if (target.value === `name-z`) {
      filter.searchQueryAppend('sorting', `name-z`, filter.searchQuery);
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
    } else if (target.value === `view-standard`) {
      filter.searchQueryAppend('view', `standard`, filter.searchQuery);
      allItems.forEach((item) => {
        if (item.classList.contains('view-small')) item.classList.remove('view-small');
      });
      allDescriptions.forEach((item) => {
        if (item.classList.contains('hide')) item.classList.remove('hide');
      });
    } else if (target.value === `view-small`) {
      filter.searchQueryAppend('view', `view-small`, filter.searchQuery);
      allItems.forEach((item) => {
        if (!item.classList.contains('view-small')) item.classList.add('view-small');
      });
      allDescriptions.forEach((item) => {
        if (!item.classList.contains('hide')) item.classList.add('hide');
      });
    }
  }

  sortingContainer.addEventListener('change', sort);
  viewContainer.addEventListener('change', sort);
}
