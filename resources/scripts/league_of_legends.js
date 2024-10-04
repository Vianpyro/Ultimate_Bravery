const championsList = document.getElementById("champions-list");
const searchBar = document.getElementById('search-bar');

(async () => {
    const gameVersion = await getGameVersion();
    championsList.innerText = `Loading champions for patch ${gameVersion}...`;

    const gameLanguages = await getGameLanguages();

    const championData = await getChampionsData(gameVersion, gameLanguages[0]);
    const champions = Object.values(championData.data);

    championsList.innerText = "";
    champions.forEach(champion => {
        const championDiv = document.createElement("div");
        const championImage = document.createElement("img");

        championImage.src = `${dataDragonUrl}/cdn/${gameVersion}/img/champion/${champion.image.full}`;
        championImage.alt = champion.name;
        championImage.title = champion.name;
        championImage.loading = "lazy";

        championDiv.appendChild(championImage);
        championsList.appendChild(championDiv);
    });
})();

searchBar.addEventListener('input', () => {
    const champions = championsList.querySelectorAll('div');
    const query = searchBar.value.toLowerCase();

    champions.forEach(champion => {
        const altText = champion.querySelector('img').alt.toLowerCase();
        champion.style.display = altText.includes(query) ? 'block' : 'none';
    });
});
