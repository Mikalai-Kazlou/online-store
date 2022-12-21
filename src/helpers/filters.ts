import { getValues } from './get-values';
import goodsData from '../goods';
import { elementNullCheck } from '../types/type-checks';

if (document.location.pathname === '/' || document.location.pathname === '/index.html') {
  const goodsNumber = elementNullCheck(document, '.goods-number');

  let minPriceContainer = elementNullCheck(document, '.min-price');
  let maxPriceContainer = elementNullCheck(document, '.max-price');
  let minStockContainer = elementNullCheck(document, '.min-stock');
  let maxStockContainer = elementNullCheck(document, '.max-stock');
  const priceSliderFrom: HTMLInputElement = document.querySelector('.price-slider') as HTMLInputElement;
  const stockSliderFrom: HTMLInputElement = document.querySelector('.stock-slider') as HTMLInputElement;

  const priceSliderTo: HTMLInputElement = document.querySelector('.price-slider-to') as HTMLInputElement;
  const stockSliderTo: HTMLInputElement = document.querySelector('.stock-slider-to') as HTMLInputElement;

  function setValue(element: Element, attr: string, n: number): void {
    element.setAttribute(attr, `${n}`);
  }

  setValue(priceSliderFrom, 'min', getValues.getMinimumPrice());
  setValue(priceSliderFrom, 'max', getValues.getMaximumPrice());
  setValue(priceSliderFrom, 'value', getValues.getMinimumPrice());

  setValue(priceSliderTo, 'min', getValues.getMinimumPrice());
  setValue(priceSliderTo, 'max', getValues.getMaximumPrice());
  setValue(priceSliderTo, 'value', getValues.getMaximumPrice());

  setValue(stockSliderFrom, 'min', getValues.getMinimumStock());
  setValue(stockSliderFrom, 'max', getValues.getMaximumStock());
  setValue(stockSliderFrom, 'value', getValues.getMinimumStock());

  setValue(stockSliderTo, 'min', getValues.getMinimumStock());
  setValue(stockSliderTo, 'max', getValues.getMaximumStock());
  setValue(stockSliderTo, 'value', getValues.getMaximumStock());

  minPriceContainer.innerHTML = `$${getValues.getMinimumPrice()}`;
  maxPriceContainer.innerHTML = `$${getValues.getMaximumPrice()}`;
  minStockContainer.innerHTML = `${getValues.getMinimumStock()}`;
  maxStockContainer.innerHTML = `${getValues.getMaximumStock()}`;

  priceSliderFrom.oninput = function (): void {
    minPriceContainer.innerHTML = `$${priceSliderFrom.value}`;
  };

  priceSliderTo.oninput = function (): void {
    maxPriceContainer.innerHTML = `$${priceSliderTo.value}`;
  };

  stockSliderFrom.oninput = function (): void {
    minStockContainer.innerHTML = stockSliderFrom.value;
  };

  stockSliderTo.oninput = function (): void {
    maxStockContainer.innerHTML = stockSliderTo.value;
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
    } paintRange(priceSliderFrom, priceSliderTo);
  }

  function priceFilterFrom(event: Event): void {
    let remainingGoods = 100;
    const target: HTMLInputElement = event.target as HTMLInputElement;
    if (target !== null) {
      const currentPrice: number = +target.value;
      const allItems = document.querySelectorAll('.good-item');
      allItems.forEach((item) => {
        if (item.classList.contains('hide')) item.classList.remove('hide');
      });
      allItems.forEach((item) => {
        if (goodsData.products[+item.id - 1].price < currentPrice) {
          item.classList.add('hide');
          remainingGoods--;
          goodsNumber.innerHTML = `Found: ${remainingGoods}`;
        }
      });
    } paintRange(priceSliderFrom, priceSliderTo);
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
    } paintRange(stockSliderFrom, stockSliderTo);
  }

  function stockFilterFrom(event: Event): void {
    let remainingGoods = 100;
    const target: HTMLInputElement = event.target as HTMLInputElement;
    if (target !== null) {
      const currentStock: number = +target.value;
      const allItems = document.querySelectorAll('.good-item');
      allItems.forEach((item) => {
        if (item.classList.contains('hide')) item.classList.remove('hide');
      });
      allItems.forEach((item) => {
        if (goodsData.products[+item.id - 1].stock < currentStock) {
          item.classList.add('hide');
          remainingGoods--;
          goodsNumber.innerHTML = `Found: ${remainingGoods}`;
        }
      });
    } paintRange(stockSliderFrom, stockSliderTo);
  }

  function paintRange(fromSlider: HTMLInputElement, toSlider: HTMLInputElement): void {
    const sliderColor = '#C6C6C6';
    const rangeColor = '#8708ff';
    const rangeDistance = +toSlider.max - +toSlider.min;
    const fromPosition = +fromSlider.value - +toSlider.min;
    const toPosition = +toSlider.value - +toSlider.min;
    toSlider.style.background = `linear-gradient(
      to right,
      ${sliderColor} 0%,
      ${sliderColor} ${(fromPosition / rangeDistance) * 100}%,
      ${rangeColor} ${(fromPosition / rangeDistance) * 100}%,
      ${rangeColor} ${(toPosition / rangeDistance) * 100}%,
      ${sliderColor} ${(toPosition / rangeDistance) * 100}%,
      ${sliderColor} 100%)`;
  }

  paintRange(priceSliderFrom, priceSliderTo);
  paintRange(stockSliderFrom, stockSliderTo);

  priceSliderTo.addEventListener('input', priceFilter);
  priceSliderFrom.addEventListener('input', priceFilterFrom);
  stockSliderTo.addEventListener('input', stockFilter);
  stockSliderFrom.addEventListener('input', stockFilterFrom);
}
