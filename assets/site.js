// Theme toggle (light/dark, remembered across pages) and mobile menu.
// The saved theme is applied earlier by an inline script in <head> to avoid a flash.
(function () {
  var root = document.documentElement;
  var KEY = 'aylin-theme';

  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var dark = root.getAttribute('data-theme') !== 'dark';
      if (dark) root.setAttribute('data-theme', 'dark');
      else root.removeAttribute('data-theme');
      try { localStorage.setItem(KEY, dark ? 'dark' : 'light'); } catch (e) {}
    });
  }

  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    var close = function () {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.textContent = '☰';
    };
    hamburger.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
      hamburger.textContent = open ? '✕' : '☰';
    });
    navLinks.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
  }
})();
