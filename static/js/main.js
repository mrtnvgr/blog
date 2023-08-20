const themeToggle = document.querySelector('#theme-toggle');
const themeSwitch = document.querySelector('#theme-switch');
const syntaxCSS = document.querySelector("link#syntax");
const preferDark = window.matchMedia("(prefers-color-scheme: dark)");

if (!localStorage.getItem("theme") && preferDark.matches) toggleTheme("dark");
if (localStorage.getItem("theme") == "dark") toggleTheme("dark");

themeToggle.addEventListener('click', () => toggleTheme(localStorage.getItem("theme") == "dark" ? "light" : "dark"));
themeSwitch.addEventListener('click', () => switchTheme());
preferDark.addEventListener("change", e => toggleTheme(e.matches ? "dark" : "light"));

function toggleTheme(theme) {
  if (theme == "dark") document.body.classList.add('dark'); else document.body.classList.remove('dark');
  themeToggle.innerHTML = theme == "dark" ? themeToggle.dataset.sunIcon : themeToggle.dataset.moonIcon;
  localStorage.setItem("theme", theme);
  toggleGiscusTheme(theme);
}

function switchTheme() {
  let name = localStorage.getItem("scheme");

  document.body.classList.remove(name);

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
    case "everblush":
      name = "rose-pine";
      break;
    default:
      name = "onedark";
  }

  document.body.classList.add(name);

  if (syntaxCSS) syntaxCSS.href = `/${name}-syntax.css`;

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
  /* footnote backlink */
  const backlinkIcon = document.querySelector('article').dataset.backlinkIcon;
  const footnotes = document.querySelectorAll('.footnote-definition');
  footnotes.forEach(footnote => {
    const backlink = document.createElement('button');
    backlink.className = 'backlink';
    backlink.ariaLabel = 'backlink';
    backlink.innerHTML = backlinkIcon;
    backlink.addEventListener('click', () => window.scrollTo({
      top: document.querySelector(`.footnote-reference a[href="#${footnote.id}"]`).getBoundingClientRect().top + window.scrollY - 50,
    }));
    footnote.appendChild(backlink);
  });

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
      wrapper.className = 'codeblock';

      const btn = document.createElement('button');
      btn.className = 'copy';
      btn.ariaLabel = 'copy';
      btn.innerHTML = copyIcon;

      const copy = () => {
        navigator.clipboard.writeText(block.textContent).then(() => {
          btn.innerHTML = checkIcon;

          btn.classList.add('copied');
          btn.removeEventListener('click', copy);

          setTimeout(() => {
            btn.innerHTML = copyIcon;
            btn.classList.remove('copied');
            btn.addEventListener('click', copy);
          }, 2000);
        });
      };
      btn.addEventListener('click', copy);

      wrapper.appendChild(block.cloneNode(true));
      wrapper.appendChild(btn);

      block.replaceWith(wrapper);
    });
  };
  addCopyBtns();
}
