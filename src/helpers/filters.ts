import { getValues } from './get-values';
import goodsData from '../goods';
import { elementNullCheck } from '../types/type-checks';

if (document.location.pathname === '/' || document.location.pathname === '/index.html') {

const goodsNumber = elementNullCheck(document, '.goods-number');

const minPriceContainer = elementNullCheck(document, '.min-price');
const maxPriceContainer = elementNullCheck(document, '.max-price');
const minStockContainer = elementNullCheck(document, '.min-stock');
const maxStockContainer = elementNullCheck(document, '.max-stock');
const priceSlider: HTMLInputElement = document.querySelector('.price-slider') as HTMLInputElement;
const stockSlider: HTMLInputElement = document.querySelector('.stock-slider') as HTMLInputElement;

function setValue(element: Element, attr: string, n: number,): void {
    element.setAttribute(attr, `${n}`);
}

setValue(priceSlider, 'min', getValues.getMinimumPrice());
setValue(priceSlider, 'max', getValues.getMaximumPrice());
setValue(priceSlider, 'value', getValues.getMaximumPrice());

setValue(stockSlider, 'min', getValues.getMinimumStock());
setValue(stockSlider, 'max', getValues.getMaximumStock());
setValue(stockSlider, 'value', getValues.getMaximumStock());

minPriceContainer.innerHTML = `$${getValues.getMinimumPrice()}`;
maxPriceContainer.innerHTML = `$${getValues.getMaximumPrice()}`;
minStockContainer.innerHTML = `${getValues.getMinimumStock()}`;
maxStockContainer.innerHTML = `${getValues.getMaximumStock()}`;

priceSlider.oninput = function (): void {
    maxPriceContainer.innerHTML = `$${priceSlider.value}`;
};

stockSlider.oninput = function (): void {
    maxStockContainer.innerHTML = stockSlider.value;
};

function priceFilter(event: Event): void {
    let remainingGoods = 100;
  const target: HTMLInputElement = event.target as HTMLInputElement;
  if (target !== null) {
    const currentPrice: number = +target.value;
    const allItems = document.querySelectorAll('.good-item');
    allItems.forEach((item) => {
      if (item.classList.contains('hide')) item.classList.remove('hide');
    });
    allItems.forEach((item) => {
      if (goodsData.products[+item.id - 1].price > currentPrice) {
        item.classList.add('hide');
        remainingGoods--;
        goodsNumber.innerHTML = `Found: ${remainingGoods}`;
      }
    });
  }
}

function stockFilter(event: Event): void {
  let remainingGoods = 100;
  const target: HTMLInputElement = event.target as HTMLInputElement;
  if (target !== null) {
    const currentStock: number = +target.value;
    const allItems = document.querySelectorAll('.good-item');
    allItems.forEach((item) => {
      if (item.classList.contains('hide')) item.classList.remove('hide');
    });
    allItems.forEach((item) => {
      if (goodsData.products[+item.id - 1].stock > currentStock) {
        item.classList.add('hide');
        remainingGoods--;
        goodsNumber.innerHTML = `Found: ${remainingGoods}`;
      }
    });
  }
}

priceSlider.addEventListener('input', priceFilter);
stockSlider.addEventListener('input', stockFilter);
}