export function isCatalogPage(path: string) {
  return path === '/' || path === '/online-store/' || path.includes('index');
}

export function isCartPage(path: string) {
  return path.includes('cart');
}

export function isDetailsPage(path: string) {
  return path.includes('details');
}
