const dataDragonUrl = "https://ddragon.leagueoflegends.com";
const roles = ['Toplane', 'Jungle', 'Midlane', 'Bottom', 'Support'];

const championsGrossSelector = document.getElementById('champion-selection-gross');
const championsList = document.getElementById("champions-list");
const gamePatch = document.getElementById('current-patch');
const generateBuildButton = document.getElementById('generate-build');
const resultChampionImage = document.getElementById('result-champion-image');
const resultChampionName = document.getElementById('result-champion-name');
const resultRoleImage = document.getElementById('result-role-image');
const resultRoleName = document.getElementById('result-role-name');
const searchBar = document.getElementById('search-bar');

async function getGameVersion() {
    const response = await fetch(`${dataDragonUrl}/api/versions.json`);
    const version = await response.json();
    return version?.[0];
}

async function getGameLanguages() {
    const response = await fetch(`${dataDragonUrl}/cdn/languages.json`);
    return response.json();
}

async function getChampionsData(version, language) {
    const response = await fetch(`${dataDragonUrl}/cdn/${version}/data/${language}/champion.json`);
    return response.json();
}

async function getChampionDetails(version, language, championId) {
    const response = await fetch(`${dataDragonUrl}/cdn/${version}/data/${language}/champion/${championId}.json`);
    return response.json();
}

async function getItemsData(version, language) {
    const response = await fetch(`${dataDragonUrl}/cdn/${version}/data/${language}/item.json`);
    return response.json();
};


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

        // Add the champion ID to the div
        championDiv.id = champion.id;

        championDiv.appendChild(championImage);
        championsList.appendChild(championDiv);

        makeToggleable(championDiv);
    });

    generateBuildButton.addEventListener('click', async () => {
        // Set the cursor to loading
        document.body.style.cursor = 'wait';

        const selectedChampions = championsList.querySelectorAll('div:not(.unselected)');

        if (selectedChampions.length === 0) {
            alert('Please select at least one champion.');
            return;
        }

        // Select the position of the champion and display it
        const selectedPosition = Math.floor(Math.random() * 5);
        resultRoleImage.src = `/resources/images/roles/${roles[selectedPosition].toLowerCase()}.png`;
        resultRoleImage.alt = roles[selectedPosition];
        resultRoleImage.title = roles[selectedPosition];
        resultRoleName.innerText = roles[selectedPosition];

        // Select a random champion
        const randomChampion = selectedChampions[Math.floor(Math.random() * selectedChampions.length)];

        // Get the champion details
        const championDetailsData = await getChampionDetails(gameVersion, gameLanguages[0], randomChampion.id);
        const championDetails = Object.values(championDetailsData.data)[0];

        // Fill the document with the champion details
        resultChampionImage.src = `${dataDragonUrl}/cdn/${gameVersion}/img/champion/${championDetails.image.full}`;
        resultChampionImage.alt = championDetails.name;
        resultChampionImage.title = championDetails.name;
        resultChampionName.innerText = championDetails.name;

        // Reset the cursor
        document.body.style.cursor = 'default';
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
