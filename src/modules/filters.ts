import { getValues } from './get-values';
import goodsData from './goods';
import { elementNullCheck } from './helpers';
import Filter from '../components/Filter';
import Goods from '../components/Goods';

if (document.location.pathname === '/' || document.location.pathname === '/index.html') {
  const goodsNumber = elementNullCheck(document, '.goods-number') as HTMLElement;
  const resetButton = elementNullCheck(document, '.reset-filters') as HTMLButtonElement;

  const minPriceContainer = elementNullCheck(document, '.min-price');
  const maxPriceContainer = elementNullCheck(document, '.max-price');
  const minStockContainer = elementNullCheck(document, '.min-stock');
  const maxStockContainer = elementNullCheck(document, '.max-stock');
  const priceSliderFrom: HTMLInputElement = document.querySelector('.price-slider') as HTMLInputElement;
  const stockSliderFrom: HTMLInputElement = document.querySelector('.stock-slider') as HTMLInputElement;

  const priceSliderTo: HTMLInputElement = document.querySelector('.price-slider-to') as HTMLInputElement;
  const stockSliderTo: HTMLInputElement = document.querySelector('.stock-slider-to') as HTMLInputElement;

  const filterContent = elementNullCheck(document, '.filters-content') as HTMLElement;
  const goods = new Goods(0);
  const filter = new Filter(filterContent, goods, goodsNumber);
  const foundItem = filter.foundItems;

  const searchInput = document.querySelector('.search-input') as HTMLInputElement;

  function setValue(element: Element, attr: string, n: number): void {
    element.setAttribute(attr, `${n}`);
  }

  function resetSliders(): void {
  setValue(priceSliderFrom, 'min', getValues.getMinimumPrice());
  setValue(priceSliderFrom, 'max', getValues.getMaximumPrice());
  setValue(priceSliderFrom, 'value', getValues.getMinimumPrice());
  priceSliderFrom.value = getValues.getMinimumPrice().toString();

  setValue(priceSliderTo, 'min', getValues.getMinimumPrice());
  setValue(priceSliderTo, 'max', getValues.getMaximumPrice());
  setValue(priceSliderTo, 'value', getValues.getMaximumPrice());
  priceSliderTo.value = getValues.getMaximumPrice().toString();

  setValue(stockSliderFrom, 'min', getValues.getMinimumStock());
  setValue(stockSliderFrom, 'max', getValues.getMaximumStock());
  setValue(stockSliderFrom, 'value', getValues.getMinimumStock());
  stockSliderFrom.value = getValues.getMinimumStock().toString();

  setValue(stockSliderTo, 'min', getValues.getMinimumStock());
  setValue(stockSliderTo, 'max', getValues.getMaximumStock());
  setValue(stockSliderTo, 'value', getValues.getMaximumStock());
  stockSliderTo.value = getValues.getMaximumStock().toString();

  minPriceContainer.innerHTML = `$${getValues.getMinimumPrice()}`;
  maxPriceContainer.innerHTML = `$${getValues.getMaximumPrice()}`;
  minStockContainer.innerHTML = `${getValues.getMinimumStock()}`;
  maxStockContainer.innerHTML = `${getValues.getMaximumStock()}`;

  paintRange(stockSliderFrom, stockSliderTo);
  paintRange(priceSliderFrom, priceSliderTo);
}

  resetSliders();

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
    // filter.setPriceSlider(foundItem);
  }

  function sliderSwitcher(): void {
    if (+priceSliderFrom.value > +priceSliderTo.value + 10) {
      const temp = priceSliderFrom.value;
      priceSliderFrom.value = priceSliderTo.value;
      priceSliderTo.value = temp;
    }
    if (+stockSliderFrom.value > +stockSliderTo.value + 1) {
      const temp = stockSliderFrom.value;
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

  const copyButton = elementNullCheck(document, '.copy-link') as HTMLButtonElement;
  function copyLink() {
    const copyText = document.location.href;
    navigator.clipboard.writeText(copyText);
    copyButton.innerHTML = 'Copied!';
    setTimeout(() => {
      copyButton.innerHTML = 'Copy Link';
    }, 1200)
  }

  categoryButtons.addEventListener('click', categoryFilter);
  brandButtons.addEventListener('click', brandFilter);
  resetButton.addEventListener('click', () => {
    searchInput.value = '';
    resetSliders();
    filter.reset(foundItem);
  });
  copyButton.addEventListener('click', copyLink);
}