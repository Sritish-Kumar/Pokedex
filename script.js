const species_url = "https://pokeapi.co/api/v2/pokemon-species/";
const url = "https://pokeapi.co/api/v2/pokemon/";

// DOM
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const imgDiv = document.querySelector(".container");
const upDiv = document.getElementById("up");
const downDown = document.getElementById("down");
const nameCard = document.querySelector(".name");
const statsCard = document.querySelector(".value");
const statNameCard = document.querySelector(".label");

let current = 0;
let evo_current = 0;
let Pname = "";
let species_data;
let pokemon_data;
let loadedPokemon = [];
let evolution_pokemon = [];
let types = [];
let stats = [];

// Evolutions of the pokemon
async function getEvolution(url) {
  evolution_pokemon = [];
  const response = await fetch(url);
  if (!response.ok) {
    console.log("Error Fetching Evolution Data");
    return;
  }

  const data = await response.json();
  let current_evolution = data.chain.evolves_to;

  while (current_evolution.length > 0) {
    let evolution = current_evolution[0]; // the evolution object
    evolution_pokemon.push(evolution.species.name);

    current_evolution = evolution.evolves_to;
  }
}

function setStats() {
  types = [];
  stats = [];
  // text data
  let type_data = pokemon_data.types;
  for (let i = 0; i < type_data.length; i++) {
    types.push(type_data[i].type.name);
  }

  stats = pokemon_data.stats;

  console.log(types);
  console.log(stats);
  console.log(Pname);
}

async function getSpecies(index) {
  // Pokemon-species
  const response = await fetch(species_url + index);
  if (!response.ok) {
    console.log("Error Fetching Species Data from POKEAPI");
    return;
  }
  species_data = await response.json();
  // console.log(species_data.name);

  if (!species_data.evolves_from_species) {
    // distinct pokemon
    const response2 = await fetch(url + index);
    if (!response2.ok) {
      console.log("Error Fetching Pokemon Data from POKEAPI");
      return;
    }

    pokemon_data = await response2.json();

    Pname = species_data.name;

    // all the current pokemon
    loadedPokemon.push(index);
    console.log(current + " : " + Pname);
    console.log(loadedPokemon);

    setStats();
  } else {
    return getSpecies(++current);
  }
}

// Load Image on the screen
function loadImage(data) {
  // clear div container
  imgDiv.innerHTML = "";

  let imgUrl = data["sprites"]["other"]["official-artwork"].front_default;
  let imgTag = document.createElement("img");
  imgTag.setAttribute("src", imgUrl);
  imgTag.setAttribute("id", "pokemon");

  imgDiv.appendChild(imgTag);

  // Text Details

  let spanEle = document.createElement("span");
  spanEle.setAttribute("id", "pokemon_type");

  for (let i = 0; i < types.length; i++) {
    let pELe = document.createElement("p");
    pELe.setAttribute("class", "type");
    pELe.innerHTML = types[i];
    spanEle.appendChild(pELe);
  }

  let pELe = document.createElement("p");
  pELe.setAttribute("id", "pokemon_name");
  pELe.innerHTML = Pname;

  nameCard.innerHTML = "";
  nameCard.appendChild(pELe);
  nameCard.appendChild(spanEle);

  // Stats Load

  statNameCard.innerHTML = `          <p class="description">HP :</p>
          <p class="description">Attack :</p>
          <p class="description">Defense :</p>
          <p class="description">Speed :</p>`;

  statsCard.innerHTML = "";
  for (let i = 0; i < stats.length; i++) {
    if (i === 3 || i === 4) {
      continue;
    }
    const p1 = document.createElement("p");
    p1.setAttribute("class", "number");
    p1.innerHTML = stats[i].base_stat;
    statsCard.appendChild(p1);
  }
}

// Event Listeners
nextBtn.addEventListener("click", async () => {
  evo_current = 0;
  // types = [];
  // stats = [];
  await getSpecies(++current);
  await getEvolution(species_data.evolution_chain.url);

  console.log(evolution_pokemon);
  loadImage(pokemon_data);
});

prevBtn.addEventListener("click", async () => {
  evo_current = 0;
  // types = [];
  // stats = [];
  if (loadedPokemon.length > 1) {
    loadedPokemon.pop();
    current = loadedPokemon.pop();
    await getSpecies(current);

    await getEvolution(species_data.evolution_chain.url);
    console.log(evolution_pokemon);
    loadImage(pokemon_data);
  } else {
    // Reset Everything
    current = 0;
    loadedPokemon = [];
    evolution_pokemon = [];
    imgDiv.innerHTML = "";
    nameCard.innerHTML = "";
    statNameCard.innerHTML = "";
    statsCard.innerHTML = "";

    console.log(current);
    console.log(loadedPokemon);
  }
});

upDiv.addEventListener("click", async () => {
  if (evolution_pokemon.length > 0 && evo_current < evolution_pokemon.length) {
    // console.log("Evolution: " + evolution_pokemon[evo_current++]);
    let evoName = evolution_pokemon[evo_current];
    console.log("Evo: " + evo_current + " : " + evolution_pokemon[evo_current]);

    let response = await fetch(url + evolution_pokemon[evo_current++]);
    if (!response.ok) {
      console.log("Error loading the Evolution Data");
    }

    pokemon_data = await response.json();

    setStats();
    Pname = evoName;
    loadImage(pokemon_data);
  }
  if (evo_current == evolution_pokemon.length) {
    evo_current--;
  }
});

downDown.addEventListener("click", async () => {
  if (evo_current > 0 && evolution_pokemon.length > 0) {
    let response = await fetch(url + evolution_pokemon[--evo_current]);

    pokemon_data = await response.json();

    console.log("Evo: " + evo_current + " : " + evolution_pokemon[evo_current]);

    setStats();
    Pname = evolution_pokemon[evo_current];
    loadImage(pokemon_data);
  } else if (evo_current == 0) {
    let response2 = await fetch(url + current);
    pokemon_data = await response2.json();
    Pname = pokemon_data.name;
    console.log(current + " : " + Pname);
    console.log(loadedPokemon);
    setStats();
    loadImage(pokemon_data);
  }
});
