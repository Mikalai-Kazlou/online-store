switch (true) {
  case document.location.pathname === '/' ||
    document.location.pathname === '/online-store/' ||
    document.location.pathname.includes('index'):
    break;
  case document.location.pathname.includes('details'):
    break;
  case document.location.pathname.includes('cart'):
    break;
  case document.location.pathname.includes('404'):
    break;
  default:
    window.location.replace('/404.html');
    break;
}
