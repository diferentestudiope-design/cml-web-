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
  select("#descripcion").textContent = project.description;
  select("#direccion-zona").textContent = project.location + " · Dirección ficticia";
  const facts = [
    ["Ubicación referencial", project.location],
    ["Dormitorios", project.rooms],
    ["Área desde", project.area + " m²"],
    ["Precio desde", "S/ " + project.price],
  ];
  for (const [label, value] of facts) {
    const fact = document.createElement("div");
    const term = document.createElement("dt");
    const detail = document.createElement("dd");
    term.textContent = label;
    detail.textContent = value;
    fact.append(term, detail);
    select("#datos").append(fact);
  }

  select("#imprimir").addEventListener("click", () => window.print());
  setupProjectGallery(project);

  const planSelect = select("#tipo-plano");
  for (const typology of typologies) {
    planSelect.add(new Option(typology.rooms + " · " + typology.area + " m²", typology.id));
    if (typology.id !== project.id) select("#relacionados").append(createProjectCard(typology));
  }
  planSelect.value = project.id;

  function renderPlan() {
    const typology = typologies.find(({ id }) => id === planSelect.value);
    const bedrooms = Number.parseInt(typology.rooms, 10);
    const rooms = ["Sala comedor", "Cocina", "Baño", ...Array.from({ length: bedrooms }, (_, index) => "Dormitorio " + (index + 1))];
    const plan = select("#plano");
    plan.replaceChildren(...rooms.map((name) => {
      const room = document.createElement("span");
      room.textContent = name;
      return room;
    }));
  }

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
    interiores: [["interior.jpg", "Sala y comedor"]],
    exteriores: [[project.image, "Fachada"], ["terraza.jpg", "Terraza"]],
  };
  const filters = [...document.querySelectorAll("[data-gallery]")];
  const thumbs = document.querySelector("#miniaturas");
  const image = document.querySelector("#galeria-imagen");
  const caption = document.querySelector("#galeria-texto");
  const previous = document.querySelector(".gallery-prev");
  const next = document.querySelector(".gallery-next");
  let category = "interiores";
  let index = 0;

  function showImage(nextIndex) {
    const images = gallery[category];
    index = (nextIndex + images.length) % images.length;
    const [file, label] = images[index];
    image.src = "./assets/" + file;
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
