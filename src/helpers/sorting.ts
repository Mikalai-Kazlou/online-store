import goodsData from '../goods';
import { elementNullCheck } from '../types/type-checks';

const sortingContainer = elementNullCheck(document, '.sort-input') as HTMLSelectElement;
const goodsItems = elementNullCheck(document, '.goods-items');

function sort(event: Event): void {
  const target: HTMLSelectElement = event.target as HTMLSelectElement;
  const allItems = document.querySelectorAll('.good-item');
  if (target.value === `price-lowest`) {
    let itemsArr = [];
    for (let i in allItems) {
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
    let itemsArr = [];
    for (let i in allItems) {
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
    let itemsArr = [];
    for (let i in allItems) {
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
    let itemsArr = [];
    for (let i in allItems) {
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
  }
}

sortingContainer.addEventListener('change', sort);
