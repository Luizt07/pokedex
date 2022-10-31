const BASE_URL = 'https://pokeapi.co/api/v2/pokemon'

function generatePokemonPromises() {
  return Array(150).fill().map((_, index) => fetch(`${BASE_URL}/${index + 1}`)
    .then(response => response.json()))
}

function generateHTML(pokemons) {
  return pokemons.reduce((accumulator, pokemon) => {
    const types = pokemon.types.map(typeInfo => typeInfo.type.name);
    accumulator += `
    <li class="card ${types[0]}">
    <img class="card-image" alt="${pokemon.name}" src="https://cdn.traction.one/pokedex/pokemon/${pokemon.id}.png" />
      <h2 class="card-title">${pokemon.id}. ${pokemon.name}</h2>
      <p class="card-subtitle">${types.join(' | ')}</p>
    </li>`;
    return accumulator;
  }, '');
}

function insertPokemonsIntoPage(pokemons) {
  const ul = document.querySelector('[data-js="pokedex"]');
  ul.innerHTML = pokemons;
}

function onChange() {
  const inputValue = document.getElementById('search-pokemon').value;
  if (!inputValue || inputValue.length === 0) {
    fetchPokemon();
    return;
  }

  const pokemon = fetch(`${BASE_URL}/${inputValue.toLowerCase()}`).then(response => response.json());
  Promise.resolve(pokemon).then(response => generateHTML([response])).then(insertPokemonsIntoPage);
}


const fetchPokemon = () => {
  const pokemons = generatePokemonPromises();

  Promise.all(pokemons)
    .then(generateHTML)
    .then(insertPokemonsIntoPage)
}

fetchPokemon();
