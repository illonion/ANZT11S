const dataURL = "http://127.0.0.1:24050/ANZT11S/data";
let teamsData;
let beatmapsData;
let beatmapArray;
let modData;

async function fetchData(endpoint) {
    const response = await fetch(`${dataURL}/${endpoint}.json`);
    if (response.ok) return await response.json();
    else if (response.status === 404) return null;
    else throw new Error(`Failed to fetch data from ${endpoint}`);
}

async function loadData() {
    try {
        teamsData = await fetchData('teams');
        beatmapsData = await fetchData('beatmaps');
        modData = await fetchData('modOrder');
    } catch (error) {
        console.error(error.message);
    }
}

async function sortBeatmaps() {
    if (!beatmapsData || !modData) return;

    beatmapArray = modData.map(mod => {
        // Filter beatmaps by mod
        const filteredBeatmaps = beatmapsData.filter(beatmap => beatmap.mod.toLowerCase() === mod.toLowerCase());
    
        // Sort the filtered beatmaps by the "order" attribute
        const sortedBeatmaps = filteredBeatmaps.sort((a, b) => a.order - b.order);
    
        return sortedBeatmaps;
    });
}

async function init() {
    await loadData();
    await sortBeatmaps();
}

// Returning promises from functions
const getAllTeams = async () => {
    await init();
    return teamsData;
};

const getAllMaps = async () => {
    await init();
    return beatmapArray;
};