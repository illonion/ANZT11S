let teamData
async function accessTeamData() { teamData = await getAllTeams() }
accessTeamData().then(() => teamData = teamData)

// Loading data into the mappool page
let mappoolData
const mappool = document.getElementById("mappool")
async function accessData() { mappoolData = await getAllMaps() }
accessData().then(() => {
    for (let i = 0; i < mappoolData.length; i++) {
        const modRow = mappoolData[i]
        const modRowCounter = modRow.length === 6 || modRow.length === 7 ? 2 : 1
        const modRowSections = modRowCounter === 1 ? [modRow] : modRow.length === 6? [modRow.slice(0, 3), modRow.slice(3)] : [modRow.slice(0, 4), modRow.slice(4)]

        for (let modRowIndex = 0; modRowIndex < modRowCounter; modRowIndex++) {
            const currentSection = modRowSections[modRowIndex];

            // Make row
            const newModRow = document.createElement("div")
            newModRow.classList.add("modRow");
            newModRow.setAttribute("id", `${currentSection[0].mod}${modRowIndex + 1}`);
            const newFragment = document.createDocumentFragment();
            
            for (let j = 0; j < currentSection.length; j++) {
                const currentMap = currentSection[j];
                // Mappool Map
                const newMappoolMap = document.createElement("div")
                newMappoolMap.classList.add("mappoolMap")
                newMappoolMap.style.backgroundImage = `url("${currentMap.imgURL}")`
                newMappoolMap.addEventListener("click", mapClickEvent)
                newMappoolMap.setAttribute("id", currentMap.beatmapID)
            
                // Mappool Map Layer
                const mappoolMapLayer = document.createElement("div")
                mappoolMapLayer.classList.add("mappoolMapLayer")

                // Ranked Status
                const rankedStatusImage = document.createElement("img")
                const rankedStatusText = document.createElement("div")
                rankedStatusImage.classList.add("rankedStatusImage")
                rankedStatusText.classList.add("rankedStatusText")
                switch (currentMap.rankStatus) {
                    case 1:
                        rankedStatusImage.setAttribute("src", "static/mapStatusImages/ranked.png")
                        rankedStatusText.innerText = "Ranked"
                        rankedStatusText.style.color = "#B0E5FF"
                        break
                    case 2: case 3:
                        rankedStatusImage.setAttribute("src", "static/mapStatusImages/approved.png")
                        if (currentMap.rankStatus == 2) rankedStatusText.innerText = "Approved"
                        else rankedStatusText.innerText = "Qualified"
                        rankedStatusText.style.color = "darkseagreen"
                        break
                    case 4: 
                        rankedStatusImage.setAttribute("src", "static/mapStatusImages/loved.png")
                        rankedStatusText.innerText = "Loved"
                        rankedStatusText.style.color = "#FF69B4"
                        break
                    default:
                        rankedStatusImage.setAttribute("src", "static/mapStatusImages/graveyard.png")
                        rankedStatusText.style.color = "#C8C8C8"
                        if (currentMap.rankStatus == 0) rankedStatusText.innerText = "Pending"
                        else if (currentMap.rankStatus == -1) rankedStatusText.innerText = "WIP"
                        else if (currentMap.rankStatus == -2) rankedStatusText.innerText = "Graveyard"
                }

                // Map Mod
                const mappoolMapMod = document.createElement("div")
                mappoolMapMod.classList.add("mappoolMapMod")
                mappoolMapMod.innerText = currentMap.mod.toUpperCase() + currentMap.order
                switch (currentMap.mod) {
                    case "nm": 
                        mappoolMapMod.style.backgroundColor = "rgb(92,138,227)"
                        break
                    case "hd":
                        mappoolMapMod.style.backgroundColor = "rgb(227,178,50)"
                        break
                    case "hr":
                        mappoolMapMod.style.backgroundColor = "rgb(255,64,64)"
                        break
                    case "dt":
                        mappoolMapMod.style.backgroundColor = "rgb(147,128,255)"
                        break
                    case "tb":
                        mappoolMapMod.style.backgroundColor = "rgb(27,158,112)"
                        break
                }

                // Difficulty
                const mappoolMapDifficulty = document.createElement("div")
                mappoolMapDifficulty.classList.add("mappoolMapDifficulty")
                mappoolMapDifficulty.classList.add("mappoolMapMainText")
                mappoolMapDifficulty.innerText = currentMap.difficultyname

                // Name
                const mappoolMapSongName = document.createElement("div")
                mappoolMapSongName.classList.add("mappoolMapSongName")
                mappoolMapSongName.classList.add("mappoolMapMainText")
                mappoolMapSongName.innerText = currentMap.songName

                // Map Stats Container
                const mappoolMapStatsContainer = document.createElement("section")
                mappoolMapStatsContainer.classList.add("mappoolMapBottomArea")
                mappoolMapStatsContainer.classList.add("mappoolMapStatsContainer")

                // Map Stats Left
                const mappoolMapStatsLeft = document.createElement("div")
                mappoolMapStatsLeft.classList.add("mappoolMapStatsLeft")

                // Stats individual - normal
                const mappoolMapStatsOD = document.createElement("div")
                const mappoolMapStatsCS = document.createElement("div")
                const mappoolMapStatsAR = document.createElement("div")
                const mappoolMapStatsBPM = document.createElement("div")
                mappoolMapStatsOD.classList.add("mappoolMapStats")
                mappoolMapStatsCS.classList.add("mappoolMapStats")
                mappoolMapStatsAR.classList.add("mappoolMapStats")
                mappoolMapStatsBPM.classList.add("mappoolMapStats")
                mappoolMapStatsOD.innerText = `OD ${Math.round(parseFloat(currentMap.od) * 10) / 10}`
                mappoolMapStatsCS.innerText = `CS ${Math.round(parseFloat(currentMap.cs) * 10) / 10}`
                mappoolMapStatsAR.innerText = `AR ${Math.round(parseFloat(currentMap.ar) * 10) / 10}`
                mappoolMapStatsBPM.innerText = `BPM ${Math.round(parseFloat(currentMap.bpm) * 10) / 10}`
                // Stats individual - star
                const mappoolMapStatsSR = document.createElement("div")
                mappoolMapStatsSR.classList.add("mappoolMapStatsSR")
                const starRating = `${Math.round(parseFloat(currentMap.difficultyrating) * 100) / 100}`
                mappoolMapStatsSR.innerText = starRating

                // Section - Pick / Ban
                const mappoolPickBanSection = document.createElement("div")
                mappoolPickBanSection.classList.add("mappoolMapBottomArea")
                mappoolPickBanSection.classList.add("mappoolMapStatsContainer")
                mappoolPickBanSection.style.opacity = 0

                // Mappool Pick Ban Protect Text
                const mappoolMapPickBanLeftText = document.createElement("div")
                mappoolMapPickBanLeftText.classList.add("mappoolMapPickBanLeftText")
                // Mappool Pick Ban Protect Action
                const mappoolMapPickBanAction = document.createElement("span")
                mappoolMapPickBanAction.classList.add("mappoolMapPickBanAction")
                // Mappool Pick Ban Protect Team 
                const mappoolMapPickBanTeam = document.createElement("span")
                mappoolMapPickBanTeam.classList.add("mappoolMapPickBanTeam")
                // Mappool Pick Ban Protect Image
                const mappoolMapPickBanImage = document.createElement("img")
                // Mappool Pick Ban Protect Star Rating
                const mappoolMapPickBanStarRating = document.createElement("div")
                mappoolMapPickBanStarRating.classList.add("mappoolMapStatsSR")
                mappoolMapPickBanStarRating.innerText = starRating
                mappoolMapPickBanStarRating.style.opacity = 0
    
                mappoolMapPickBanLeftText.append(mappoolMapPickBanAction, " by ", mappoolMapPickBanTeam)
                mappoolPickBanSection.append(mappoolMapPickBanLeftText, mappoolMapPickBanImage, mappoolMapPickBanStarRating)
                mappoolMapStatsLeft.append(mappoolMapStatsOD, mappoolMapStatsCS, mappoolMapStatsAR, mappoolMapStatsBPM)
                mappoolMapStatsContainer.append(mappoolMapStatsLeft, mappoolMapStatsSR)
                newMappoolMap.append(mappoolMapLayer, rankedStatusImage, rankedStatusText, mappoolMapMod, mappoolMapDifficulty, mappoolMapSongName, mappoolMapStatsContainer, mappoolPickBanSection)
                newFragment.append(newMappoolMap)
            }

            newModRow.append(newFragment)
            mappool.append(newModRow)
        }
    }

    // Setting the mappool sides
    const calculateHeights = (prefix) =>  `${124 * Array.from(mappool.children).filter(child => child.id.includes(prefix)).length}px`
    const NMHeight = calculateHeights('nm')
    const HDHeight = calculateHeights('hd')
    const HRHeight = calculateHeights('hr')
    const DTHeight = calculateHeights('dt')

    // Setting mappool side heights
    function setMappoolSideHeights(element, heights) {
        for (let i = 0; i < element.children.length; i++) {
            element.children[i].style.height = heights[i]
        }
    }

    const mappoolSide1 = document.getElementById("mappoolSide1")
    const mappoolSide2 = document.getElementById("mappoolSide2")

    setMappoolSideHeights(mappoolSide1, [NMHeight, HDHeight, HRHeight, DTHeight, "124px"]);
    setMappoolSideHeights(mappoolSide2, [NMHeight, HDHeight, HRHeight, DTHeight, "124px"]);
})

// Map Click Event
const currentActionTeam = document.getElementById("currentActionTeam")
const currentAction = document.getElementById("currentAction")
const navBarRemoveAction = document.getElementById("navBarRemoveAction")
let currentRemoveAction = false
function mapClickEvent() {
    const pickBanProtectSection = this.lastChild

    // Check for if the action is being removed instead
    if (currentRemoveAction) {
        pickBanProtectSection.style.opacity = 0
        removeActionReset()
        return
    }
    // Remove Action Reset
    removeActionReset()

    // Get current action
    const mapClickTeam = currentActionTeam.innerText
    const mapClickAction = currentAction.innerText

    // Pick Ban section
    pickBanProtectSection.style.opacity = 1;

    // Check team
    const currentTeam = (mapClickTeam === "RED") ? currentTeamNameRed : (mapClickTeam === "BLUE") ? currentTeamNameBlue : ""
    pickBanProtectSection.classList.toggle("bluePickBanProtectBackground", mapClickTeam === "BLUE")
    pickBanProtectSection.classList.toggle("redPickBanProtectBackground", mapClickTeam === "RED")

    // Check action
    const pickBanProtectSectionLeftText = pickBanProtectSection.firstChild
    const pickBanProtectSectionImage = pickBanProtectSection.children[1]
    const pickBanProtectSectionStar = pickBanProtectSection.lastChild

    // Set texts and opacities
    pickBanProtectSectionLeftText.firstChild.innerText = getActionText(mapClickAction)
    pickBanProtectSectionLeftText.lastChild.innerText = currentTeam
    pickBanProtectSectionImage.style.opacity = (mapClickAction === "PROTECT") ? 0 : 1;
    pickBanProtectSectionStar.style.opacity = (mapClickAction === "PROTECT") ? 1 : 0;

    // Set images
    if (mapClickAction === "BAN" || mapClickAction === "PICK") {
        const imageSrc = `static/pickStatusImages/${mapClickTeam.toLowerCase()}${mapClickAction === "BAN" ? 'cross' : 'check'}.svg`;
        pickBanProtectSectionImage.setAttribute("src", imageSrc);
        pickBanProtectSectionImage.classList.toggle("nowPlayingMapBanImage", mapClickAction === "BAN");
        pickBanProtectSectionImage.classList.toggle("nowPlayingMapPickImage", mapClickAction === "PICK");
    }

    // Change colour
    currentActionTeam.innerText = (mapClickTeam === "RED") ? "BLUE" : "RED";
    currentActionTeam.classList.toggle("currentActionTeamRed", mapClickTeam === "BLUE");
    currentActionTeam.classList.toggle("currentActionTeamBlue", mapClickTeam === "RED");

    document.cookie = `currentPicker=${mapClickTeam.toLowerCase()}; path=/`
}
function getActionText(action) {
    const actionTextMap = {
        "PROTECT": "Protected",
        "BAN": "Banned",
        "PICK": "Picked"
    };
    return actionTextMap[action] || "";
}
// Remove Action
function removeAction() {
    currentRemoveAction = true
    navBarRemoveAction.style.color = "black"
    navBarRemoveAction.style.backgroundColor = "white"
    navBarRemoveAction.setAttribute("onclick", "removeActionReset()")
}
function removeActionReset() {
    currentRemoveAction = false
    navBarRemoveAction.style.color = "white"
    navBarRemoveAction.style.backgroundColor = "transparent"
    navBarRemoveAction.setAttribute("onclick", "removeAction()")
}
// Reset Pick Ban Protect
function resetPickBanProtect() {
    const mappoolMaps = document.getElementsByClassName("mappoolMap")
    for (let i = 0; i < mappoolMaps.length; i++) mappoolMaps[i].lastChild.style.opacity = 0
    removeActionReset()
}

// Socket Events
// Credits: VictimCrasher - https://github.com/VictimCrasher/static/tree/master/WaveTournament
const socket = new ReconnectingWebSocket("ws://" + location.host + "/ws");
socket.onopen = () => { console.log("Successfully Connected"); };
socket.onclose = event => { console.log("Socket Closed Connection: ", event); socket.send("Client Closed!"); };
socket.onerror = error => { console.log("Socket Error: ", error); };

// Team Names
const redTeamName = document.getElementById("redTeamName")
const blueTeamName = document.getElementById("blueTeamName")
let currentTeamNameRed
let currentTeamNameBlue

// Team profile pictures
const player1ProfilePicture = document.getElementById("player1ProfilePicture")
const player2ProfilePicture = document.getElementById("player2ProfilePicture")
const player3ProfilePicture = document.getElementById("player3ProfilePicture")
const player4ProfilePicture = document.getElementById("player4ProfilePicture")
const profilePicturesRed = [player1ProfilePicture, player2ProfilePicture]
const profilePicturesBlue = [player3ProfilePicture, player4ProfilePicture]
let player1ID
let player2ID 
let player3ID
let player4ID

// Now Playing
let nowPlayingID

// Chat 
const chatDisplay = document.getElementById("chatDisplay")
const chatDisplayLeft = document.getElementById("chatDisplayLeft")
let chatLen = 0

socket.onmessage = event => {
    const data = JSON.parse(event.data)
    console.log(data)

    // Update Team Name
    function updateTeamName(currentTeamName, newTeamName, teamNameElement, profilePictures) {
        let foundTeamName = false
        for (let i = 0; i < teamData.length; i++) {
            if (teamData[i].teamName == currentTeamName) {
                foundTeamName = true
                profilePictures[0].setAttribute("src", `https://a.ppy.sh/${teamData[i].player1ID}`)
                profilePictures[1].setAttribute("src", `https://a.ppy.sh/${teamData[i].player2ID}`)
                break
            }
        }
        // Team name not found
        if (!foundTeamName) {
            profilePictures[0].style.opacity = "0"
            profilePictures[1].style.opacity = "0"
        } else {
            profilePictures[0].style.opacity = "1"
            profilePictures[1].style.opacity = "1"
        }

        if (currentTeamName === newTeamName) return currentTeamName
        teamNameElement.innerText = newTeamName

        foundTeamName = false
        for (let i = 0; i < teamData.length; i++) {
            if (teamData[i].teamName == newTeamName) {
                foundTeamName = true
                profilePictures[0].setAttribute("src", `https://a.ppy.sh/${teamData[i].player1ID}`)
                profilePictures[1].setAttribute("src", `https://a.ppy.sh/${teamData[i].player2ID}`)
                break
            }
        }
        // Team name not found
        if (!foundTeamName) {
            profilePictures[0].style.opacity = "0"
            profilePictures[1].style.opacity = "0"
        } else {
            profilePictures[0].style.opacity = "1"
            profilePictures[1].style.opacity = "1"
        }

        return newTeamName
    }
    currentTeamNameRed = updateTeamName(currentTeamNameRed, data.tourney.manager.teamName.left, redTeamName, profilePicturesRed)
    currentTeamNameBlue = updateTeamName(currentTeamNameBlue, data.tourney.manager.teamName.right, blueTeamName, profilePicturesBlue)

    // Auto clicking stuff
    if (nowPlayingID !== data.menu.bm.id && data.menu.bm.id !== 0) {
        let tempCurrentAction = currentRemoveAction
        currentRemoveAction = false

        nowPlayingID = data.menu.bm.id
        
        const mapToClick = mappoolData.flat().find(map => map.beatmapID == nowPlayingID)
        if (mapToClick) document.getElementById(nowPlayingID).click()

        currentRemoveAction = tempCurrentAction
        if (currentRemoveAction) removeAction()
    }

    // Chat Stuff
    // This is also mostly taken from Victim Crasher: https://github.com/VictimCrasher/static/tree/master/WaveTournament
    if (chatLen !== data.tourney.manager.chat.length) {
        (chatLen === 0 || chatLen > data.tourney.manager.chat.length) ? (chatDisplayLeft.innerHTML = "", chatLen = 0) : null;
        const fragment = document.createDocumentFragment();

        for (let i = chatLen; i < data.tourney.manager.chat.length; i++) {
            const chatColour = data.tourney.manager.chat[i].team;

            // Chat message container
            const chatMessageContainer = document.createElement("div")
            chatMessageContainer.classList.add("chatMessageContainer")

            // Time
            const chatDisplayTime = document.createElement("div")
            chatDisplayTime.classList.add("chatDisplayTime")
            chatDisplayTime.innerText = data.tourney.manager.chat[i].time

            // Whole Message
            const chatDisplayWholeMessage = document.createElement("div")
            chatDisplayWholeMessage.classList.add("chatDisplayWholeMessage")  
            
            // Name
            const chatDisplayName = document.createElement("span")
            chatDisplayName.classList.add("chatDisplayName")
            chatDisplayName.classList.add(chatColour)
            chatDisplayName.innerText = data.tourney.manager.chat[i].name + ": ";

            // Message
            const chatDisplayMessage = document.createElement("span")
            chatDisplayMessage.classList.add("chatDisplayMessage")
            chatDisplayMessage.innerText = data.tourney.manager.chat[i].messageBody

            chatDisplayWholeMessage.append(chatDisplayName, chatDisplayMessage)
            chatMessageContainer.append(chatDisplayTime, chatDisplayWholeMessage)
            fragment.append(chatMessageContainer)
        }

        chatDisplayLeft.append(fragment)
        chatLen = data.tourney.manager.chat.length;
        chatDisplayLeft.scrollTop = chatDisplayLeft.scrollHeight;
    }  
}

/* Next Action */
function changeNextAction(team, action) {
    // Remove Action Reset
    removeActionReset()
    currentActionTeam.innerText = team
    currentAction.innerText = action
    switch (team) {
        case "RED":
            currentActionTeam.classList.remove("currentActionTeamBlue")
            currentActionTeam.classList.add("currentActionTeamRed")
            break
        case "BLUE":
            currentActionTeam.classList.add("currentActionTeamBlue")
            currentActionTeam.classList.remove("currentActionTeamRed")
            break
    }
}