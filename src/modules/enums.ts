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
  view,
  sorting,
  search,
  category,
  brand,
  price,
  stock,
}

export enum SearchQueryParameters {
  view = 'view',
  sorting = 'sorting',
  search = 'search',
  category = 'category',
  brand = 'brand',
  price = 'price',
  stock = 'stock',
  action = 'action',
}

export enum CustomActions {
  buy = 'buy',
  submit = 'submit',
}
