document.addEventListener("DOMContentLoaded", function () {
    const pokemonList = document.getElementById("pokemonList");
    const pokemonDetailsContainer = document.getElementById("pokemonDetails");
    const loadMoreButton = document.getElementById("loadMoreButton");
    const mainTitle = document.getElementById("mainTitle");

    let offset = 0;
    let limit = 10;
    let pokemons = [];

    function loadPokemonItems(offset, limit) {
        pokeApi.getPokemons(offset, limit).then((newPokemons = []) => {
            const newHtml = newPokemons.map((pokemon) => `
                <li class="pokemon ${pokemon.type}" id="${pokemon.number}">
                    <span class="number">${pokemon.number}</span>
                    <span class="name">${pokemon.name}</span>
                    <div class="detail">
                        <ol class="types">
                            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                        </ol>
                        <img src="${pokemon.photo}" alt="${pokemon.name}">
                    </div>
                </li>
            `).join('');
            pokemonList.innerHTML += newHtml;

            // Adiciona os novos pokémons à lista existente
            pokemons = pokemons.concat(newPokemons);

            // Chama a função para adicionar eventos de clique após a lista estar carregada
            addClickEventsToPokemons(pokemons);
        });
    }

    function addClickEventsToPokemons(pokemons) {
        pokemons.forEach((pokemon) => {
            const pokemonElement = document.getElementById(pokemon.number);

            if (pokemonElement) {
                pokemonElement.addEventListener('click', () => {
                    showPokemonDetails(pokemon);
                });
            }
        });
    }

    function showPokemonDetails(pokemon) {

        // Esconde a lista de Pokémons, o título "Pokedex" e o botão "Load More"
        pokemonList.style.display = 'none'; 
        mainTitle.style.display = 'none';
        loadMoreButton.style.display = 'none';

        // Exibe a div pokemonDetailsContainer
        pokemonDetailsContainer.style.display = 'flex';

        // Preenche os detalhes do Pokémon no contêiner correspondente
        const detailsHtml = `
        <div id="pokemonDetails" style="display: flex; height: 100vh; flex-direction: column; width: 100%; position: relative;">
            <div class="pokemon-details-item-container" style="flex: 1;">
                <li class="pokemon-details-item ${pokemon.type}">
                    <button class="pokemon-details-button" id="backButton" type="button" img src"">Voltar</button>
                    <div class="number">${pokemon.number}</div>
                    <div class="name">${pokemon.name}</div>
                    <div class="detail">
                        <ol class="types">
                            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                        </ol>
                    </div>
                </li>
            </div>
            <div id="pokemonStatsContainer" class="stats-container">
                <ol class="stats">
                    <ul>
                        ${pokemon.stats.map(stat => `
                            <li class="${getStatColorClass(stat.name)}">
                                <div class="info">
                                    <span class="stat-value">${stat.name}</span>
                                </div>
                                <div class="value">
                                    <span class="stat-value">${stat.value}</span>
                                </div>
                                <div class="progress-bar-container">
                                    <div class="progress-bar" style="width: ${stat.value}%"></div>
                                </div>
                            </li>
                        `).join('')}
                    </ul>
                </ol>
            </div>
            <div class="statsTitle-container">Pokémon Stats</div>
            <div class="overlapping-image">
                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </div>    
        `;
        pokemonDetailsContainer.innerHTML = detailsHtml;

        // Mostra a div pokemonDetailsContainer
        pokemonDetailsContainer.style.display = 'block';
        pokemonDetailsContainer.style.height = '100vh';
        
        // Adiciona uma classe para indicar que os detalhes estão visíveis
        document.querySelector('.content').classList.add('details-visible');

        // Adiciona um evento de clique ao botão de volta
        const backButton = document.getElementById("backButton");
        backButton.addEventListener('click', hidePokemonDetails);
    }
    
    function hidePokemonDetails() {
        // Mostra a lista de Pokémon
        pokemonList.style.display = 'grid';
    
        // Mostra o título principal e o botão "Load More"
        mainTitle.style.display = 'block';
        loadMoreButton.style.display = 'block';
    
        // Esconde a div pokemonDetailsContainer
        pokemonDetailsContainer.style.display = 'none';
    
        // Reseta o tamanho da imagem dentro dos detalhes do Pokémon
        const pokemonDetailImages = document.querySelectorAll('.pokemon .detail img');
        pokemonDetailImages.forEach(image => {
            image.style.height = '70px'; // Ou qualquer valor apropriado
        });
    
        // Remove a classe para indicar que os detalhes não estão mais visíveis
        document.querySelector('.content').classList.remove('details-visible');
    }
    

    loadPokemonItems(offset, limit);

    loadMoreButton.addEventListener('click', () => {
        offset += limit
        loadPokemonItems(offset, limit)
        
    })
});
