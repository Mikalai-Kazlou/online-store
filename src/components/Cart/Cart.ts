import Goods from '../Goods/Goods';

export default class Cart {
  goods: Goods[] = [];

  constructor() {
    this.restore();
  }

  has(goods: Goods): boolean {
    return this.goods.includes(goods);
  }

  add(goods: Goods): void {
    this.goods.push(goods);
    this.save();
  }

  // drop(goods: Goods): void {
  //   this.goods.splice(this.goods.indexOf(goods), 1);
  //   this.save();
  // }

  drop(goods: Goods): void {
    // removes all instances of the product
    const removeAll = (arr: Goods[], val: number) => {
      return arr.filter((item) => item.id !== val);
    };
    const result = removeAll(this.goods, goods.id);
    this.goods = result;
    this.save();
  }

  getLength(): number {
    return this.goods.length;
  }

  getTotal(): number {
    const money: number[] = this.goods.map((item) => item.price);
    const result = money.reduce((accumulator, value) => {
      return accumulator + value;
    }, 0);
    return result;
  }

  getEntries(): Goods[] {
    return this.goods;
  }

  private save(): void {
    const goods: number[] = this.goods.map((item) => item.id);
    localStorage.setItem('rs-online-store-cart-goods', JSON.stringify(goods));
  }

  private restore(): void {
    const goods: number[] = JSON.parse(localStorage.getItem('rs-online-store-cart-goods') as string) || [];
    this.goods = goods.map((id) => new Goods(id));
  }
}
