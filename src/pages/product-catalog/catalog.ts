import './modal';

import GoodsCatalog from '../../components/GoodsCatalog';
import Header from '../../components/Header';

import goodsData from '../../modules/goods';
import { getNullCheckedElement } from '../../modules/helpers';
import { isCatalogPage } from '../../modules/pages';

if (isCatalogPage(document.location.pathname)) {
  const categoriesSet = getCategories();
  const categoriesArray = Array.from(categoriesSet);

  const brandsSet = getBrands();
  const brandsArray = Array.from(brandsSet);

  const categoryButtons = getNullCheckedElement(document, '.filter-category-buttons');
  const brandButtons = getNullCheckedElement(document, '.filter-brand-buttons');

  function getCategories(): Set<string> {
    const result = goodsData.products.map((product) => product.category);
    return new Set(result);
  }

  function getBrands(): Set<string> {
    const result = goodsData.products.map((product) => product.brand);
    return new Set(result);
  }

  function printButtons(array: string[], parent: Element, cls: string): void {
    for (let i = 0; i < array.length; i++) {
      const btn = document.createElement('button');
      btn.classList.add('button', `${cls}`);
      const buttonName = document.createElement('div');
      buttonName.classList.add('button-name');
      const buttonAmount = document.createElement('div');
      btn.classList.add('small-text');
      const t = document.createTextNode(array[i]);
      let amount = 0;

      if (cls === 'brand-button') {
        amount = goodsData.products.filter((item) => item.brand === array[i]).length;
        buttonAmount.classList.add('brand-remainder');
        buttonAmount.setAttribute('id', `brand ${array[i]}`);
      } else if (cls === 'category-button') {
        amount = goodsData.products.filter((item) => item.category === array[i]).length;
        buttonAmount.classList.add('category-remainder');
        buttonAmount.setAttribute('id', `category ${array[i]}`);
      }

      const n = document.createTextNode(`(${amount}/${amount})`);
      btn.appendChild(buttonName);
      btn.appendChild(buttonAmount);
      buttonName.appendChild(t);
      buttonAmount.appendChild(n);
      btn.setAttribute('id', array[i]);
      parent.appendChild(btn);
    }
  }

  printButtons(categoriesArray, categoryButtons, 'category-button');
  printButtons(brandsArray, brandButtons, 'brand-button');

  const uiGoodsItems = getNullCheckedElement(document, '.goods-items') as HTMLElement;
  const goodsCatalog = new GoodsCatalog(uiGoodsItems);
  goodsCatalog.draw();

  const uiHeader = getNullCheckedElement(document, '.header-content') as HTMLElement;
  const header = new Header(uiHeader);
  header.refresh();
}
