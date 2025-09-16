// src/front/utils/imageResolver.js

// Mapa de imágenes por nombre (puedes ampliarlo con más personajes/planetas/vehículos)
const NAME_IMAGE_MAP = {
  people: {
    "Luke Skywalker":
      "https://static.wikia.nocookie.net/starwars/images/1/17/LukeSkywalker-Insider217.png/revision/latest/scale-to-width-down/1200?cb=20240130192944",
    "Leia Organa":
      "https://static.wikia.nocookie.net/starwars/images/4/4a/LeiaOrgana-Insider202.png/revision/latest/scale-to-width-down/1200?cb=20211210170536",
    "Darth Vader":
      "https://static.wikia.nocookie.net/starwars/images/6/6f/DarthVader-Insider143.png/revision/latest/scale-to-width-down/1200?cb=20200608211607",
  },
  planets: {
    // "Tatooine": "https://static.wikia.nocookie.net/starwars/images/3/3a/Tatooine_TPM.png",
  },
  vehicles: {
    // "X-wing": "https://static.wikia.nocookie.net/starwars/images/f/f1/Xwing-SWB.png",
  },
};

// Carpetas de Visual Guide por tipo (fallback si no hay en NAME_IMAGE_MAP)
const FOLDERS = {
  people: "characters",
  planets: "planets",
  vehicles: "vehicles",
};

// Normaliza el nombre para buscar en el mapa
function normalizeName(name) {
  return (name || "").trim();
}

/**
 * Devuelve la mejor URL disponible:
 * 1) Imagen de Fandom (NAME_IMAGE_MAP)
 * 2) VisualGuide por id
 * 3) Placeholder local
 */
export function getImageUrl(type, id, name) {
  const t = type || "people";
  const n = normalizeName(name);

  // 1. Buscar en el mapa por nombre
  const byName = NAME_IMAGE_MAP?.[t]?.[n];
  if (byName) return byName;

  // 2. Visual Guide por ID
  const folder = FOLDERS[t] || "characters";
  if (id !== undefined && id !== null) {
    return `https://starwars-visualguide.com/assets/img/${folder}/${id}.jpg`;
  }

  // 3. Fallback local
  return getFallbackImage();
}

/** Imagen de fallback */
export function getFallbackImage() {
  return "/placeholder.jpg"; // asegúrate de tener public/placeholder.jpg
}
