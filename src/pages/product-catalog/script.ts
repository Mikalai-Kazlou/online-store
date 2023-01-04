import './modal.ts';
import '../../components/Filter';
import goodsData from '../../modules/goods';
import GoodsCatalog from '../../components/GoodsCatalog';
import Header from '../../components/Header';
import { elementNullCheck } from '../../modules/helpers';

if (
  document.location.pathname === '/' ||
  document.location.pathname === '/online-store/' ||
  document.location.pathname.includes('index')
) {
  function getCategories(): Set<string> {
    const length = goodsData.products.length;
    const result: string[] = [];
    for (let i = 0; i < length; i++) {
      result.push(goodsData.products[i].category);
    }
    return new Set(result);
  }

  function getBrands(): Set<string> {
    const length = goodsData.products.length;
    const result: string[] = [];
    for (let i = 0; i < length; i++) {
      result.push(goodsData.products[i].brand);
    }
    return new Set(result);
  }

  const categoriesSet = getCategories();
  const categoriesArray = Array.from(categoriesSet);
  const brandsSet = getBrands();
  const brandsArray = Array.from(brandsSet);
  const categoryButtons = elementNullCheck(document, '.filter-category-buttons');
  const brandButtons = elementNullCheck(document, '.filter-brand-buttons');

  function printButtons(array: string[], parent: Element, cls: string): void {
    for (let i = 0; i < array.length; i++) {
      const btn = document.createElement('button');
      btn.classList.add('button');
      btn.classList.add(`${cls}`);
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

  const uiGoodsItems = elementNullCheck(document, '.goods-items') as HTMLElement;
  const goodsCatalog = new GoodsCatalog(uiGoodsItems);
  goodsCatalog.draw();

  const uiHeader = elementNullCheck(document, '.header-content') as HTMLElement;
  const header = new Header(uiHeader);
  header.refresh();
}
