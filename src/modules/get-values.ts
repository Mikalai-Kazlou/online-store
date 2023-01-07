import goodsData from './goods';

export const getValues = {
  getAllPrices(): number[] {
    const allPrices: number[] = [];
    for (let i = 0; i < goodsData.products.length; i++) {
      allPrices.push(goodsData.products[i].price);
    }
    return allPrices;
  },

  getMinimumPrice(): number {
    const minPrice: number = Math.min(...this.getAllPrices());
    return minPrice;
  },

  getMaximumPrice(): number {
    const maxPrice: number = Math.max(...this.getAllPrices());
    return maxPrice;
  },

  getAllStock(): number[] {
    const allStock: number[] = [];
    for (let i = 0; i < goodsData.products.length; i++) {
      allStock.push(goodsData.products[i].stock);
    }
    return allStock;
  },

  getMinimumStock(): number {
    const minStock: number = Math.min(...this.getAllStock());
    return minStock;
  },

  getMaximumStock(): number {
    const maxStock: number = Math.max(...this.getAllStock());
    return maxStock;
  },

  getProductStock(id: number): number {
    return goodsData.products[id + 1].stock;
  },

  getProductPrice(id: number): number {
    return goodsData.products[id + 1].price;
  },

  getProductDiscount(id: number): number {
    return goodsData.products[id + 1].discountPercentage;
  },
};
