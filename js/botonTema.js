export function iniciarBotonTema() {
  const themeButton = document.querySelector('#theme-toggle');
  if (!themeButton) return;

  const savedPreferences = JSON.parse(
    localStorage.getItem('userPreferences')
  ) || {};

  const savedTheme = savedPreferences.theme;

  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) 
  {
    document.body.classList.add('dark');
    themeButton.innerHTML = "🌙";

  } 
  else 
  {
    document.body.classList.remove('dark');
    themeButton.innerHTML = "☀️";
  }

  themeButton.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark');
    themeButton.innerHTML = isDark ? "🌙" : "☀️";

    const preferences = 
    {
      theme: isDark ? 'dark' : 'light'
    };

    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  });
}