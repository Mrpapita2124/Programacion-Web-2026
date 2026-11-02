export function iniciarMenuDesplegable() {
  const asideMenu = document.querySelector('#aside-menu');
  const menuButton = document.querySelector('#menu-toggle');

  if (!asideMenu || !menuButton) return;

  menuButton.addEventListener('click', () => {
    const open = asideMenu.classList.toggle('-translate-x-full') === false;
    menuButton.setAttribute('aria-expanded', open);
  });
}
