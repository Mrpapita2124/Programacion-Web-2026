const themeButton = document.querySelector('#theme-toggle');

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.body.classList.add('dark');
  themeButton.innerHTML = "🌙";
} else {
  themeButton.innerHTML = "☀️";
};

themeButton.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  themeButton.innerHTML = isDark ? "🌙" : "☀️";
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});
