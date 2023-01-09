export function isCatalogPage(path: string): boolean {
  return path === '/' || path === '/online-store/' || path.includes('index');
}

export function isCartPage(path: string): boolean {
  return path.includes('cart');
}

export function isDetailsPage(path: string): boolean {
  return path.includes('details');
}
