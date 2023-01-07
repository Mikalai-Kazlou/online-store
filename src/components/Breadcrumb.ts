import { SearchQueryParameters } from '../modules/enums';

export default class Breadcrumb {
  private category: string;
  private brand: string;
  private name: string;

  constructor(category: string, brand: string, name: string) {
    this.category = category;
    this.brand = brand;
    this.name = name;
  }

  fill(categoryBox: Element, brandBox: Element, nameBox: Element) {
    categoryBox.innerHTML = this.category + ' /';
    categoryBox.setAttribute('href', `./?${SearchQueryParameters.category}=${this.category}`);

    brandBox.innerHTML = this.brand + ' /';
    brandBox.setAttribute('href', `./?${SearchQueryParameters.brand}=${this.brand}`);

    nameBox.innerHTML = this.name;
    nameBox.setAttribute('href', `./?${SearchQueryParameters.search}=${this.name.split(' ').slice(0, 1).join(' ')}`);
  }
}