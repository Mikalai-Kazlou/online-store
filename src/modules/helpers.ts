export function elementNullCheck(parent: Element | Document, selector: string): Element {
  const el = parent.querySelector(selector);
  if (!el) {
    throw new Error(`${selector} is not an element.`);
  }
  return el;
}

export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export function loadImage(src: string, uiImage: HTMLElement) {
  const image = new Image();
  image.src = src;
  image.onload = () => {
    uiImage.style.backgroundImage = `url('${image.src}')`;
  };
  image.onerror = () => {
    setTimeout(() => loadImage(src, uiImage), 1000);
  };
}
