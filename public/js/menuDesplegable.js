export function iniciarMenuDesplegable() {
  const asideMenu = document.querySelector('#aside-menu');
  const menuButton = document.querySelector('#menu-toggle');

  if (!asideMenu || !menuButton) return;

  const backdrop = document.createElement('div');
  backdrop.className = 'hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[35] md:hidden';
  document.body.appendChild(backdrop);

  function cerrar() {
    asideMenu.classList.add('-translate-x-full');
    backdrop.classList.add('hidden');
    menuButton.setAttribute('aria-expanded', false);
  }

  menuButton.addEventListener('click', () => {
    const open = asideMenu.classList.toggle('-translate-x-full') === false;
    backdrop.classList.toggle('hidden', !open);
    menuButton.setAttribute('aria-expanded', open);
  });

  backdrop.addEventListener('click', cerrar);
}
