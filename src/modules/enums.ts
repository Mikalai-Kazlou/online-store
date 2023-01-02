export enum sortingType {
  PriceAscending = 'price-lowest',
  PriceDescending = 'price-highest',
  NameAscending = 'name-a',
  NameDescending = 'name-z',
}

export enum viewType {
  Standard = 'view-standard',
  Small = 'view-small',
}

export enum FilterType {
  empty,
  reset,
  search,
  category,
  brand,
  price,
  stock,
}

export enum SearchQueryParameters {
  search = 'search',
  category = 'category',
  brand = 'brand',
  price = 'price',
  stock = 'stock',
}
