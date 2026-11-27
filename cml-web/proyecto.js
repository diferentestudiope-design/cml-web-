const factIcons = {
  location: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  bed: '<path d="M4 13V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7M2 19v2m20-2v2M2 19v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5ZM6 12V9a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v3m2 0V9a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v3"/>',
  area: '<path d="M7 3h12a2 2 0 0 1 2 2v12M3 7v12a2 2 0 0 0 2 2h12M1 7l2-3 2 3m12 12 3 2-3 2M6 15v-4a2 2 0 0 1 4 0v4m0-4a2 2 0 0 1 4 0v4m2-7a1.5 1.5 0 1 1 2.5 1L16 11h3"/>',
};

const projectId = new URLSearchParams(location.search).get("tipo");
const project = typologies.find(({ id }) => id === projectId);

if (!project) {
  document.querySelector("#ficha").innerHTML = '<section class="wrap project-section"><h1>Ficha no encontrada</h1><a class="text-link" href="./index.html#departamentos">Ver departamentos →</a></section>';
} else {
  renderProject(project);
}

function renderProject(project) {
  const select = (selector) => document.querySelector(selector);
  document.title = project.name + " | Torres del Mall";
  select("#nombre-proyecto").textContent = project.name;
  select("#portada").src = "./assets/" + project.image;
  select("#fachada").src = "./assets/" + project.image;
  select("#estado").textContent = project.status + " · Referencial";
  select("#descripcion").textContent =
    "Torres del Mall presenta la tipología " + project.name + ", una propuesta residencial de " +
    project.rooms + " con áreas referenciales de " + project.area + " a " + project.maxArea + " m². " +
    project.description + " La ubicación de ejemplo es " + project.location +
    ". Las áreas comunes ilustran espacios para trabajar, leer y compartir. " +
    "Explora la galería y compara las distribuciones.";
  select("#direccion-zona").textContent = project.location + " · Dirección ficticia";
  const facts = [
    ["Ubicación", project.location, "location"],
    ["Dormitorios", project.rooms, "bed"],
    ["Desde", project.area + " m²"],
    ["Hasta", project.maxArea + " m²"],
    ["Precio desde", "S/ " + project.price, "area"],
  ];
  const factPanel = select("#datos");
  for (const [label, value, icon] of facts) {
    const fact = document.createElement("div");
    fact.className = "project-fact";
    const term = document.createElement("dt");
    const detail = document.createElement("dd");
    term.textContent = label;
    detail.textContent = value;
    fact.append(term, detail);
    if (icon) {
      fact.classList.add("has-fact-icon");
      term.insertAdjacentHTML("afterbegin", `<svg class="fact-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${factIcons[icon]}</svg>`);
    }
    factPanel.append(fact);
  }

  select("#imprimir").addEventListener("click", () => window.print());
  setupProjectGallery(project);

  const planSelect = select("#tipo-plano");
  const planOptions = select("#plan-opciones");
  const plan = select("#plano");
  const planDialog = select("#dialogo-plano");
  for (const typology of typologies) {
    planSelect.add(new Option(typology.name + " · " + typology.area + " m²", typology.id));
  }
  for (const rooms of new Set(typologies.map(({ rooms }) => rooms))) {
    const shortcut = document.createElement("button");
    shortcut.type = "button";
    shortcut.value = rooms;
    shortcut.textContent = Number.parseInt(rooms, 10);
    shortcut.setAttribute("aria-label", rooms);
    shortcut.addEventListener("click", () => {
      if (shortcut.getAttribute("aria-pressed") === "true") return;
      const match = project.rooms === rooms ? project : typologies.find((typology) => typology.rooms === rooms);
      planSelect.value = match.id;
      renderPlan();
    });
    planOptions.append(shortcut);
  }
  const projectIndex = typologies.indexOf(project);
  for (const offset of [1, 2]) {
    select("#relacionados").append(createProjectCard(typologies[(projectIndex + offset) % typologies.length]));
  }
  planSelect.value = project.id;

  function renderPlan() {
    const typology = typologies.find(({ id }) => id === planSelect.value);
    const bedrooms = Number.parseInt(typology.rooms, 10);
    const bathrooms = bedrooms === 3 ? 2 : 1;
    select("#plano-dormitorios").textContent = typology.rooms;
    select("#plano-banos").textContent = bathrooms === 1 ? "1 baño" : "2 baños";
    select("#plano-area").textContent = typology.area + " m²";
    for (const shortcut of planOptions.children) {
      shortcut.setAttribute("aria-pressed", String(shortcut.value === typology.rooms));
    }
  }

  select("#ampliar-plano").addEventListener("click", () => {
    const enlarged = plan.cloneNode(true);
    enlarged.removeAttribute("id");
    select("#plano-ampliado").replaceChildren(enlarged);
    planDialog.showModal();
  });
  planSelect.addEventListener("change", renderPlan);
  renderPlan();
  select("#consulta-proyecto").addEventListener("submit", (event) => {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const text = [
      "Consulta referencial · Torres del Mall",
      "Ficha: " + project.name,
      "Distribución: " + planSelect.selectedOptions[0].text,
      "Nombre: " + fields.get("nombre") + " " + fields.get("apellido"),
      "Correo: " + fields.get("correo"),
      "Celular: " + fields.get("celular"),
      "Mensaje: " + fields.get("mensaje"),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const download = document.createElement("a");
    download.href = url;
    download.download = "consulta-" + project.id + ".txt";
    document.body.append(download);
    download.click();
    download.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    select("#consulta-estado").textContent = "Consulta descargada. Los datos no se enviaron.";
  });
  setupProjectZone();
}

function setupProjectGallery(project) {
  const gallery = {
    interiores: [
      ["interior.jpg", "Sala y comedor"],
      ["interior.jpg", "Detalle de la sala", "85% 70%"],
      ["interior.jpg", "Detalle del ventanal", "65% 35%"],
    ],
    exteriores: [[project.image, "Fachada"], ["terraza.jpg", "Terraza"], [project.image === "hero.jpg" ? "torre-c.jpg" : "hero.jpg", "Conjunto residencial"]],
  };
  const filters = [...document.querySelectorAll("[data-gallery]")];
  const thumbs = document.querySelector("#miniaturas");
  const image = document.querySelector("#galeria-imagen");
  const caption = document.querySelector("#galeria-texto");
  const preview = document.querySelector("#galeria-siguiente");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const previous = document.querySelector(".gallery-prev");
  const next = document.querySelector(".gallery-next");
  let category = "interiores";
  let index = 0;

  function showImage(nextIndex) {
    const images = gallery[category];
    index = (nextIndex + images.length) % images.length;
    const [file, label, origin] = images[index];
    setGalleryImage(image, file, origin);
    const [nextFile, , nextOrigin] = images[(index + 1) % images.length];
    setGalleryImage(preview, nextFile, nextOrigin);
    if (!reducedMotion.matches) image.animate([{ opacity: .5 }, { opacity: 1 }], { duration: 320 });
    image.alt = label + " · Imagen referencial";
    caption.textContent = label;
    [...thumbs.children].forEach((button, i) => button.setAttribute("aria-pressed", String(index === i)));
  }

  function setGalleryImage(target, file, origin) {
    target.src = "./assets/" + file;
    target.style.transformOrigin = origin || "";
    target.classList.toggle("gallery-detail", Boolean(origin));
  }

  function renderCategory() {
    const images = gallery[category];
    filters.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.gallery === category)));
    thumbs.replaceChildren(...images.map(([file, label, origin], i) => {
      const button = document.createElement("button");
      const thumb = document.createElement("img");
      button.type = "button";
      button.setAttribute("aria-label", label);
      setGalleryImage(thumb, file, origin);
      thumb.alt = "";
      button.append(thumb);
      button.addEventListener("click", () => showImage(i));
      return button;
    }));
    previous.hidden = next.hidden = images.length < 2;
    showImage(0);
  }

  filters.forEach((button) => button.addEventListener("click", () => {
    category = button.dataset.gallery;
    renderCategory();
  }));
  previous.addEventListener("click", () => showImage(index - 1));
  next.addEventListener("click", () => showImage(index + 1));
  renderCategory();
}

function setupProjectZone() {
  const filters = document.querySelector("#zona-filtros");
  const points = document.querySelector("#zona-puntos");
  const categories = ["General", "Comercios", "Estudios", "Restaurantes"];
  for (const category of categories) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "pill";
    button.textContent = category;
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => {
      [...filters.children].forEach((control) => control.setAttribute("aria-pressed", String(control === button)));
      const visible = category === "General" ? categories.slice(1) : [category];
      points.replaceChildren(...visible.map((label) => {
        const pin = document.createElement("span");
        pin.className = "zone-point";
        pin.textContent = label;
        return pin;
      }));
    });
    filters.append(button);
  }
  filters.firstElementChild.click();
}
