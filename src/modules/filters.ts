import Filter from '../components/Filter';

import { getValues } from './get-values';
import { elementNullCheck, formatAmount } from './helpers';
import { isCatalogPage } from './pages';
import { FilterType } from './enums';

if (isCatalogPage(document.location.pathname)) {
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
  const filter = new Filter(filterContent, goodsNumber);

  const searchInput = document.querySelector('.search-input') as HTMLInputElement;

  function setValue(element: Element, attr: string, n: number): void {
    element.setAttribute(attr, `${n}`);
  }

  function resetSliders(): void {
    filter.searchQueryRefresh();

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

    minPriceContainer.innerHTML = `${formatAmount(getValues.getMinimumPrice())}`;
    maxPriceContainer.innerHTML = `${formatAmount(getValues.getMaximumPrice())}`;
    minStockContainer.innerHTML = `${getValues.getMinimumStock()}`;
    maxStockContainer.innerHTML = `${getValues.getMaximumStock()}`;

    paintRange(stockSliderFrom, stockSliderTo);
    paintRange(priceSliderFrom, priceSliderTo);
  }

  resetSliders();

  searchInput.oninput = function (): void {
    refreshFilters(FilterType.search);
  };

  priceSliderFrom.oninput = function (): void {
    refreshFilters(FilterType.price);
  };

  priceSliderTo.oninput = function (): void {
    refreshFilters(FilterType.price);
  };

  stockSliderFrom.oninput = function (): void {
    refreshFilters(FilterType.stock);
  };

  stockSliderTo.oninput = function (): void {
    refreshFilters(FilterType.stock);
  };

  function refreshFilters(filterType: FilterType): void {
    filter.searchQueryRefresh();
    filter.getMatchedResults(filterType);
    refreshSliders();
  }

  function refreshSliders(): void {
    sliderSwitcher();
    minPriceContainer.innerHTML = `${formatAmount(+priceSliderFrom.value)}`;
    maxPriceContainer.innerHTML = `${formatAmount(+priceSliderTo.value)}`;
    minStockContainer.innerHTML = stockSliderFrom.value;
    maxStockContainer.innerHTML = stockSliderTo.value;
    paintRange(priceSliderFrom, priceSliderTo);
    paintRange(stockSliderFrom, stockSliderTo);
  }

  function sliderSwitcher(): void {
    if (+priceSliderFrom.value > +priceSliderTo.value) {
      const temp = priceSliderFrom.value;
      priceSliderFrom.value = priceSliderTo.value;
      priceSliderTo.value = temp;
    }
    if (+stockSliderFrom.value > +stockSliderTo.value) {
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
    refreshFilters(FilterType.category);
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
    refreshFilters(FilterType.brand);
  }

  const copyButton = elementNullCheck(document, '.copy-link') as HTMLButtonElement;
  function copyLink() {
    const copyText = document.location.href;
    navigator.clipboard.writeText(copyText);
    copyButton.innerHTML = 'Copied!';
    setTimeout(() => {
      copyButton.innerHTML = 'Copy Link';
    }, 1200);
  }

  categoryButtons.addEventListener('click', categoryFilter);
  brandButtons.addEventListener('click', brandFilter);

  resetButton.addEventListener('click', () => {
    searchInput.value = '';
    resetSliders();
    filter.reset();
  });

  copyButton.addEventListener('click', copyLink);

  window.addEventListener('load', () => {
    filter.parseQueryString(filter.searchQuery);
    refreshFilters(FilterType.empty);
  });
}
