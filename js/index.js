const themeButton = document.querySelector('#theme-toggle');
const menuButton = document.querySelector('#menu-toggle');
const asideMenu = document.querySelector('#aside-menu');
const htmlElement = document.documentElement;
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  htmlElement.setAttribute('data-theme', savedTheme);
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  htmlElement.setAttribute('data-theme', 'dark');
}

function definirBoton() {
  const currentTheme = htmlElement.getAttribute('data-theme');
  if (currentTheme === 'dark') {
    themeButton.innerHTML = "🌙";
  } else {
    themeButton.innerHTML = "☀️";
  }
}
definirBoton();

themeButton.addEventListener('click', () => {
  const currentTheme = htmlElement.getAttribute('data-theme');
  if (currentTheme === 'dark') {
    htmlElement.removeAttribute('data-theme'); // Vuelve al modo claro por defecto
    localStorage.setItem('theme', 'light');
    themeButton.innerHTML = "☀️";
  } else {
    htmlElement.setAttribute('data-theme', 'dark'); // Cambia a oscuro
    localStorage.setItem('theme', 'dark');
    themeButton.innerHTML = "🌙";
  }
});
menuButton.addEventListener('click', () => {
  asideMenu.classList.toggle('hidden');
})