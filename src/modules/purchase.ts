function showPurchaseWindow() {
  const uiPurchaseBackground = document.querySelector('.purchase-background');
  uiPurchaseBackground?.classList.remove('no-display');
  document.body.classList.add('no-scroll');
}

function hidePurchaseWindow(event: Event) {
  const target = event.target as HTMLElement;
  if (!target?.classList.contains("purchase-background")) return;

  target?.classList.add('no-display');
  document.body.classList.remove('no-scroll');
}

const uiBuyNow = document.querySelector('.buy-now');
uiBuyNow?.addEventListener('click', () => showPurchaseWindow());

const uiPurchaseBackground = document.querySelector('.purchase-background');
uiPurchaseBackground?.addEventListener('click', (event: Event) => hidePurchaseWindow(event));