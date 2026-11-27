const contactEmail = "torresdelmall@morenolinch.com";

const interest = document.querySelector("#interes");
const catalog = document.querySelector("#project-catalog");
const projectsMenu = document.querySelector("#menu-actuales");

for (const project of currentProjects) {
  const link = document.createElement("a");
  link.href = project.href;
  link.textContent = project.name;
  projectsMenu.append(link);
}

if (catalog) {
  const limit = Number(catalog.dataset.limit || currentProjects.length);
  for (const project of currentProjects.slice(0, limit)) {
    const card = createProjectCard(project);
    card.dataset.reveal = "";
    catalog.append(card);
  }
}
if (interest) {
  for (const typology of typologies) {
    interest.add(new Option(typology.name + " · " + typology.rooms, typology.id));
  }
}

const header = document.querySelector(".header");
const hero = document.querySelector(".hero");

if (hero) {
  function updateHeader() {
    header.classList.toggle("is-past-hero", hero.getBoundingClientRect().bottom <= header.offsetHeight);
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  window.addEventListener("resize", updateHeader);
  updateHeader();
}

const menu = document.querySelector(".menu");
const nav = document.querySelector("#navegacion");
const projectMenus = [...nav.querySelectorAll(".projects-menu")];

const deliveredMenu = document.querySelector("#menu-entregados");

async function loadDeliveredMenu() {
  if (!deliveredMenu.open || deliveredMenu.querySelector(".delivered-menu-group")) return;
  try {
    let catalogPage = document;
    if (!document.querySelector(".delivered-category")) {
      const response = await fetch("./proyectos-entregados.html");
      if (!response.ok) return;
      catalogPage = new DOMParser().parseFromString(await response.text(), "text/html");
    }

    for (const categoryLink of deliveredMenu.querySelectorAll(":scope > a[href*='#']")) {
      const category = catalogPage.getElementById(categoryLink.hash.slice(1));
      if (!category) continue;
      const group = document.createElement("details");
      group.className = "delivered-menu-group";
      group.name = "delivered-menu-category";
      const summary = document.createElement("summary");
      summary.textContent = categoryLink.textContent;
      const links = document.createElement("div");
      links.className = "delivered-menu-links";
      for (const project of category.querySelectorAll(".delivered-list article")) {
        const link = document.createElement("a");
        link.href = "./proyectos-entregados.html#" + project.id;
        link.textContent = project.querySelector("h3").textContent;
        links.append(link);
      }
      group.append(summary, links);
      categoryLink.replaceWith(group);
    }
  } catch {
    // The category links still work when the catalog cannot be fetched.
  }
}
deliveredMenu.addEventListener("toggle", loadDeliveredMenu);

function closeMenu() {
  menu.setAttribute("aria-expanded", "false");
  for (const dropdown of projectMenus) dropdown.open = false;
}
menu.addEventListener("click", () => {
  if (menu.getAttribute("aria-expanded") === "true") closeMenu();
  else menu.setAttribute("aria-expanded", "true");
});
nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("click", (event) => {
  for (const dropdown of projectMenus) {
    if (!dropdown.contains(event.target)) dropdown.open = false;
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  const openCategory = deliveredMenu.open && deliveredMenu.querySelector(".delivered-menu-group[open]");
  const openDropdown = openCategory || projectMenus.find((dropdown) => dropdown.open);
  if (openDropdown) {
    openDropdown.open = false;
    openDropdown.querySelector("summary").focus();
  } else if (menu.getAttribute("aria-expanded") === "true") {
    closeMenu();
    menu.focus();
  }
});

if (hero) {
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
}

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
if (contactStatus && contactEmail) {
  document.querySelector("#contact-mode").textContent = "Abre tu aplicación de correo para revisar y enviar la consulta.";
  document.querySelector("#contact-submit").textContent = "Abrir correo ↗";
}
document.querySelector("#contact-form")?.addEventListener("submit", (event) => {
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
