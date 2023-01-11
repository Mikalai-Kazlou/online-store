export enum SortingType {
  priceAscending = 'price-lowest',
  priceDescending = 'price-highest',
  nameAscending = 'name-a',
  nameDescending = 'name-z',
}

export enum ViewType {
  standard = 'view-standard',
  small = 'view-small',
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

export enum ValidatedFields {
  name,
  phone,
  address,
  email,
  card,
  valid,
  cvv,
}
