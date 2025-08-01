// Tipagem para as estatísticas de poder
export interface Powerstats {
  intelligence: string;
  strength: string;
  speed: string;
  durability: string;
  power: string;
  combat: string;
}

// Tipagem para a biografia do herói
export interface Biography {
  "full-name": string;
  "alter-egos": string;
  aliases: string[];
  "place-of-birth": string;
  "first-appearance": string;
  publisher: string;
  alignment: string;
}

// Tipagem para a aparência do herói
export interface Appearance {
  genero: string;
  velocidade: string;
  altura: string[];
  peso: string[];
  "cor-olho": string;
  "cor-cabelo": string;
}

// Tipagem para a imagem do herói
export interface Image {
  url: string;
}

// Tipagem principal para o super-herói


export interface Superhero {
  id: string;
  name: string;
  powerstats: {
    intelligence: string;
    strength: string;
    speed: string;
    durability: string;
    power: string;
    combat: string;
  };
  biography: {
    "full-name": string;
    "alter-egos": string;
    aliases: string[];
    "place-of-birth": string;
    "first-appearance": string;
    publisher: string;
    alignment: string;
  };
  appearance: {
    genero: string;
    velocidade: string;
    height: string[];
    weight: string[];
    "eye-color": string;
    "hair-color": string;
  };

  work?: {
    occupation: string;
    base: string;
  };
  connections?: {
    "group-affiliation": string;
    relatives: string;
  };
  image: {
    url: string;
  };
}

// Tipagem para a resposta de busca da API
export interface SuperheroSearchResponse {
  response: "success" | "error";
  "results-for": string;
  results: Superhero[];
}

// Tipagem para a resposta de detalhes de um herói
export interface SuperheroDetailResponse {
  response: "success" | "error";
  id: string;
  name: string;
  powerstats: Powerstats;
  biography: Biography;
  appearance: Appearance;
  connections: any;
  image: Image;
}


export interface FilterState {
  searchTerm: string;
  sortBy: "name" | "intelligence" | "strength" | "speed" | "durability" | "power" | "combat";
  sortOrder: "asc" | "desc";
  showFavoritesOnly: boolean;
}