import './modal.ts';
import '../../components/Filter';
import goodsData from '../../modules/goods';
import GoodsCatalog from '../../components/GoodsCatalog';
import Header from '../../components/Header';
import { elementNullCheck } from '../../modules/type-checks';

if (document.location.pathname === '/' || document.location.pathname === '/index.html') {
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
      btn.classList.add('small-text');
      const t = document.createTextNode(array[i]);
      btn.appendChild(t);
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

  const goodsNumber = elementNullCheck(document, '.goods-number');

  function filter(event: Event): void {
    let remainingGoods = 100;
    const target: HTMLElement = event.target as HTMLElement;
    if (target !== null) {
      const clickedOption = target.closest('button') as HTMLButtonElement;
      const allItems = document.querySelectorAll('.good-item');
      allItems.forEach((item) => {
        if (item.classList.contains('hide')) item.classList.remove('hide');
      });
      allItems.forEach((item) => {
        if (goodsData.products[+item.id - 1].category !== clickedOption.id) {
          item.classList.add('hide');
          remainingGoods--;
          goodsNumber.innerHTML = `Found: ${remainingGoods}`;
        }
      });
    }
  }

  categoryButtons.addEventListener('click', filter);
}
