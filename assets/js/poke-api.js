const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.stats = pokeDetail.stats.map(stat => {
        const mappedName = mapStatName(stat.stat.name);
        return {
            name: mappedName,
            value: stat.base_stat
        };
    });
    
    function mapStatName(apiStatName) {
        switch (apiStatName) {
            case 'hp':
                return 'HP';
            case 'attack':
                return 'Attack';
            case 'defense':
                return 'Defense';
            case 'special-attack':
                return 'SP. Atk';
            case 'special-defense':
                return 'SP. Def';
            case 'speed':
                return 'Speed';
            default:
                return '';
        }
    }
    
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default
    return pokemon
}


pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}

function getStatColorClass(statName) {
    switch (statName.toLowerCase()) {
        case 'hp':
            return 'hp-color';
        case 'attack':
            return 'attack-color';
        case 'defense':
            return 'defense-color';
        case 'sp. atk':
            return 'sp-atk-color';
        case 'sp. def':
            return 'sp-def-color';
        case 'speed':
            return 'speed-color';
        default:
            return '';
    }
}

