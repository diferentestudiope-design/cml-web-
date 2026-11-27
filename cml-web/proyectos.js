const torresDelMall = {
  location: "Av. Jesús de Nazareth con Av. América Oeste, Trujillo",
  brochure: "https://www.morenolinch.com/images/proyectos/brochure-torres-del-mall-cml-2026.pdf",
  rooms: "3 dormitorios",
};

const typologies = [
  { id: "x01", area: "63.90", bathrooms: 2, page: 27, image: "01" },
  { id: "x02", area: "54.90", bathrooms: 1, page: 27, image: "02" },
  { id: "x03", area: "64.20", bathrooms: 2, page: 28, image: "03" },
  { id: "x04", area: "63.50", bathrooms: 2, page: 28, image: "04" },
  { id: "x05", area: "52.70", bathrooms: 1, page: 29, image: "09" },
  { id: "x06", area: "63.50", bathrooms: 2, page: 29, image: "10" },
].map((typology) => ({
  ...typology,
  name: "Tipología " + typology.id.toUpperCase(),
  rooms: torresDelMall.rooms,
  image: "torres-del-mall/" + typology.image + ".jpg",
  plan: "torres-del-mall/" + typology.id + ".jpg",
}));

const currentProjects = [
  { id: "legend", name: "Legend Residencial", location: "Calle Colombia 114 · Urb. El Recreo", image: "proyectos-cml/legend.jpg", href: "https://www.morenolinch.com/residencial_legend.html", rooms: "1, 2 y 3 dormitorios", area: "51.64 a 153.59 m²" },
  { id: "torres-del-mall", name: "Torres del Mall - Condominio", location: "Junto a Mallplaza Trujillo", image: "torres-del-mall/01.jpg", href: "./proyecto.html?tipo=x01", rooms: "3 dormitorios", area: "52.70 a 64.20 m²" },
  { id: "mam290", name: "MAM 290 California", location: "Calle Juan Julio Ganoza 475 · Urb. California", image: "proyectos-cml/mam290.jpg", href: "https://www.morenolinch.com/mam290_home_and_office.html", rooms: "1, 2 y 3 dormitorios", area: "56.05 a 120.97 m²" },
  { id: "infinity", name: "Infinity Apartments", location: "Av. Las Palmas con Calle Las Capullanas · Urb. El Golf", image: "proyectos-cml/infinity.jpg", href: "https://www.morenolinch.com/infinity_apartments.html" },
];

function createProjectCard(project) {
  const card = document.createElement("article");
  card.className = "catalog-card";
  const measures = project.rooms
    ? `<span class="card-measures"><span>${project.rooms}</span><b>${project.area}</b></span>`
    : '<span class="card-measures">Consulta características</span>';
  card.innerHTML = `
    <a class="card-button" href="${project.href}" aria-labelledby="card-title-${project.id}" aria-describedby="card-data-${project.id}">
      <span class="card-image"><img src="./assets/${project.image}" alt="" loading="lazy"><span class="card-overlay" aria-hidden="true">Ver proyecto</span></span>
      <span class="card-body">
        <strong class="card-title" id="card-title-${project.id}">${project.name}</strong>
        <span class="card-data" id="card-data-${project.id}">
          <span class="card-status">Proyecto actual</span>
          <span class="card-location">${project.location}</span>
          <span class="card-stats">
            ${measures}
            <span class="card-price"><small>Precio</small><b>Consultar</b></span>
          </span>
        </span>
      </span>
    </a>`;
  return card;
}
