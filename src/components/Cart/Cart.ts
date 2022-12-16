import Goods from "../Goods/Goods";

export default class Cart {
  private goods: Goods[] = [];

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
    this.goods.splice(this.goods.indexOf(goods), 1);
    this.save();
  }

  private save(): void {
    const goods: number[] = this.goods.map(item => item.id);
    localStorage.setItem('rs-online-store-cart-goods', JSON.stringify(goods));
  }

  private restore(): void {
    const goods: number[] = JSON.parse(localStorage.getItem('rs-online-store-cart-goods') as string) || [];
    this.goods = goods.map(id => new Goods(id));
  }
}