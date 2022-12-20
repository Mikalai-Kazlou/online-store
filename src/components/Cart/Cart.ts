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

  drop(goods: Goods): void {
    this.goods = this.goods.filter((item) => item.id !== goods.id);
    this.save();
  }

  getLength(): number {
    return this.goods.length;
  }

  getTotal(): number {
    return this.goods.reduce((total, goods) => total + goods.price, 0);
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
