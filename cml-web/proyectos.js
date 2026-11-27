const torresDelMall = {
  location: "Av. Jesús de Nazareth con Av. América Oeste, Trujillo",
  rooms: "3 dormitorios",
  price: "S/ 240,000",
};

const typologies = [
  { id: "x01", area: "63.90", bathrooms: 2, image: "01" },
  { id: "x02", area: "54.90", bathrooms: 1, image: "02" },
  { id: "x03", area: "64.20", bathrooms: 2, image: "03" },
  { id: "x04", area: "63.50", bathrooms: 2, image: "04" },
  { id: "x05", area: "52.70", bathrooms: 1, image: "09" },
  { id: "x06", area: "63.50", bathrooms: 2, image: "10" },
].map((typology) => ({
  ...typology,
  name: "Tipología " + typology.id.toUpperCase(),
  rooms: torresDelMall.rooms,
  image: "torres-del-mall/" + typology.image + ".jpg",
  plan: "torres-del-mall/" + typology.id + ".jpg",
}));

const projectStatuses = {
  upcoming: "Próximamente en lanzamiento",
  available: "En venta",
  sold: "Vendido",
};

const currentProjects = [
  { id: "iconic", name: "Iconic", status: "upcoming", image: "proyectos-cml/iconic-manta-cml.jpg", href: "./proyecto.html?proyecto=iconic" },
  { id: "live", name: "Live", status: "upcoming", image: "proyectos-cml/live-manta-cml.jpg", href: "./proyecto.html?proyecto=live" },
  { id: "legend", status: "available", price: "US$ 78,000", name: "Legend Residencial", location: "Calle Colombia 114 · Urb. El Recreo", image: "proyectos-cml/legend.jpg", href: "./proyecto.html?proyecto=legend", phone: "959 287 595", description: "Legend Residencial está en la urbanización El Recreo, en el centro de Trujillo. Ofrece departamentos de uno, dos y tres dormitorios. Entre las áreas comunes se incluyen coworking, gimnasio, un salón de usos múltiples, una terraza y zona de parrillas.", amenities: ["Lobby", "Coworking", "Coffee lounge", "Gimnasio", "Salón de usos múltiples", "Terraza", "Zona de parrillas"], rooms: "1, 2 y 3 dormitorios", area: "51.64 a 153.59 m²" },
  { id: "torres-del-mall", status: "available", price: torresDelMall.price, name: "Torres del Mall - Condominio", location: "Junto a Mallplaza Trujillo", image: "torres-del-mall/01.jpg", href: "./proyecto.html?tipo=x01", rooms: "3 dormitorios", area: "52.70 a 64.20 m²" },
  { id: "mam290", status: "available", price: "US$ 105,000", name: "MAM 290 California", location: "Calle Juan Julio Ganoza 475 · Urb. California", image: "proyectos-cml/mam290.jpg", href: "./proyecto.html?proyecto=mam290", phone: "943 412 626", description: "MAM 290 California reúne departamentos y oficinas en la urbanización California, cerca del Parque Grande. Los departamentos tienen uno, dos o tres dormitorios. El proyecto incluye espacios de trabajo, descanso y reunión.", amenities: ["Lobby", "Coworking", "Coffee lounge", "Zona de ocio", "Terraza", "Zona de parrillas"], rooms: "1, 2 y 3 dormitorios", area: "56.05 a 120.97 m²" },
  { id: "infinity", status: "sold", name: "Infinity Apartments", location: "Av. Las Palmas con Calle Las Capullanas · Urb. El Golf", image: "proyectos-cml/infinity.jpg", href: "./proyecto.html?proyecto=infinity", description: "Infinity Apartments está en la urbanización El Golf de Trujillo, en la esquina de la avenida Las Palmas con la calle Las Capullanas." },
];

function createProjectCard(project) {
  const card = document.createElement("article");
  card.className = "catalog-card";
  const upcoming = project.status === "upcoming";
  const measures = project.rooms
    ? `<span class="card-measures"><span>${project.rooms}</span><b>${project.area}</b></span>`
    : '<span class="card-measures">Consulta características</span>';
  card.innerHTML = `
    <a class="card-button" data-status="${project.status}" href="${project.href}" aria-labelledby="card-title-${project.id}" aria-describedby="card-data-${project.id}">
      <span class="card-image"><img src="./assets/${project.image}" alt="${upcoming ? "Edificio cubierto con una manta de Constructora Moreno Linch" : ""}" loading="lazy">${upcoming ? "" : '<span class="card-overlay" aria-hidden="true">Ver proyecto</span>'}</span>
      <span class="card-body">
        <strong class="card-title" id="card-title-${project.id}">${project.name}</strong>
        <span class="card-data" id="card-data-${project.id}">
          <span class="card-status">${projectStatuses[project.status]}</span>
          ${project.location ? `<span class="card-location">${project.location}</span>` : ""}
          ${project.status === "available" ? `
            <span class="card-stats">
              ${measures}
              <span class="card-price"><small>Desde</small><b>${project.price}</b></span>
            </span>` : ""}
        </span>
      </span>
    </a>`;
  return card;
}
