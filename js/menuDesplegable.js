const asideMenu = document.querySelector('#aside-menu');

menuButton.addEventListener('click', () => {
  const open = asideMenu.classList.toggle('-translate-x-full') === false;
  menuButton.setAttribute('aria-expanded', open);
});