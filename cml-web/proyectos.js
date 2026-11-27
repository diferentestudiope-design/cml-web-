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

function createProjectCard(typology) {
  const card = document.createElement("article");
  card.className = "catalog-card";
  card.innerHTML = `
    <a class="card-button" href="./proyecto.html?tipo=${typology.id}" aria-labelledby="card-title-${typology.id}" aria-describedby="card-data-${typology.id}">
      <span class="card-image"><img src="./assets/${typology.image}" alt="" loading="lazy"><span class="card-overlay" aria-hidden="true">Ver detalles</span></span>
      <span class="card-body">
        <strong class="card-title" id="card-title-${typology.id}">${typology.name}</strong>
        <span class="card-data" id="card-data-${typology.id}">
          <span class="card-status">Torre A</span>
          <span class="card-location">Junto a Mallplaza Trujillo</span>
          <span class="card-stats">
            <span class="card-measures"><span>${typology.rooms}</span><span><b>${typology.area} m²</b></span></span>
            <span class="card-price"><small>Precio</small><b>Consultar</b></span>
          </span>
          <small class="card-note">Área referencial según brochure</small>
        </span>
      </span>
    </a>`;
  return card;
}
