import goodsData from '../../goods';
import Goods from '../Goods/Goods';
import Cart from '../Cart/Cart';
import GoodsCatalogItem from '../GoodsCatalogItem/GoodsCatalogItem';

export default class GoodsCatalog {
  private uiElement: HTMLElement;
  private cart: Cart = new Cart();

  items: GoodsCatalogItem[] = [];

  constructor(uiElement: HTMLElement) {
    this.uiElement = uiElement;
  }

  draw() {
    goodsData.products.forEach((goods) => {
      const uiGoods = document.createElement('button');
      uiGoods.classList.add('good-item');

      const item = new GoodsCatalogItem(uiGoods, new Goods(goods.id), this.cart);
      item.draw();

      this.items.push(item);
      this.uiElement.appendChild(uiGoods);
    });
  }
}
