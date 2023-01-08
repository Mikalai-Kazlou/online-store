import Filter from '../components/Filter';
import GoodsData from '../components/GoodsData';

import { getNullCheckedElement, formatAmount } from './helpers';
import { isCatalogPage } from './pages';
import { FilterType } from './enums';

if (isCatalogPage(document.location.pathname)) {
  const goodsNumber = getNullCheckedElement(document, '.goods-number') as HTMLElement;

  const resetButton = getNullCheckedElement(document, '.reset-filters') as HTMLButtonElement;
  const copyButton = getNullCheckedElement(document, '.copy-link') as HTMLButtonElement;

  const categoryButtons = getNullCheckedElement(document, '.filter-category-buttons');
  const brandButtons = getNullCheckedElement(document, '.filter-brand-buttons');

  const minPriceContainer = getNullCheckedElement(document, '.min-price');
  const maxPriceContainer = getNullCheckedElement(document, '.max-price');
  const minStockContainer = getNullCheckedElement(document, '.min-stock');
  const maxStockContainer = getNullCheckedElement(document, '.max-stock');

  const priceSliderFrom: HTMLInputElement = document.querySelector('.price-slider') as HTMLInputElement;
  const stockSliderFrom: HTMLInputElement = document.querySelector('.stock-slider') as HTMLInputElement;

  const priceSliderTo: HTMLInputElement = document.querySelector('.price-slider-to') as HTMLInputElement;
  const stockSliderTo: HTMLInputElement = document.querySelector('.stock-slider-to') as HTMLInputElement;

  const filterContent = getNullCheckedElement(document, '.filters-content') as HTMLElement;
  const filter = new Filter(filterContent, goodsNumber);

  const searchInput = document.querySelector('.search-input') as HTMLInputElement;

  function setValue(element: Element, attr: string, n: number): void {
    element.setAttribute(attr, `${n}`);
  }

  function resetSliders(): void {
    filter.searchQueryRefresh();

    setValue(priceSliderFrom, 'min', GoodsData.getMinPrice());
    setValue(priceSliderFrom, 'max', GoodsData.getMaxPrice());
    setValue(priceSliderFrom, 'value', GoodsData.getMinPrice());
    priceSliderFrom.value = GoodsData.getMinPrice().toString();

    setValue(priceSliderTo, 'min', GoodsData.getMinPrice());
    setValue(priceSliderTo, 'max', GoodsData.getMaxPrice());
    setValue(priceSliderTo, 'value', GoodsData.getMaxPrice());
    priceSliderTo.value = GoodsData.getMaxPrice().toString();

    setValue(stockSliderFrom, 'min', GoodsData.getMinStock());
    setValue(stockSliderFrom, 'max', GoodsData.getMaxStock());
    setValue(stockSliderFrom, 'value', GoodsData.getMinStock());
    stockSliderFrom.value = GoodsData.getMinStock().toString();

    setValue(stockSliderTo, 'min', GoodsData.getMinStock());
    setValue(stockSliderTo, 'max', GoodsData.getMaxStock());
    setValue(stockSliderTo, 'value', GoodsData.getMaxStock());
    stockSliderTo.value = GoodsData.getMaxStock().toString();

    minPriceContainer.innerHTML = `${formatAmount(GoodsData.getMinPrice())}`;
    maxPriceContainer.innerHTML = `${formatAmount(GoodsData.getMaxPrice())}`;
    minStockContainer.innerHTML = `${GoodsData.getMinStock()}`;
    maxStockContainer.innerHTML = `${GoodsData.getMaxStock()}`;

    paintRange(stockSliderFrom, stockSliderTo);
    paintRange(priceSliderFrom, priceSliderTo);
  }

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

  function copyLink() {
    const copyText = document.location.href;
    navigator.clipboard.writeText(copyText);
    copyButton.innerHTML = 'Copied!';
    setTimeout(() => {
      copyButton.innerHTML = 'Copy Link';
    }, 1200);
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

  paintRange(priceSliderFrom, priceSliderTo);
  paintRange(stockSliderFrom, stockSliderTo);

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
