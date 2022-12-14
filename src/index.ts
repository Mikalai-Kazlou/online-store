import './index.scss';

const uiButton: HTMLElement = document.querySelector('.button') as HTMLElement;
uiButton.addEventListener('click', () => alert('Hello World!'));