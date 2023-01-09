import goodsData from '../modules/goods';

export default class GoodsData {
  static getAllPrice(): number[] {
    const allPrices: number[] = [];
    for (let i = 0; i < goodsData.products.length; i++) {
      allPrices.push(goodsData.products[i].price);
    }
    return allPrices;
  }

  static getMinPrice(): number {
    const minPrice: number = Math.min(...this.getAllPrice());
    return minPrice;
  }

  static getMaxPrice(): number {
    const maxPrice: number = Math.max(...this.getAllPrice());
    return maxPrice;
  }

  static getAllStock(): number[] {
    const allStock: number[] = [];
    for (let i = 0; i < goodsData.products.length; i++) {
      allStock.push(goodsData.products[i].stock);
    }
    return allStock;
  }

  static getMinStock(): number {
    const minStock: number = Math.min(...this.getAllStock());
    return minStock;
  }

  static getMaxStock(): number {
    const maxStock: number = Math.max(...this.getAllStock());
    return maxStock;
  }

  static getProductStock(id: number): number {
    return goodsData.products[id + 1].stock;
  }

  static getProductPrice(id: number): number {
    return goodsData.products[id + 1].price;
  }

  static getProductDiscount(id: number): number {
    return goodsData.products[id + 1].discountPercentage;
  }
}
