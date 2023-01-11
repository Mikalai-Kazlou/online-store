import goodsData from '../modules/goods';

export default class GoodsData {
  static getAllPrice(): number[] {
    return goodsData.products.map((item) => item.price);
  }

  static getMinPrice(): number {
    return Math.min(...this.getAllPrice());
  }

  static getMaxPrice(): number {
    return Math.max(...this.getAllPrice());
  }

  static getAllStock(): number[] {
    return goodsData.products.map((item) => item.stock);
  }

  static getMinStock(): number {
    return Math.min(...this.getAllStock());
  }

  static getMaxStock(): number {
    return Math.max(...this.getAllStock());
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
