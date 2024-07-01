const body = document.body;
let superHeros = [];
let favSuperHero = [];

fetch(`https://gateway.marvel.com/v1/public/characters?ts=1&apikey=${API_KEY}&hash=${HASH}`).then (resp => {
        return resp.json();
    }).then(resp => {

        // Load favorites from localStorage
        function loadFavorites() {
            const storedFavorites = localStorage.getItem('favSuperHero');
            if (storedFavorites) {
                favSuperHero = JSON.parse(storedFavorites);
            updateFavorites();
            }
        }
        
        // Save favorites to localStorage
        function saveFavorites() {
            localStorage.setItem('favSuperHero', JSON.stringify(favSuperHero));
        }

        //create div to place the search bar, heros list and favorite heros list.
        const divContainer = document.createElement("div");
        divContainer.className = "div-container";
        body.appendChild(divContainer);

        //Search bar
        const searchBar = document.createElement("div");
        searchBar.className = "search-bar";
        const searchBarInput = document.createElement("input");
        searchBarInput.type = "text";
        searchBarInput.setAttribute("id", "search-bar-input");
        searchBarInput.placeholder = "Search for a super hero...";

        searchBarInput.addEventListener('input', (e) => {
            showSuggestions(e.target.value);
        });

        searchBar.appendChild(searchBarInput);
        divContainer.appendChild(searchBar);

        //Complete superhero list
        const superHerolist = document.createElement("ul");
        superHerolist.style.listStyle = "none"
        superHerolist.className = "hero";
        resp.data.results.map((result) => {
            superHeros.push(result.name);
        });
        console.log(superHeros);
        divContainer.appendChild(superHerolist);
        superHeros.map((superHero) => {
            const superHerolistItem = document.createElement("li");
            superHerolistItem.textContent = superHero;
            superHerolist.appendChild(superHerolistItem);

            superHerolistItem.addEventListener("click", ()=>{
                SuperHeroDetails.innerHTML = '';
                showSuperHeroDetails(superHero);
            })
        })

        //Suggestion box
        const suggestions = document.createElement("div");
        suggestions.className = "suggestions"
        suggestions.setAttribute("id", "suggestions");
        searchBar.appendChild(suggestions);

        //Show searchbar suggestions
        function showSuggestions(query) {
            // console.log(query);
            suggestions.innerHTML = '';
            if (query.length === 0) return;
            
            const filteredHeros = superHeros.filter(hero => 
              hero.toLowerCase().includes(query.toLowerCase())
            );
            
            filteredHeros.forEach(hero => {
              const suggestionDiv = document.createElement('div');
              suggestionDiv.textContent = hero;
              suggestionDiv.addEventListener('click', ()=>{
                SuperHeroDetails.innerHTML = '';
                showSuperHeroDetails(hero);
              })
              const favoriteButton = document.createElement('button');
              favoriteButton.className = "favorite-btn"
              favoriteButton.textContent = "Favorite"
              suggestionDiv.appendChild(favoriteButton);
              favoriteButton.addEventListener('click', () => {
                addFavorite(hero);
              });
              suggestions.appendChild(suggestionDiv);
            });
          }

        //Favorite superhero list
        const favSuperHeroHeading = document.createElement("h2");
        favSuperHeroHeading.textContent = "My Favorite Heros";
        divContainer.appendChild(favSuperHeroHeading);
        const favSuperHeroList = document.createElement("ul");
        favSuperHeroList.setAttribute("id", "favorites-list");
        divContainer.appendChild(favSuperHeroList);


        // Function to add hero to favorites
        function addFavorite(hero) {
            if (!favSuperHero.includes(hero)) {
                favSuperHero.push(hero);
                updateFavorites();
                saveFavorites();
            }
        }

        // Function to remove hero from favorites
        function removeFavorite(hero) {
            favSuperHero = favSuperHero.filter(fav => fav !== hero);
            updateFavorites();
            saveFavorites();
        }

        // Function to update favorites list
        function updateFavorites() {
            favSuperHeroList.innerHTML = '';
            favSuperHero.forEach(hero => {
                const li = document.createElement('li');
                li.textContent = hero;

                const removeButton = document.createElement('button');
                removeButton.textContent = 'x';
                removeButton.addEventListener('click', () => {
                    removeFavorite(hero);
                });

                li.appendChild(removeButton);

                li.addEventListener("click", ()=>{
                    SuperHeroDetails.innerHTML = '';
                    showSuperHeroDetails(hero);
                })
                
                favSuperHeroList.appendChild(li);
            });
        }

        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-bar')) {
            suggestions.innerHTML = '';
            searchBarInput.value = '';
            }
        });

        //SuperHero details
        const SuperHeroDetails = document.createElement("div");
        SuperHeroDetails.className = "super-hero-details";
        body.appendChild(SuperHeroDetails);

        function showSuperHeroDetails(superHero){
            // console.log(superHero, '129');
            allDetails = resp.data.results;
            allDetails.map((detail) => {
                if(detail.name == superHero){
                    // console.log("got", superHero);
                    const name = document.createElement('h1');
                    name.textContent = detail.name;
                    SuperHeroDetails.appendChild(name);

                    const photo = document.createElement('img')
                    photo.src = detail.thumbnail.path;
                    photo.alt = "image unavialble"
                    SuperHeroDetails.appendChild(photo);

                    const description = document.createElement('p');
                    description.textContent = detail.description;
                    SuperHeroDetails.appendChild(description);

                    const comics = document.createElement('h4');
                    comics.textContent = `comics: ${detail.comics.available}`;
                    SuperHeroDetails.appendChild(comics);

                    const series = document.createElement('h4');
                    series.textContent = `series: ${detail.series.available}`;
                    SuperHeroDetails.appendChild(series);

                    const stories = document.createElement('h4');
                    stories.textContent = `stories: ${detail.stories.available}`;
                    SuperHeroDetails.appendChild(stories);

                    const events = document.createElement('h4');
                    events.textContent = `events: ${detail.events.available}`;
                    SuperHeroDetails.appendChild(events);
                }
            })
        }

        // Load favorites on page load
        window.addEventListener('load', loadFavorites());
});