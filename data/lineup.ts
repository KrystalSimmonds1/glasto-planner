export const genres = [
  "R&B / Soul", "Hip-hop / Rap", "Dance / Electronic", "Indie / Rock",
  "Pop", "Jazz / Funk", "Global", "Folk / Country", "Alternative / Experimental",
] as const;

export type Genre = (typeof genres)[number];
export type Priority = "must" | "want" | "maybe";
export type Selections = Record<string, Priority>;

export type Artist = {
  id: string;
  name: string;
  genres: Genre[];
  primaryGenre: Genre;
  stage?: string;
  day?: string;
  startTime?: string;
  endTime?: string;
};

const [soul, rap, dance, rock, pop, jazz, global, folk, alt] = genres;
// IDs are permanent, including when an artist's billing changes.
const lineup: [string, string, Genre, ...Genre[]][] = [
  ["sam-fender", "Sam Fender", rock],
  ["harry-styles", "Harry Styles", pop],
  ["billie-eilish", "Billie Eilish", pop, alt],
  ["cher", "Cher", pop],
  ["massive-attack", "Massive Attack", alt, dance],
  ["sombr", "sombr", pop, rock],
  ["little-simz", "Little Simz", rap],
  ["chase-status", "Chase & Status", dance],
  ["the-xx", "The xx", rock, alt],
  ["lily-allen", "Lily Allen", pop],
  ["ezra-collective", "Ezra Collective", jazz],
  ["kraftwerk", "Kraftwerk", dance, alt],
  ["adela", "Adéla", pop, dance],
  ["angine-de-poitrine", "Angine de Poitrine", alt, rock],
  ["atarashii-gakko", "ATARASHII GAKKO!", global, pop],
  ["the-avalanches", "The Avalanches", dance, alt],
  ["basement-jaxx", "Basement Jaxx", dance],
  ["blood-orange", "Blood Orange", soul, alt],
  ["bonobo", "Bonobo", dance],
  ["christine-and-the-queens", "Christine and the Queens", pop, alt],
  ["chvrches", "CHVRCHES", pop, dance],
  ["confidence-man", "Confidence Man", dance, pop],
  ["crowded-house", "Crowded House", rock, pop],
  ["de-la-soul", "De La Soul", rap],
  ["dinosaur-jr", "Dinosaur Jr.", rock],
  ["ecca-vandal", "Ecca Vandal", alt, rock],
  ["ellie-goulding", "Ellie Goulding", pop, dance],
  ["fat-freddys-drop", "Fat Freddy's Drop", global, soul],
  ["fka-twigs", "FKA twigs", alt, soul],
  ["flo", "FLO", soul, pop],
  ["florence-road", "Florence Road", rock],
  ["getdown-services", "Getdown Services", rock, dance],
  ["hot-chip", "Hot Chip", dance, pop],
  ["jamie-t", "Jamie T", rock, rap],
  ["josh-baker-kettama-prospa", "Josh Baker B2B KETTAMA B2B PROSPA", dance],
  ["kacey-musgraves", "Kacey Musgraves", folk, pop],
  ["keo", "KEO", rock],
  ["kingfishr", "Kingfishr", folk, rock],
  ["king-gizzard", "King Gizzard & the Lizard Wizard", rock, alt],
  ["leon-bridges", "Leon Bridges", soul],
  ["lianne-la-havas", "Lianne La Havas", soul, folk],
  ["lola-young", "Lola Young", pop, soul],
  ["mike-d-50", "MIKE D 50", rap],
  ["moonchild-sanelly", "Moonchild Sanelly", global, dance],
  ["nao", "NAO", soul],
  ["nia-archives", "Nia Archives", dance],
  ["primal-scream", "Primal Scream", rock, dance],
  ["robyn", "Robyn", pop, dance],
  ["saint-etienne", "Saint Etienne", pop, dance],
  ["sammy-virji", "Sammy Virji", dance],
  ["sienna-spiro", "Sienna Spiro", pop, soul],
  ["skye-newman", "Skye Newman", soul, pop],
  ["thee-sacred-souls", "Thee Sacred Souls", soul],
  ["the-streets", "The Streets", rap, dance],
  ["teddy-swims", "Teddy Swims", soul, pop],
  ["texas", "Texas", rock, pop],
  ["thundercat", "Thundercat", jazz, soul],
  ["tinariwen", "Tinariwen", global, rock],
  ["underscores", "underscores", alt, pop],
  ["underworld", "Underworld", dance],
  ["the-war-on-drugs", "The War on Drugs", rock],
  ["westside-cowboy", "Westside Cowboy", rock, folk],
  ["the-womack-sisters", "The Womack Sisters", soul],
  ["wunderhorse", "Wunderhorse", rock],
  ["young-fathers", "Young Fathers", alt, rap],
];

export const artists: Artist[] = lineup.map(([id, name, primaryGenre, ...additionalGenres]) => ({
  id, name, primaryGenre, genres: [primaryGenre, ...additionalGenres],
}));

export const artistIds = new Set(artists.map(({ id }) => id));

const normalize = (value: string) => value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

export function filterArtists(query: string, genre: Genre | "All") {
  const search = normalize(query.trim());
  return artists.filter((artist) =>
    (genre === "All" || artist.genres.includes(genre)) && normalize(artist.name).includes(search),
  );
}
