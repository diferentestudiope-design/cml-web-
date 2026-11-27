const typologies = [
  { id: "compacto", name: "Compacto", rooms: "1 dormitorio", image: "torre-a.jpg", status: "En construcción", location: "Av. Los Álamos 120", area: 38, price: "198,000", description: "Una distribución para quienes buscan independencia y un espacio fácil de organizar." },
  { id: "flexible", name: "Flexible", rooms: "2 dormitorios", image: "torre-b.jpg", status: "En construcción", location: "Jr. Las Moreras 240", area: 57, price: "279,000", description: "Un segundo ambiente para compartir, trabajar desde casa o recibir visitas." },
  { id: "familiar", name: "Familiar", rooms: "3 dormitorios", image: "torre-c.jpg", status: "Entrega inmediata", location: "Av. Los Jardines 360", area: 81, price: "379,000", description: "Ambientes diferenciados para combinar privacidad y momentos en familia." },
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

const pointerPreference = matchMedia("(any-hover: hover) and (any-pointer: fine) and (prefers-reduced-motion: no-preference)");
const customPointer = document.createElement("div");
customPointer.className = "cml-pointer";
customPointer.setAttribute("aria-hidden", "true");
customPointer.hidden = true;
document.body.append(customPointer);

function hideCustomPointer() {
  customPointer.hidden = true;
}

document.addEventListener("pointermove", (event) => {
  if (!pointerPreference.matches || event.pointerType !== "mouse" ||
      !(event.target instanceof Element) ||
      event.target.closest("input, textarea, select, [contenteditable], dialog")) {
    hideCustomPointer();
    return;
  }

  customPointer.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
  customPointer.hidden = false;
});
document.documentElement.addEventListener("pointerleave", hideCustomPointer);
window.addEventListener("blur", hideCustomPointer);
document.addEventListener("keydown", hideCustomPointer);
pointerPreference.addEventListener("change", hideCustomPointer);
