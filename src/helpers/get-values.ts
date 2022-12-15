import goodsData from '../goods';

export const getValues = {
  getAllPrices(): number[] {
    let allPrices: number[] = [];
    for (let i = 0; i < goodsData.products.length; i++) {
      allPrices.push(goodsData.products[i].price);
    }
    return allPrices;
  },

  getMinimumPrice(): number {
    const minPrice: number = Math.min.apply(Math, this.getAllPrices());
    return minPrice;
  },

  getMaximumPrice(): number {
    const maxPrice: number = Math.max.apply(Math, this.getAllPrices());
    return maxPrice;
  },

  getAllStock(): number[] {
    let allStock: number[] = [];
    for (let i = 0; i < goodsData.products.length; i++) {
      allStock.push(goodsData.products[i].stock);
    }
    return allStock;
  },

  getMinimumStock(): number {
    const minStock: number = Math.min.apply(Math, this.getAllStock());
    return minStock;
  },

  getMaximumStock(): number {
    const maxStock: number = Math.max.apply(Math, this.getAllStock());
    return maxStock;
  },
};