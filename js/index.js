const themeButton = document.querySelector('#theme-toggle');
const menuButton = document.querySelector('#menu-toggle');
const asideMenu = document.querySelector('#aside-menu');

// Cargar preferencia guardada o preferencia del sistema
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.body.classList.add('dark');
  themeButton.innerHTML = "🌙";
} else {
  themeButton.innerHTML = "☀️";
}

// Alternar una clase en body con classList
themeButton.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  themeButton.innerHTML = isDark ? "🌙" : "☀️";
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

menuButton.addEventListener('click', () => {
  const open = asideMenu.classList.toggle('-translate-x-full') === false;
  menuButton.setAttribute('aria-expanded', open);
});
