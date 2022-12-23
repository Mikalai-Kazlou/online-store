export function elementNullCheck(parent: Element | Document, selector: string): Element {
  const el = parent.querySelector(selector);
  if (!el) {
    throw new Error(`${selector} is not an element.`);
  }
  return el;
}

export function formatAmount(amount: number): string {
  return `$${String(amount.toFixed(2))}`;
}
