const fonts = [
  "Ubuntu",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Inter",
  "Nunito",
  "Raleway",
  "Oswald",
  "Merriweather",
  "Playfair Display",
  "Source Sans 3",
  "Rubik",
  "DM Sans",
  "Work Sans",
  "Fira Sans",
  "PT Sans",
  "Noto Sans",
  "Quicksand",
  "Bebas Neue",
  "Cabin",
  "Manrope",
  "Outfit",
  "Karla",
  "Mulish",
  "Barlow",
  "Josefin Sans",
  "Inconsolata",
  "Dancing Script",
];

const fontGrid = document.getElementById("fontGrid");
const searchInput = document.getElementById("fontSearch");
const snackbar = document.getElementById("snackbar");
const template = document.getElementById("fontCardTemplate");

let snackbarTimer;

function toFamilyParam(fontName) {
  return fontName.trim().replace(/\s+/g, "+");
}

function makeFontUrl(fontName) {
  return `https://fonts.googleapis.com/css2?family=${toFamilyParam(fontName)}`;
}

function ensureFontStylesheet(fontName) {
  const id = `font-link-${toFamilyParam(fontName)}`;
  if (document.getElementById(id)) return;

  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `${makeFontUrl(fontName)}&display=swap`;
  document.head.appendChild(link);
}

function createRipple(event, button) {
  const oldRipple = button.querySelector(".ripple");
  if (oldRipple) oldRipple.remove();

  const circle = document.createElement("span");
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  circle.classList.add("ripple");
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - (button.getBoundingClientRect().left + radius)}px`;
  circle.style.top = `${event.clientY - (button.getBoundingClientRect().top + radius)}px`;

  button.appendChild(circle);
}

function showSnackbar() {
  snackbar.classList.add("show");
  clearTimeout(snackbarTimer);
  snackbarTimer = setTimeout(() => {
    snackbar.classList.remove("show");
  }, 2000);
}

async function copyImport(fontName) {
  const cssImport = `@import url('${makeFontUrl(fontName)}');`;
  await navigator.clipboard.writeText(cssImport);
  showSnackbar();
}

function createCard(fontName, index) {
  ensureFontStylesheet(fontName);

  const node = template.content.firstElementChild.cloneNode(true);
  node.style.animationDelay = `${Math.min(index * 35, 420)}ms`;

  const fontNameEl = node.querySelector(".font-name");
  const previewEl = node.querySelector(".font-preview");
  const fontUrlEl = node.querySelector(".font-url");
  const copyBtn = node.querySelector(".copy-btn");

  fontNameEl.textContent = fontName;
  previewEl.style.fontFamily = `'${fontName}', sans-serif`;
  fontUrlEl.textContent = makeFontUrl(fontName);

  copyBtn.addEventListener("click", async (event) => {
    createRipple(event, copyBtn);
    try {
      await copyImport(fontName);
    } catch {
      showSnackbar();
    }
  });

  return node;
}

function render(list) {
  fontGrid.innerHTML = "";
  const fragment = document.createDocumentFragment();
  list.forEach((fontName, index) => {
    fragment.appendChild(createCard(fontName, index));
  });
  fontGrid.appendChild(fragment);
}

function filterFonts(value) {
  const term = value.trim().toLowerCase();
  if (!term) return fonts;
  return fonts.filter((font) => font.toLowerCase().includes(term));
}

searchInput.addEventListener("input", (e) => {
  render(filterFonts(e.target.value));
});

render(fonts);
