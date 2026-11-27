const factIcons = {
  location: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  bed: '<path d="M4 13V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7M2 19v2m20-2v2M2 19v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5ZM6 12V9a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v3m2 0V9a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v3"/>',
  area: '<path d="M7 3h12a2 2 0 0 1 2 2v12M3 7v12a2 2 0 0 0 2 2h12M1 7l2-3 2 3m12 12 3 2-3 2M6 15v-4a2 2 0 0 1 4 0v4m0-4a2 2 0 0 1 4 0v4m2-7a1.5 1.5 0 1 1 2.5 1L16 11h3"/>',
};

const previousIds = { compacto: "x01", flexible: "x02", familiar: "x03", "estudio-urbano": "x04", terraza: "x05", duplex: "x06" };
const params = new URLSearchParams(location.search);
const requestedId = params.get("tipo");
const projectId = Object.hasOwn(previousIds, requestedId) ? previousIds[requestedId] : requestedId;
const project = typologies.find(({ id }) => id === projectId);
const residential = currentProjects.find(({ id }) => id === params.get("proyecto") && id !== "torres-del-mall");

if (residential) {
  if (residential.status === "upcoming") renderUpcoming(residential);
  else renderResidential(residential);
} else if (!project) {
  document.querySelector("#ficha").innerHTML = '<section class="wrap project-section"><h1>Ficha no encontrada</h1><a class="text-link" href="./index.html#departamentos">Ver proyectos →</a></section>';
} else {
  renderProject(project);
}

function renderProject(project) {
  const select = (selector) => document.querySelector(selector);
  document.title = project.name + " | Torres del Mall";
  select("#nombre-proyecto").textContent = project.name;
  select("#estado").textContent = projectStatuses.available;
  select("#portada").src = "./assets/torres-del-mall/02.jpg";
  select("#fachada").src = "./assets/torres-del-mall/01.jpg";
  select("#descripcion").textContent =
    "Torres del Mall es un condominio de cuatro torres junto a Mallplaza Trujillo. En la Torre A, la " +
    project.name + " cuenta con " + project.area + " m² referenciales, tres dormitorios, sala-comedor, cocina-lavandería y " +
    (project.bathrooms === 1 ? "un baño." : "dos baños.") +
    " El proyecto incluye un parque interior de 1.482 m², zonas de juego, coworking, terrazas, parrillas y un espacio para mascotas.";
  select("#direccion-zona").textContent = torresDelMall.location;
  const facts = [
    ["Ubicación", "Mallplaza Trujillo", "location"],
    ["Dormitorios", project.rooms, "bed"],
    ["Área", project.area + " m²"],
    ["Baños", String(project.bathrooms)],
    ["Precio", "Consultar", "area"],
  ];
  renderFacts(facts);
  const map = select("#mapa-proyecto");
  map.src = map.dataset.torresSrc;

  setupProjectGallery();

  const planSelect = select("#tipo-plano");
  const plan = select("#plano");
  const planDialog = select("#dialogo-plano");
  for (const typology of typologies) {
    planSelect.add(new Option(typology.name + " · " + typology.area + " m²", typology.id));
  }
  for (const related of currentProjects) {
    if (related.id !== "torres-del-mall") select("#relacionados").append(createProjectCard(related));
  }
  planSelect.value = project.id;

  function renderPlan() {
    const typology = typologies.find(({ id }) => id === planSelect.value);
    const planImage = plan.querySelector("img");
    planImage.src = "./assets/" + typology.plan;
    planImage.alt = "Plano de Torre A, " + typology.name + ", " + typology.area + " m²";
    select("#plano-dormitorios").textContent = typology.rooms;
    select("#plano-banos").textContent = typology.bathrooms === 1 ? "1 baño" : "2 baños";
    select("#plano-area").textContent = typology.area + " m²";
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
}

function renderFacts(facts) {
  const factPanel = document.querySelector("#datos");
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

}

function renderUpcoming(project) {
  document.title = project.name + " | Constructora Moreno Linch";
  document.querySelector("#marca-ficha").textContent = "Constructora Moreno Linch";
  document.querySelector("#nombre-proyecto").textContent = project.name;
  document.querySelector("#estado").textContent = projectStatuses.upcoming;
  document.querySelector("#portada").src = "./assets/" + project.image;
  document.querySelector("#logo-lanzamiento").hidden = false;
  document.querySelector(".project-banner").classList.add("launch-banner");
  for (const selector of ["#datos", "#datos-nota", "#sobre-proyecto", "#galeria", "#cotizar", "#zona"]) {
    document.querySelector(selector).hidden = true;
  }
  for (const related of currentProjects) {
    if (related.status === "available") document.querySelector("#relacionados").append(createProjectCard(related));
  }
}

function renderResidential(project) {
  const select = (selector) => document.querySelector(selector);
  document.title = project.name + " | Constructora Moreno Linch";
  select("#marca-ficha").textContent = "Constructora Moreno Linch";
  select("#nombre-proyecto").textContent = project.name;
  select("#estado").textContent = projectStatuses[project.status];
  select("#portada").src = "./assets/" + project.image;
  select("#fachada").src = "./assets/" + project.image;
  select("#fachada").alt = project.name + " · Imagen referencial";
  select("#descripcion").textContent = project.description;
  select("#datos-nota").hidden = project.status === "sold";
  select("#datos-nota").textContent = "Consulta precio y disponibilidad con ventas.";
  select("#info-venta").textContent = "Imágenes referenciales.";
  select("#direccion-zona").textContent = project.location + ", Trujillo";
  select("#accion-ficha").hidden = project.status === "sold";
  select("#accion-ficha").href = "#contacto-proyecto";
  select("#accion-ficha").textContent = "Contacto comercial ↓";

  const facts = [["Ubicación", project.location, "location"]];
  if (project.rooms) facts.push(["Dormitorios", project.rooms, "bed"], ["Área", project.area, "area"]);
  if (project.status === "available") facts.push(["Precio", "Consultar"]);
  renderFacts(facts);
  select("#datos").classList.add("residential-facts");

  const amenities = select("#amenidades");
  amenities.hidden = !project.amenities;
  if (project.amenities) {
    amenities.setAttribute("aria-label", "Áreas comunes de " + project.name);
    amenities.replaceChildren(...project.amenities.map((name) => {
      const item = document.createElement("li");
      item.textContent = name;
      return item;
    }));
    amenities.classList.add("residential-amenities");
  }
  select("#cotizar").hidden = true;
  select("#contacto-proyecto").hidden = project.status === "sold";
  select("#contacto-proyecto-texto").textContent = project.phone
    ? "Comunícate con el equipo comercial para consultar disponibilidad y precios."
    : "Consulta en la oficina de CML: Calle Juan Julio Ganoza 475, oficina 1701, Urb. California, Trujillo.";
  if (project.phone) {
    const phone = select("#telefono-proyecto");
    phone.href = "tel:+51" + project.phone.replaceAll(" ", "");
    phone.textContent = "Llamar al " + project.phone;
    phone.hidden = false;
  }
  const query = encodeURIComponent(project.name + ", " + project.location + ", Trujillo, Perú");
  const map = select("#mapa-proyecto");
  map.src = "https://maps.google.com/maps?q=" + query + "&output=embed";
  map.title = "Ubicación de " + project.name + " en Trujillo";
  const [google, waze] = document.querySelectorAll("#zona .project-actions a");
  google.href = "https://www.google.com/maps/search/?api=1&query=" + query;
  waze.href = "https://www.waze.com/ul?q=" + query + "&navigate=yes";
  waze.textContent = "Waze ↗";

  for (const related of currentProjects) {
    if (related.id !== project.id) select("#relacionados").append(createProjectCard(related));
  }
  setupProjectGallery([
    [project.image, project.name],
    ["proyectos-cml/" + project.id + "-02.jpg", "Vista del proyecto"],
    ["proyectos-cml/" + project.id + "-03.jpg", "Otra vista del proyecto"],
  ]);
}

function setupProjectGallery(projectImages) {
  const gallery = {
    interiores: [
      ["torres-del-mall/04.jpg", "Sala"],
      ["torres-del-mall/06.jpg", "Coworking"],
      ["torres-del-mall/08.jpg", "Sala de entretenimiento"],
    ],
    exteriores: [
      ["torres-del-mall/01.jpg", "Ingreso al condominio"],
      ["torres-del-mall/02.jpg", "Parque interior"],
      ["torres-del-mall/03.jpg", "Juegos para niños"],
      ["torres-del-mall/09.jpg", "Terraza lounge"],
    ],
  };
  const filters = [...document.querySelectorAll("[data-gallery]")];
  if (projectImages) {
    gallery.interiores = projectImages;
    filters[0].parentElement.hidden = true;
  }
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
    const [file, label] = images[index];
    image.src = "./assets/" + file;
    const [nextFile] = images[(index + 1) % images.length];
    preview.src = "./assets/" + nextFile;
    if (!reducedMotion.matches) image.animate([{ opacity: .5 }, { opacity: 1 }], { duration: 320 });
    image.alt = label + " · Imagen referencial";
    caption.textContent = label;
    [...thumbs.children].forEach((button, i) => button.setAttribute("aria-pressed", String(index === i)));
  }

  function renderCategory() {
    const images = gallery[category];
    filters.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.gallery === category)));
    thumbs.replaceChildren(...images.map(([file, label], i) => {
      const button = document.createElement("button");
      const thumb = document.createElement("img");
      button.type = "button";
      button.setAttribute("aria-label", label);
      thumb.src = "./assets/" + file;
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
