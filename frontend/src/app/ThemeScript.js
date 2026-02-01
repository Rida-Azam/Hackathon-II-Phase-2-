(function() {
  try {
    var theme = localStorage.getItem('theme');
    var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
    if (!theme && supportDarkMode) theme = 'dark';
    if (!theme) theme = 'light';

    // Default to dark if not set (Phase II requirement)
    if (!localStorage.getItem('theme')) theme = 'dark';

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch {}
})();
