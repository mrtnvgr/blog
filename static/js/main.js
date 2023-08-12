const themeToggle = document.querySelector('#theme-toggle');
const themeSwitch = document.querySelector('#theme-switch');
const preferDark = window.matchMedia("(prefers-color-scheme: dark)");

if (!localStorage.getItem("theme") && preferDark.matches) toggleTheme("dark");
if (localStorage.getItem("theme") == "dark") toggleTheme("dark");

themeToggle.addEventListener('click', () => toggleTheme(localStorage.getItem("theme") == "dark" ? "light" : "dark"));
themeSwitch.addEventListener('click', () => switchTheme());
preferDark.addEventListener("change", e => toggleTheme(e.matches ? "dark" : "light"));

function toggleTheme(theme) {
  if (theme == "dark") document.body.classList.add('dark');
  else document.body.classList.remove('dark');
  localStorage.setItem("theme", theme);
  themeToggle.innerHTML = theme == "dark" ? themeToggle.dataset.sunIcon : themeToggle.dataset.moonIcon;
  toggleGiscusTheme(theme);
}

function switchTheme() {
  let name = localStorage.getItem("scheme");

  switch (name) {
    case null:
    case "onedark":
      name = "dracula";
      break;
    case "dracula":
      name = "nord";
      break;
    case "nord":
      name = "catppuccin";
      break;
    case "catppuccin":
      name = "everforest";
      break;
    case "everforest":
      name = "everblush";
      break;
    default:
      name = "onedark";
  }

  let scheme = document.querySelector('#scheme');
  scheme.href = `/${name}.css`;

  let syntax = document.querySelector('#syntax');
  syntax.href = `/${name}-syntax.css`;

  localStorage.setItem("scheme", name);
}

function toggleGiscusTheme(theme) {
  const iframe = document.querySelector('iframe.giscus-frame');
  if (iframe) iframe.contentWindow.postMessage({ giscus: { setConfig: { theme: `${location.origin}/giscus_${theme}.css` } } }, 'https://giscus.app');
}

window.addEventListener('message', initGiscusTheme);
function initGiscusTheme() {
  toggleGiscusTheme(localStorage.getItem("theme") || (preferDark.matches ? "dark" : "light"));
  window.removeEventListener('message', initGiscusTheme);
}

/* post page */
if (document.body.classList.contains('post')) {
  /* img lightense */
  window.addEventListener("load", () => Lightense("article img", { background: 'rgba(43, 43, 43, 0.19)' }));
}
