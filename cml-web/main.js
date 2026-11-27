const contactEmail = ""; // Correo comercial oficial, cuando esté disponible.

const typologies = [
  { id: "compacto", name: "Compacto", rooms: "1 dormitorio", image: "torre-a.jpg", description: "Una distribución para quienes buscan independencia y un espacio fácil de organizar." },
  { id: "flexible", name: "Flexible", rooms: "2 dormitorios", image: "torre-b.jpg", description: "Un segundo ambiente para compartir, trabajar desde casa o recibir visitas." },
  { id: "familiar", name: "Familiar", rooms: "3 dormitorios", image: "torre-c.jpg", description: "Ambientes diferenciados para combinar privacidad y momentos en familia." },
];

const dialog = document.querySelector("#project-dialog");
const interest = document.querySelector("#interes");
const catalog = document.querySelector("#typologies");
let selectedTypology;

for (const typology of typologies) {
  const card = document.createElement("article");
  card.className = "catalog-card";
  card.dataset.reveal = "";
  card.innerHTML = `
    <button class="card-button" type="button" aria-label="Ver detalles de ${typology.name}, ${typology.rooms}" aria-haspopup="dialog">
      <span class="card-image"><img src="./assets/${typology.image}" alt="" loading="lazy"><span class="card-overlay" aria-hidden="true">Ver detalles</span></span>
      <span class="card-body">
        <span><small>${typology.rooms}</small><strong>${typology.name}</strong></span>
        <span class="card-arrow" aria-hidden="true">↗</span>
      </span>
    </button>`;
  card.querySelector("button").addEventListener("click", () => {
    selectedTypology = typology;
    document.querySelector("#dialog-title").textContent = typology.name;
    document.querySelector("#dialog-description").textContent = typology.description;
    document.querySelector("#dialog-image").src = "./assets/" + typology.image;
    dialog.showModal();
  });
  catalog.append(card);
  interest.add(new Option(typology.name + " · " + typology.rooms, typology.id));
}

document.querySelector("#dialog-contact").addEventListener("click", () => {
  interest.value = selectedTypology.id;
  dialog.close();
  document.querySelector("#nombre").focus();
});
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

const header = document.querySelector(".header");
const hero = document.querySelector(".hero");

function updateHeader() {
  header.classList.toggle("is-past-hero", hero.getBoundingClientRect().bottom <= header.offsetHeight);
}

window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("resize", updateHeader);
updateHeader();

const menu = document.querySelector(".menu");
const nav = document.querySelector("#navegacion");
function closeMenu() {
  menu.setAttribute("aria-expanded", "false");
}
menu.addEventListener("click", () => {
  menu.setAttribute("aria-expanded", String(menu.getAttribute("aria-expanded") === "false"));
});
nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") {
    closeMenu();
    menu.focus();
  }
});

const slideButtons = [...document.querySelectorAll(".slide-controls button[aria-pressed]")];
const slides = [...document.querySelectorAll(".hero-image")];
const heroTitle = document.querySelector("#hero-title");
const heroTitleLead = heroTitle.querySelector("span");
const heroTitleEnding = heroTitle.querySelector("em");
const heroDescription = document.querySelector(".hero-actions p");
const playback = document.querySelector(".slide-playback");
const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
let currentSlide = 0;
let slideTimer;
let playing = false;
let hovered = false;

function showSlide(index) {
  if (index === currentSlide) return;
  currentSlide = index;
  const { title, ending, description } = slides[index].dataset;
  heroTitleLead.textContent = title;
  heroTitleEnding.textContent = ending;
  heroDescription.textContent = description;
  if (!motionPreference.matches) {
    for (const element of [heroTitle, heroDescription]) {
      element.animate([{ opacity: .25, translate: "0 10px" }, { opacity: 1, translate: "0 0" }], {
        duration: 650,
        easing: "ease-out",
      });
    }
  }
  slides.forEach((slide, slideIndex) => slide.classList.toggle("active", slideIndex === index));
  slideButtons.forEach((control, controlIndex) => control.setAttribute("aria-pressed", String(controlIndex === index)));
}

function syncSlideTimer() {
  clearInterval(slideTimer);
  if (playing && !hovered) {
    slideTimer = setInterval(() => showSlide((currentSlide + 1) % slides.length), 6000);
  }
}

function setPlayback(enabled) {
  playing = enabled;
  syncSlideTimer();
  playback.textContent = playing ? "Ⅱ" : "▶";
  playback.setAttribute("aria-label", playing ? "Pausar carrusel" : "Reproducir carrusel");
}

function syncMotionPreference() {
  playback.hidden = motionPreference.matches;
  setPlayback(!motionPreference.matches);
}

slideButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    setPlayback(false);
    showSlide(index);
  });
});
playback.addEventListener("click", () => setPlayback(!playing));
for (const eventName of ["pointerenter", "pointerleave"]) {
  hero.addEventListener(eventName, (event) => {
    if (event.pointerType !== "mouse") return;
    hovered = eventName === "pointerenter";
    syncSlideTimer();
  });
}
motionPreference.addEventListener("change", syncMotionPreference);
syncMotionPreference();

if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.1 });
  document.querySelectorAll("[data-reveal]").forEach((element) => {
    element.classList.add("reveal-pending");
    observer.observe(element);
  });
}

const contactStatus = document.querySelector("#contact-status");
if (contactEmail) {
  document.querySelector("#contact-mode").textContent = "Abre tu aplicación de correo para revisar y enviar la consulta.";
  document.querySelector("#contact-submit").textContent = "Abrir correo ↗";
}
document.querySelector("#contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = new FormData(event.currentTarget);
  const name = fields.get("nombre").trim();
  if (!name) {
    document.querySelector("#nombre").focus();
    contactStatus.textContent = "Escribe tu nombre para preparar la consulta.";
    return;
  }
  const body = [
    "Consulta para Torres del Mall",
    "Nombre: " + name,
    "Correo: " + fields.get("correo"),
    "Interés: " + interest.selectedOptions[0].text,
    "",
    fields.get("mensaje").trim(),
  ].join("\n");
  if (contactEmail) {
    location.href = `mailto:${contactEmail}?subject=${encodeURIComponent("Consulta · Torres del Mall")}&body=${encodeURIComponent(body)}`;
    contactStatus.textContent = "Revisa la consulta en tu aplicación de correo.";
    return;
  }
  const url = URL.createObjectURL(new Blob([body], { type: "text/plain;charset=utf-8" }));
  const download = document.createElement("a");
  download.href = url;
  download.download = "consulta-torres-del-mall.txt";
  document.body.append(download);
  download.click();
  download.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  contactStatus.textContent = "Consulta preparada para descargar.";
});
