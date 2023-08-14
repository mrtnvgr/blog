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

  /* code copy button */
  const addCopyBtns = () => {
    const cfg = document.querySelector('#copy-cfg');
    if (!cfg) return;
    const copyIcon = cfg.dataset.copyIcon;
    const checkIcon = cfg.dataset.checkIcon;
    document.querySelectorAll('pre').forEach(block => {
      if (block.classList.contains('mermaid')) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block';
      const btn = document.createElement('button');
      btn.className = 'copy';
      btn.ariaLabel = 'copy';
      btn.innerHTML = copyIcon;
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(block.textContent).then(() => {
          btn.innerHTML = checkIcon;
          setTimeout(() => btn.innerHTML = copyIcon, 2000);
        });
      });
      wrapper.appendChild(block.cloneNode(true));
      wrapper.appendChild(btn);
      block.replaceWith(wrapper);
    });
  };
  addCopyBtns();
}
