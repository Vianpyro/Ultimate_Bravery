const dataDragonUrl = "https://ddragon.leagueoflegends.com";

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
};

async function getItemsData(version, language) {
    const response = await fetch(`${dataDragonUrl}/cdn/${version}/data/${language}/item.json`);
    return response.json();
};
