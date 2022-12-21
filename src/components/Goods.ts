import goodsData from '../modules/goods';

export default class Goods {
  readonly id: number = 0;
  readonly title: string = '';
  readonly description: string = '';
  readonly price: number = 0;
  readonly discountPercentage: number = 0;
  readonly rating: number = 0;
  readonly stock: number = 0;
  readonly brand: string = '';
  readonly category: string = '';
  readonly thumbnail: string = '';
  readonly images: string[] = [];

  constructor(id: number) {
    const goods = goodsData.products.find((product) => product.id === id);
    if (goods) {
      return goods;
    }
  }
}
