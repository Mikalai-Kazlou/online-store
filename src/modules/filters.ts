import { getValues } from './get-values';
import goodsData from './goods';
import { elementNullCheck } from './helpers';
import Filter from '../components/Filter';
import Goods from '../components/Goods';

if (document.location.pathname === '/' || document.location.pathname === '/index.html') {
  const goodsNumber = elementNullCheck(document, '.goods-number') as HTMLElement;

  let minPriceContainer = elementNullCheck(document, '.min-price');
  let maxPriceContainer = elementNullCheck(document, '.max-price');
  let minStockContainer = elementNullCheck(document, '.min-stock');
  let maxStockContainer = elementNullCheck(document, '.max-stock');
  let priceSliderFrom: HTMLInputElement = document.querySelector('.price-slider') as HTMLInputElement;
  let stockSliderFrom: HTMLInputElement = document.querySelector('.stock-slider') as HTMLInputElement;

  let priceSliderTo: HTMLInputElement = document.querySelector('.price-slider-to') as HTMLInputElement;
  let stockSliderTo: HTMLInputElement = document.querySelector('.stock-slider-to') as HTMLInputElement;

  const filterContent = elementNullCheck(document, '.filters-content') as HTMLElement;
  const goods = new Goods(0);
  const filter = new Filter(filterContent, goods, goodsNumber);
  const foundItem = filter.foundItems;

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

  const searchInput = document.querySelector('.search-input') as HTMLInputElement;

  searchInput.oninput = function (): void {
    refreshSliders();
  };

  priceSliderFrom.oninput = function (): void {
    refreshSliders();
  };

  priceSliderTo.oninput = function (): void {
    refreshSliders();
  };

  stockSliderFrom.oninput = function (): void {
    refreshSliders();
  };

  stockSliderTo.oninput = function (): void {
    refreshSliders();
  };

  function refreshSliders(): void {
    filter.getMatchedResults(filterContent);
    minPriceContainer.innerHTML = `$${priceSliderFrom.value}`;
    maxPriceContainer.innerHTML = `$${priceSliderTo.value}`;
    maxStockContainer.innerHTML = stockSliderTo.value;
    minStockContainer.innerHTML = stockSliderFrom.value;
    paintRange(stockSliderFrom, stockSliderTo);
    paintRange(priceSliderFrom, priceSliderTo);
    sliderSwitcher();
  }

  function sliderSwitcher(): void {
    if (+priceSliderFrom.value > +priceSliderTo.value) {
      let temp = priceSliderFrom.value;
      priceSliderFrom.value = priceSliderTo.value;
      priceSliderTo.value = temp;
    }
    if (+stockSliderFrom.value > +stockSliderTo.value) {
      let temp = stockSliderFrom.value;
      stockSliderFrom.value = stockSliderTo.value;
      stockSliderTo.value = temp;
    }
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

  function splitString(string: string, separator: string): number {
    return +string.split(separator)[0];
  }

  const categoryButtons = elementNullCheck(document, '.filter-category-buttons');
  function categoryFilter(event: Event): void {
    const target: HTMLElement = event.target as HTMLElement;
    if (target !== null) {
      const clickedOption = target.closest('button') as HTMLButtonElement;
      if (clickedOption.classList.contains('selected')) {
        clickedOption.classList.remove('selected');
      } else {
        clickedOption.classList.add('selected');
      }
    }
    filter.getMatchedResults(filterContent);
    paintRange(priceSliderFrom, priceSliderTo);
  }

  const brandButtons = elementNullCheck(document, '.filter-brand-buttons');
  function brandFilter(event: Event): void {
    const target: HTMLElement = event.target as HTMLElement;
    if (target !== null) {
      const clickedOption = target.closest('button') as HTMLButtonElement;
      if (clickedOption.classList.contains('selected')) {
        clickedOption.classList.remove('selected');
      } else {
        clickedOption.classList.add('selected');
      }
    }
    filter.getMatchedResults(filterContent);
    paintRange(priceSliderFrom, priceSliderTo);
  }

  categoryButtons.addEventListener('click', categoryFilter);
  brandButtons.addEventListener('click', brandFilter);

  const buildQuery = function (data: string | boolean[] | number[]) {
    if (typeof data === 'string') return data;
    var query = [];
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
      }
    }
    return query.join('&');
  };
}

