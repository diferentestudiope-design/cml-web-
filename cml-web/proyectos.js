const typologies = [
  { id: "compacto", name: "Compacto", rooms: "1 dormitorio", image: "torre-a.jpg", status: "En construcción", location: "Av. Los Álamos 120", area: 38, maxArea: 46, price: "198,000", description: "Una distribución para quienes buscan independencia y un espacio fácil de organizar." },
  { id: "flexible", name: "Flexible", rooms: "2 dormitorios", image: "torre-b.jpg", status: "En construcción", location: "Jr. Las Moreras 240", area: 57, maxArea: 68, price: "279,000", description: "Un segundo ambiente para compartir, trabajar desde casa o recibir visitas." },
  { id: "familiar", name: "Familiar", rooms: "3 dormitorios", image: "torre-c.jpg", status: "Entrega inmediata", location: "Av. Los Jardines 360", area: 81, maxArea: 96, price: "379,000", description: "Ambientes diferenciados para combinar privacidad y momentos en familia." },
  { id: "estudio-urbano", name: "Estudio Urbano", rooms: "1 dormitorio", image: "hero.jpg", status: "Lanzamiento", location: "Jr. Los Cipreses 185", area: 34, maxArea: 42, price: "179,000", description: "Una distribución compacta con sala y comedor integrados y un dormitorio independiente." },
  { id: "terraza", name: "Terraza", rooms: "2 dormitorios", image: "torre-a.jpg", status: "En construcción", location: "Av. Las Acacias 480", area: 64, maxArea: 76, price: "325,000", description: "Dos dormitorios y un área social conectada con una terraza para disfrutar al aire libre." },
  { id: "duplex", name: "Dúplex", rooms: "3 dormitorios", image: "torre-b.jpg", status: "Lanzamiento", location: "Jr. Los Olivos 295", area: 104, maxArea: 122, price: "489,000", description: "Una distribución de dos niveles que separa las áreas de reunión de los dormitorios." },
];

function createProjectCard(typology) {
  const card = document.createElement("article");
  card.className = "catalog-card";
  card.innerHTML = `
    <a class="card-button" href="./proyecto.html?tipo=${typology.id}" aria-labelledby="card-title-${typology.id}" aria-describedby="card-data-${typology.id}">
      <span class="card-image"><img src="./assets/${typology.image}" alt="" loading="lazy"><span class="card-overlay" aria-hidden="true">Ver detalles</span></span>
      <span class="card-body">
        <strong class="card-title" id="card-title-${typology.id}">${typology.name}</strong>
        <span class="card-data" id="card-data-${typology.id}">
          <span class="card-status">${typology.status}</span>
          <span class="card-location">${typology.location}</span>
          <span class="card-stats">
            <span class="card-measures"><span>${typology.rooms}</span><span>Desde <b>${typology.area} m²</b></span></span>
            <span class="card-price"><small>Desde</small><b>S/ ${typology.price}</b></span>
          </span>
          <small class="card-note">Datos ficticios · No constituyen una oferta</small>
        </span>
      </span>
    </a>`;
  return card;
}
