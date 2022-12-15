import goodsData from "./goods.js";

console.log(goodsData.products[0].category);

function getCategories() {
  const length = goodsData.products.length;
  const result = [];
  for (let i = 0; i < length; i++) {
    result.push(goodsData.products[i].category);
  }
  return new Set(result);
}

function getBrands() {
    const length = goodsData.products.length;
    const result = [];
    for (let i = 0; i < length; i++) {
      result.push(goodsData.products[i].brand);
    }
    return new Set(result);
  }

const categoriesSet = getCategories();
const categoriesArray = Array.from(categoriesSet);
const brandsSet = getBrands();
const brandsArray = Array.from(brandsSet);

console.log(categoriesArray);
const categoryButtons = document.querySelector('.filter-category-buttons');
const brandButtons = document.querySelector('.filter-brand-buttons');

function printButtons(array, parent, cls) {
    for (let i = 0; i < array.length; i++) {
      let btn = document.createElement("button");
      btn.classList.add("button");
      btn.classList.add(`${cls}`);
      btn.classList.add("small-text");
      let t = document.createTextNode(array[i]);
      btn.appendChild(t);
      btn.setAttribute("id", array[i]);
      parent.appendChild(btn);
    }
  }

printButtons(categoriesArray, categoryButtons, 'category-button');
printButtons(brandsArray, brandButtons, 'brand-button');

const goodsItems = document.querySelector('.goods-items');

function printGoods() {
  for (let i = 0; i < goodsData.products.length; i++) {
    let good = document.createElement("button");
    good.classList.add("good-item");

    let picture = document.createElement("div");
    picture.classList.add("picture");
    picture.style.backgroundImage = `url("${goodsData.products[i].thumbnail}")`;

    let productName = document.createElement("div");
    productName.innerHTML = `${goodsData.products[i].title}`;
    productName.classList.add("main-text");

    let price = document.createElement("div");
    price.classList.add("small-text");
    price.innerHTML = `$${goodsData.products[i].price}`;

    let description = document.createElement("div");
    description.classList.add("small-text");
    description.innerHTML = `${goodsData.products[i].description}`;

    goodsItems.appendChild(good);
    good.setAttribute("id", goodsData.products[i].id);
    good.appendChild(picture);
    good.appendChild(productName);
    good.appendChild(price);
    good.appendChild(description);
  }
}

printGoods();

let goodsNumber = document.querySelector('.goods-number');

function filter(event) {
  let remainingGoods = 100;
  const clickedOption = event.target.closest('button');
  const allItems = document.querySelectorAll('.good-item');
  allItems.forEach((item) => {
    if (item.classList.contains('hide'))
      item.classList.remove('hide');
  });
  allItems.forEach((item) => {
    if (goodsData.products[item.id - 1].category !== clickedOption.id) {
      item.classList.add('hide');
      remainingGoods--;
      goodsNumber.innerHTML = `Found: ${remainingGoods}`
    };
  });
}

categoryButtons.addEventListener("click", filter);