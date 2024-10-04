const championsGrossSelector = document.getElementById('champion-selection-gross');
const championsList = document.getElementById("champions-list");
const gamePatch = document.getElementById('current-patch');
const searchBar = document.getElementById('search-bar');

function makeToggleable(element) {
    let isCooldown = false;

    element.addEventListener('click', () => {
        if (isCooldown) return;

        element.classList.toggle('unselected');
        championsGrossSelector.value = "selection-champions-custom";
        isCooldown = true;

        setTimeout(() => {
            isCooldown = false;
        }, 500);
    });
}

(async () => {
    const gameVersion = await getGameVersion();
    gamePatch.innerText = gameVersion;

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

        makeToggleable(championDiv);
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

championsGrossSelector.addEventListener('change', (event) => {
    const selectedValue = event.target.value;

    if (selectedValue === "selection-champions-custom") return;

    const champions = championsList.querySelectorAll('div');
    champions.forEach(champion => {
        champion.classList.toggle('unselected', selectedValue === "selection-champions-none");
    });
});
