// Mappool Data
let mappoolData
async function accessMappoolData() { mappoolData = await getAllMaps() }
accessMappoolData().then(() => mappoolData = mappoolData)

// Team Data
let teamData
async function accessTeamData() { teamData = await getAllTeams() }
accessTeamData().then(() => {
    teamData = teamData
})

// Socket Events
// Credits: VictimCrasher - https://github.com/VictimCrasher/static/tree/master/WaveTournament
const socket = new ReconnectingWebSocket("ws://" + location.host + "/ws");
socket.onopen = () => { console.log("Successfully Connected"); };
socket.onclose = event => { console.log("Socket Closed Connection: ", event); socket.send("Client Closed!"); };
socket.onerror = error => { console.log("Socket Error: ", error); };

// Current Scores - Score
const currentScores = document.getElementById("currentScores")
const redCurrentScore = document.getElementById("redCurrentScore")
const redCurrentCombo = document.getElementById("redCurrentCombo")
const redCurrentAccuracy = document.getElementById("redCurrentAccuracy")
const blueCurrentScore = document.getElementById("blueCurrentScore")
const blueCurrentCombo = document.getElementById("blueCurrentCombo")
const blueCurrentAccuracy = document.getElementById("blueCurrentAccuracy")
let currentScoreVisibility
let currentRedScore
let currentBlueScore
let pointGiven = false
// Current Score Differences
const scoreDifferences = document.getElementById("scoreDifferences")
const differenceCurrentScore = document.getElementById("differenceCurrentScore")
const differenceCurrentCombo = document.getElementById("differenceCurrentCombo")
const differenceCurrentAccuracy = document.getElementById("differenceCurrentAccuracy")
const scoreDifferencesLeftLine = document.getElementById("scoreDifferencesLeftLine")
const scoreDifferencesRightLine = document.getElementById("scoreDifferencesRightLine")
const scoreDifferencesLeftDiamond = document.getElementById("scoreDifferencesLeftDiamond")
const scoreDifferencesRightDiamond = document.getElementById("scoreDifferencesRightDiamond")
let currentScoreDifference

const scoreElements = ["redCurrentScore", "blueCurrentScore", "differenceCurrentScore"];
const comboElements = ["redCurrentComboNumber", "blueCurrentComboNumber", "differenceCurrentComboNumber"]
const accuracyElements = ["redCurrentAccuracyNumber", "blueCurrentAccuracyNumber", "differenceCurrentAccuracyNumber"]
const animation = {}
scoreElements.forEach((element) => animation[element] = new CountUp(element, 0, 0, 0, 0.2, { useEasing: true, useGrouping: true, separator: ",", decimal: "." }))
comboElements.forEach((element) => animation[element] = new CountUp(element, 0, 0, 0, 0.2, { useEasing: true, useGrouping: true, separator: ",", decimal: "." }))
accuracyElements.forEach((element) => animation[element] = new CountUp(element, 0, 0, 2, 0.2, { useEasing: true, useGrouping: true, separator: ",", decimal: "." }))

// Now Playing
const nowPlaying = document.getElementById("nowPlaying")
const nowPlayingSongTitle = document.getElementById("nowPlayingSongTitle")
const nowPlayingDifficultySetCreator = document.getElementById("nowPlayingDifficultySetCreator")
const nowPlayingDifficulty = document.getElementById("nowPlayingDifficulty")
const nowPlayingSetCreator = document.getElementById("nowPlayingSetCreator")
const nowPlayingCircle = document.getElementById("nowPlayingCircle")
const nowPlayingPickedBy = document.getElementById("nowPlayingPickedBy") // Needs to be connected to mappool page
const nowPlayingMapStatsCSNumber = document.getElementById("nowPlayingMapStatsCSNumber")
const nowPlayingMapStatsARNumber = document.getElementById("nowPlayingMapStatsARNumber")
const nowPlayingMapStatsSRNumber = document.getElementById("nowPlayingMapStatsSRNumber")
const nowPlayingMapStatsODNumber = document.getElementById("nowPlayingMapStatsODNumber")
const nowPlayingMapStatsBPMNumberMin = document.getElementById("nowPlayingMapStatsBPMNumberMin")
const nowPlayingMapStatsBPMDash = document.getElementById("nowPlayingMapStatsBPMDash")
const nowPlayingMapStatsBPMNumberMax = document.getElementById("nowPlayingMapStatsBPMNumberMax")
let currentMapStatsCSNumber
let currentMapStatsARNumber
let currentMapStatsSRNumber
let currentMapStatsODNumber
let currentMapStatsBPMNumberMin
let currentMapStatsBPMNumberMax
let nowPlayingID = 0
let mappoolFoundMap = false

function updateNowPlayingInformation(beatmap) {
    const findMapInAllMaps = (id) => {
        for (let i = 0; i < mappoolData.length; i++) {
            for (let j = 0; j < mappoolData[i].length; j++) {
                if (id === mappoolData[i][j].beatmapID) {
                    return mappoolData[i][j];
                }
            }
        }
        return null;
    };

    // Now Playing Information
    if (nowPlayingID !== beatmap.id && beatmap.id !== 0) {
        mappoolFoundMap = false
        nowPlayingID = beatmap.id
        nowPlaying.style.backgroundImage = `url("https://assets.ppy.sh/beatmaps/${beatmap.set}/covers/cover.jpg")`
        nowPlayingSongTitle.innerText = beatmap.metadata.title
        nowPlayingDifficulty.innerText = beatmap.metadata.difficulty
        nowPlayingSetCreator.innerText = beatmap.metadata.mapper
        
        nowPlayingCircle.style.display = "none"
        nowPlayingPickedBy.style.display = "none"
        nowPlayingSongTitle.style.top = "23px"
        nowPlayingDifficultySetCreator.style.top = "67px"

        const foundMappoolMap = findMapInAllMaps(nowPlayingID)

        if (foundMappoolMap) {
            mappoolFoundMap = true;

            currentMapStatsCSNumber = parseFloat(foundMappoolMap.cs);
            currentMapStatsARNumber = parseFloat(foundMappoolMap.ar);
            currentMapStatsSRNumber = Math.round(parseFloat(foundMappoolMap.difficultyrating) * 100) / 100;
            currentMapStatsODNumber = parseFloat(foundMappoolMap.od);
            currentMapStatsBPMNumberMin = parseFloat(foundMappoolMap.bpm);
            currentMapStatsBPMNumberMax = parseFloat(foundMappoolMap.bpm);

            switch (foundMappoolMap.mod) {
                case "nm": 
                    nowPlayingCircle.style.backgroundColor = "rgb(92,138,227)";
                    break;
                case "hd":
                    nowPlayingCircle.style.backgroundColor = "#FFDC80";
                    break;
                case "hr":
                    nowPlayingCircle.style.backgroundColor = "#FF8080";
                    break;
                case "dt":
                    nowPlayingCircle.style.backgroundColor = "#E680FF";
                    break;
                case "tb":
                    nowPlayingCircle.style.backgroundColor = "#08A045";
                    break;
            }

            nowPlayingCircle.style.display = "block";
            nowPlayingPickedBy.style.display = "block";
            nowPlayingSongTitle.style.top = "0px";
            nowPlayingDifficultySetCreator.style.top = "23px";
        }
    }

    // Stats
    if (!mappoolFoundMap) {
        // CS
        if (currentMapStatsCSNumber !== beatmap.stats.CS)  currentMapStatsCSNumber = beatmap.stats.CS
        // AR
        if (currentMapStatsARNumber !== beatmap.stats.AR) currentMapStatsARNumber = beatmap.stats.AR
        // SR
        if (currentMapStatsSRNumber !== beatmap.stats.SR) currentMapStatsSRNumber = beatmap.stats.SR
        // OD
        if (currentMapStatsODNumber !== beatmap.stats.OD) currentMapStatsODNumber = beatmap.stats.OD
        // BPM
        if (currentMapStatsBPMNumberMin !== beatmap.stats.BPM.min && currentMapStatsBPMNumberMax !== beatmap.stats.BPM.max) {
            currentMapStatsBPMNumberMin = beatmap.stats.BPM.min
            currentMapStatsBPMNumberMax = beatmap.stats.BPM.max
        }
    }

    updateStatsOnScreen()
}
function updateStatsOnScreen() {
    nowPlayingMapStatsCSNumber.innerText = currentMapStatsCSNumber
    nowPlayingMapStatsARNumber.innerText = currentMapStatsARNumber
    nowPlayingMapStatsSRNumber.innerText = currentMapStatsSRNumber
    nowPlayingMapStatsODNumber.innerText = currentMapStatsODNumber
    nowPlayingMapStatsBPMNumberMin.innerText = currentMapStatsBPMNumberMin
    nowPlayingMapStatsBPMNumberMax.innerText = currentMapStatsBPMNumberMax

    if (currentMapStatsBPMNumberMin == currentMapStatsBPMNumberMax) {
        nowPlayingMapStatsBPMNumberMax.style.display = "none"
        nowPlayingMapStatsBPMDash.style.display = "none"
    } else {
        nowPlayingMapStatsBPMNumberMax.style.display = "inline"
        nowPlayingMapStatsBPMDash.style.display = "inline"
    }
}

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

// Chat 
const chatDisplay = document.getElementById("chatDisplay")
const chatDisplayLeft = document.getElementById("chatDisplayLeft")
let chatLen = 0

// Amplifiers
const redAmplifierButtons = document.getElementById("redAmplifierButtons")
const blueAmplifierButtons = document.getElementById("blueAmplifierButtons")
const amplifierIDsNeedScoreAPI = [1,2,3,4,5,8,14,15,16,17,18,20,21,22,25,26,27,28,29,30,31,32,33,36,37,38,39]
const silverAmplifiers = [2,3,7,9,13,15,20,23,25,27,28,31,37]
const goldAmplifiers = [1,4,14,16,19,21,24,26,29,30,32,34,38]
const prismaticAmplifiers = [5,6,8,10,12,17,18,22,33,35,36,39,40]
const amplifiers = {
    1: {name:'Dude That Fingerlock', description: 'Each miss a player on current_team gets adds 0.5% to their score, up to 15%.'},
    2: {name:'Limit Break', description: 'Scored by: highest combined combo. (ScoreV2 results used for a draw).'},
    3: {name:'Cold Clear Eyes I', description: 'Play the next NM/HR/DT map with Hidden on top. current_team gains a 1.05x multiplier.'},
    4: {name:'Cold Clear Eyes II', description: 'Play the next NM/HR/DT map with Hidden on top. current_team gains a 1.15x multiplier.'},
    5: {name:'Cold Clear Eyes III', description: 'Play the next NM/HR/DT map with Hidden on top. current_team gains a 1.15x multiplier.'},
    6: {name:'Chance Time', description: 'Remove unbanned map. Roll 1-40: opposite_team wins. Roll 41-100: current_team wins.'},
    7: {name:'The Greatest Defense', description: 'current_team protects instead of bans. Protects happen first.'},
    8: {name:'Snail Sect', description: 'Scored by: highest average accuracy. (ScoreV2 results used for a draw).'},
    9: {name:'Turn It Up', description: 'Converts NM Pick to FM. At least one player from each team must use: HD / HR / HDHR / EZ / FL'},
    10: {name: 'Easy Peasy', description: 'Used on NM1 / HD1 / HR1 - Play with EZ.'},
    12: {name: 'Trap Card', description: "current_team tells ref about a map being trapped. opposite_team's pick will be skipped on this map." },
    13: {name: 'The Missing Piece', description: "current_team picks a map from the previous week's pool as if it is from this week."},
    14: {name: 'Gambler', description: "current_team wagers 1 point. Gain 1.25x multiplier. Lose wagered point if lose map."},
    15: {name: 'The King I', description: "Only 1 player from current_team plays the map. current_team gains a 1.9x multiplier."},
    16: {name: 'The King II', description: "Only 1 player from current_team plays the map. current_team gains a 2x multiplier."},
    17: {name: 'The King III', description: "Only 1 player from current_team plays the map. current_team gains a 2x multiplier."},
    18: {name: 'Make it Rock', description: "opposite_team will use HR for this map, and gain a 1.25x multiplier."},
    19: {name: 'Selective', description: "One player from each team uses HD. current_team picks HD user from opposite_team."},
    20: {name: 'Yin And Yang I', description: "Scored by: Highest score of team x teammate accuracy. current_team gains 1.05x score."},
    21: {name: 'Yin And Yang II', description: "Scored by: Highest score of team x teammate accuracy. current_team gains 1.10x score."},
    22: {name: 'Yin And Yang III', description: "Scored by: Highest score of team x teammate accuracy. current_team gains 1.10x score."},
    23: {name: 'Trickster I', description: "opposite_team picks the map from HD or NM pools. current_team uses NM, opposite_team uses HD."},
    24: {name: 'Trickster II', description: "opposite_team picks the map from HD or NM pools. current_team uses NM, opposite_team uses HD."},
    25: {name: 'Classic Farmer I', description: "current_team plays map with HD. Gain 1.05x multiplier."},
    26: {name: 'Classic Farmer II', description: "current_team plays map with HD. Gain 1.05x multiplier."},
    27: {name: 'Snail', description: "Scored by: highest average accuracy. (ScoreV2 results used for a draw)."},
    28: {name: 'Synchronised I', description: "current_team's base multiplier 1.10x. For each % accuracy diff, reduce by 0.05x, min 1x."},
    29: {name: 'Synchronised II', description: "current_team's base multiplier 1.20x. For each % accuracy diff, reduce by 0.05x, min 1x."},
    30: {name: 'Go With The Flow', description: "opposite_team team picks the map. current_team gains a 1.15x multiplier."},
    31: {name: 'Loadbearer I', description: "current_team's score increases by 25% of the score difference between both players."},
    32: {name: 'Loadbearer II', description: "current_team's score increases by 50% of the score difference between both players."},
    33: {name: 'Loadbearer III', description: "current_team's score increases by 50% of the score difference between both players."},
    34: {name: 'Lightbearer', description: "One player from current_team can play with NM."},
    35: {name: 'Cheating Death', description: "current_team can pick any banned map."},
    36: {name: 'True Hero', description: "When opposite_team is on match point, current_team gains a 1.3x multiplier."},
    37: {name: 'The Dragon Consumes I', description: "When current_team wins the previous map, current_team gains a 1.1x multiplier."},
    38: {name: 'The Dragon Consumes II', description: "When current_team wins the previous map, current_team gains a 1.2x multiplier."},
    39: {name: 'The Dragon Consumes III', description: "When current_team wins the previous map, current_team gains a 1.15x multiplier."},
    40: {name: 'Treasure Hunters', description: "!roll. 5 or less = point. Choose next map. If teams are 1 point from winning, play TB."}
}
const currentAmplifierTeamElement = document.getElementById("currentAmplifierTeam")
const currentAmplifierNameElement = document.getElementById("currentAmplifierName")
const amplifierButtons = document.getElementsByClassName("amplifierButton")
let currentAmplifierTeam
let currentAmplifierID
let isScoreAmplifierUsed = false
const redAmplifier1 = document.getElementById("redAmplifier1")
const redAmplifier2 = document.getElementById("redAmplifier2")
const blueAmplifier1 = document.getElementById("blueAmplifier1")
const blueAmplifier2 = document.getElementById("blueAmplifier2")
const redAmplifierIcons = [redAmplifier1, redAmplifier2]
const blueAmplifierIcons = [blueAmplifier1, blueAmplifier2]
const amplifierContainers = document.getElementsByClassName("amplifierContainer")
// Bottom Amplifier Information
const bottomAmplifierContainer = document.getElementById("bottomAmplifierContainer")
const bottomAmplifierImage = document.getElementById("bottomAmplifierImage")
const bottomAmplifierDescription = document.getElementById("bottomAmplifierDescription")
// Change current amplifier
function changeCurrentAmplifier(team, amplifierID) {
    currentAmplifierTeam = team
    currentAmplifierID = amplifierID

    currentAmplifierTeamElement.innerText = team
    currentAmplifierNameElement.innerText = amplifiers[amplifierID].name

    for (let i = 0; i < amplifierButtons.length; i++) {
        amplifierButtons[i].style.backgroundColor = "transparent"
        amplifierButtons[i].style.color = "white"
    }
    for (let i = 0; i < amplifierContainers.length; i++) {
        amplifierContainers[i].classList.remove("visibleGradient")
        amplifierContainers[i].classList.remove("prismaticGradient")
        amplifierContainers[i].classList.remove("goldGradient")
        amplifierContainers[i].classList.remove("silverGradient")
    }
    bottomAmplifierContainer.classList.remove("visibleGradient")
    bottomAmplifierContainer.classList.remove("prismaticGradient")
    bottomAmplifierContainer.classList.remove("goldGradient")
    bottomAmplifierContainer.classList.remove("silverGradient")

    // Current button
    const currentButton = document.getElementById(`${team}${amplifierID}`)
    currentButton.style.backgroundColor = "white"
    currentButton.style.color = "black"

    // Highlight the amplifier image at the top
    // Highlight bottom amplifier container at the bottom
    const currentAmplifierImage = document.getElementById(`${team}_${amplifierID}`)
    const amplifierIDInt = parseInt(amplifierID)
    if (silverAmplifiers.includes(amplifierIDInt)) {
        currentAmplifierImage.classList.add("visibleGradient")
        currentAmplifierImage.classList.add("silverGradient")
        bottomAmplifierContainer.classList.add("visibleGradient")
        bottomAmplifierContainer.classList.add("silverGradient")
    } else if (goldAmplifiers.includes(amplifierIDInt)) {
        currentAmplifierImage.classList.add("visibleGradient")
        currentAmplifierImage.classList.add("goldGradient")
        bottomAmplifierContainer.classList.add("visibleGradient")
        bottomAmplifierContainer.classList.add("goldGradient")
    } else if (prismaticAmplifiers.includes(amplifierIDInt)) {
        currentAmplifierImage.classList.add("visibleGradient")
        currentAmplifierImage.classList.add("prismaticGradient") 
        bottomAmplifierContainer.classList.add("visibleGradient")
        bottomAmplifierContainer.classList.add("prismaticGradient")
    }

    if (amplifierIDsNeedScoreAPI.includes(parseInt(amplifierID))) isScoreAmplifierUsed = true
    else isScoreAmplifierUsed = false 

    // Bottom amplifier container information
    bottomAmplifierContainer.style.opacity = 1
    bottomAmplifierImage.setAttribute("src", `static/amplifiers/${amplifierID}.png`)
    let description = amplifiers[amplifierID].description
    if (team == currentTeamNameRed) {
        description = description.replace(/current_team/g, "<span style='color: #FF6E6E';>current_team</span>").replace(/opposite_team/g, "<span style='color: #71b3fd;'>opposite_team</span>")
        description = description.replace(/current_team/g, currentTeamNameRed).replace(/opposite_team/g, currentTeamNameBlue)
    } else {
        description = description.replace(/current_team/g, "<span style='color: #71b3fd';>current_team</span>").replace(/opposite_team/g, "<span style='color: #FF6E6E;'>opposite_team</span>")
        description = description.replace(/current_team/g, currentTeamNameBlue).replace(/opposite_team/g, currentTeamNameRed)
    }
    bottomAmplifierDescription.firstChild.innerHTML = description

    // Only if the amplifier is gambler, then minus the star
    if (amplifierIDInt == 14) {
        if (team == currentTeamNameRed) changeStarCount("red", "minus")
        else if (team === currentTeamNameBlue) changeStarCount("blue", "minus")
    }
}
function resetCurrentAmplifier() {
    // Reset amplifiers for next map
    currentAmplifierID = undefined
    currentAmplifierTeam = undefined
    currentAmplifierTeamElement.innerText = ""
    currentAmplifierNameElement.innerText = ""

    for (let i = 0; i < amplifierButtons.length; i++) {
        amplifierButtons[i].style.backgroundColor = "transparent"
        amplifierButtons[i].style.color = "white"
    }
    for (let i = 0; i < amplifierContainers.length; i++) {
        amplifierContainers[i].classList.remove("visibleGradient")
        amplifierContainers[i].classList.remove("prismaticGradient")
        amplifierContainers[i].classList.remove("goldGradient")
        amplifierContainers[i].classList.remove("silverGradient")
    }
    isScoreAmplifierUsed = false

    bottomAmplifierContainer.style.opacity = 0
}

// IPC State
let ipcState

socket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    console.log(data)

    // Update Team Name
    function updateTeamName(currentTeamName, newTeamName, teamNameElement, profilePictures, amplifierElement, amplifierIcons) {
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
        // Amplifiers
        amplifierElement.innerHTML = ""
        for (let i = 0; i < teamData.length; i++) {
            if (teamData[i].teamName == newTeamName) {
                foundTeamName = true
                profilePictures[0].setAttribute("src", `https://a.ppy.sh/${teamData[i].player1ID}`)
                profilePictures[1].setAttribute("src", `https://a.ppy.sh/${teamData[i].player2ID}`)

                for (let j = 0; j < teamData[i].amplifiers.length; j++) {
                    // Amplifier Icons
                    if (teamData[i].amplifiers[j] == "") {
                        amplifierIcons[j].style.opacity = "0"
                        continue
                    }

                    const amplifierIDInt = parseInt(teamData[i].amplifiers[j])
                    amplifierIcons[j].style.opacity = "1"
                    amplifierIcons[j].firstChild.setAttribute("src", `static/amplifiers/${teamData[i].amplifiers[j]}.png`)
                    amplifierIcons[j].setAttribute("id", `${newTeamName}_${amplifierIDInt}`)

                    // Make amplifier button
                    const amplifierButton = document.createElement("button")
                    amplifierButton.classList.add("navBarButton", "navBarFullWidthButton", "amplifierButton")
                    amplifierButton.innerText = amplifiers[teamData[i].amplifiers[j]].name
                    amplifierButton.addEventListener("click", () => {
                        changeCurrentAmplifier(newTeamName, amplifierIDInt)
                    })
                    // amplifierButton.setAttribute("onclick", `changeCurrentAmplifier('${newTeamName}', ${amplifierIDInt})`)
                    amplifierButton.setAttribute("id",`${newTeamName}${teamData[i].amplifiers[j]}`)
                    amplifierElement.append(amplifierButton)
                }

                resetCurrentAmplifier()
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
    currentTeamNameRed = updateTeamName(currentTeamNameRed, data.tourney.manager.teamName.left, redTeamName, profilePicturesRed, redAmplifierButtons, redAmplifierIcons)
    currentTeamNameBlue = updateTeamName(currentTeamNameBlue, data.tourney.manager.teamName.right, blueTeamName, profilePicturesBlue, blueAmplifierButtons, blueAmplifierIcons)

    // Score Visibility
    if (currentScoreVisibility !== data.tourney.manager.bools.scoreVisible) {
        currentScoreVisibility = data.tourney.manager.bools.scoreVisible

        if (currentScoreVisibility) {
            currentScores.style.opacity = 1
            scoreDifferences.style.opacity = 1
            chatDisplay.style.opacity = 0
        } else {
            currentScores.style.opacity = 0
            scoreDifferences.style.opacity = 0
            chatDisplay.style.opacity = 1
        }
    }

    // Score stuff
    if (currentScoreVisibility) {
        const IPCClients = data.tourney.ipcClients
        let playerScores = [IPCClients[0].gameplay.score, IPCClients[1].gameplay.score, IPCClients[2].gameplay.score, IPCClients[3].gameplay.score]
        if (isScoreAmplifierUsed) {
            // Set scores for API
            let playerIDs = [IPCClients[0].spectating.userID, IPCClients[1].spectating.userID,IPCClients[2].spectating.userID, IPCClients[3].spectating.userID]
            let playerCombos = [IPCClients[0].gameplay.combo.max, IPCClients[1].gameplay.combo.max, IPCClients[2].gameplay.combo.max, IPCClients[3].gameplay.combo.max]
            let playerAccs = [IPCClients[0].gameplay.accuracy, IPCClients[1].gameplay.accuracy, IPCClients[2].gameplay.accuracy, IPCClients[3].gameplay.accuracy]
            let playerMisses = [IPCClients[0].gameplay.hits["0"], IPCClients[1].gameplay.hits["0"], IPCClients[2].gameplay.hits["0"], IPCClients[3].gameplay.hits["0"]]

            let scoreXHR = new XMLHttpRequest()
            scoreXHR.open("GET", `http://ADDRESS:5000/score?team_name=${currentAmplifierTeam}` + 
            `&amplifier_id=${currentAmplifierID}` +
            `&player1_id=${playerIDs[0]}&player1_score=${playerScores[0]}&player1_combo=${playerCombos[0]}&player1_acc=${playerAccs[0]}&player1_misses=${playerMisses[0]}` +
            `&player2_id=${playerIDs[1]}&player2_score=${playerScores[1]}&player2_combo=${playerCombos[1]}&player2_acc=${playerAccs[1]}&player2_misses=${playerMisses[1]}` +
            `&player3_id=${playerIDs[2]}&player3_score=${playerScores[2]}&player3_combo=${playerCombos[2]}&player3_acc=${playerAccs[2]}&player3_misses=${playerMisses[2]}` +
            `&player4_id=${playerIDs[3]}&player4_score=${playerScores[3]}&player4_combo=${playerCombos[3]}&player4_acc=${playerAccs[3]}&player4_misses=${playerMisses[3]}`, false)

            scoreXHR.onreadystatechange = function() {
                if (scoreXHR.readyState === XMLHttpRequest.DONE) {
                    if (scoreXHR.status === 200) {
                        const responseData = JSON.parse(scoreXHR.responseText)
                        currentRedScore = responseData.team1_score
                        currentBlueScore = responseData.team2_score
                        currentScoreDifference = Math.abs(currentRedScore - currentBlueScore)
                    } else console.error(`Error: ` + scoreXHR.status);
                }
            }
            scoreXHR.send()
        } else {
            // Set scores
            currentRedScore = playerScores[0] + playerScores[1]
            currentBlueScore = playerScores[2] + playerScores[3]
            currentScoreDifference = Math.abs(currentRedScore - currentBlueScore)
        }

        let differenceCurrentScoreWidthHalf

        function updateDisplay(displayCombo, displayAccuracy, displayScore) {
            // Combo
            redCurrentCombo.style.display = displayCombo;
            blueCurrentCombo.style.display = displayCombo;
            differenceCurrentCombo.style.display = displayCombo;
                
            // Accuracy
            redCurrentAccuracy.style.display = displayAccuracy;
            blueCurrentAccuracy.style.display = displayAccuracy;
            differenceCurrentAccuracy.style.display = displayAccuracy;
                
            // Normal Score
            redCurrentScore.style.display = displayScore;
            blueCurrentScore.style.display = displayScore;
            differenceCurrentScore.style.display = displayScore;
        }
        if (currentAmplifierID == 2) {
            updateDisplay("block", "none", "none")

            // Animate scores
            animation.redCurrentComboNumber.update(currentRedScore)
            animation.blueCurrentComboNumber.update(currentBlueScore)
            animation.differenceCurrentComboNumber.update(currentScoreDifference)

            differenceCurrentScoreWidthHalf = differenceCurrentCombo.getBoundingClientRect().width / 2
        } else if (currentAmplifierID == 27 || currentAmplifierID == 8) {
            updateDisplay("none", "block", "none")
            
            // Animate scores
            animation.redCurrentAccuracyNumber.update(currentRedScore)
            animation.blueCurrentAccuracyNumber.update(currentBlueScore)
            animation.differenceCurrentAccuracyNumber.update(currentScoreDifference)

            differenceCurrentScoreWidthHalf = differenceCurrentAccuracy.getBoundingClientRect().width / 2
        } else {
            updateDisplay("none", "none", "block")
            
            // Animate scores
            animation.redCurrentScore.update(currentRedScore)
            animation.blueCurrentScore.update(currentBlueScore)
            animation.differenceCurrentScore.update(currentScoreDifference)

            differenceCurrentScoreWidthHalf = differenceCurrentScore.getBoundingClientRect().width / 2
        }

        // Set diamond left/right styles
        const diamondPositionLeftRight = `${(960 + Math.sqrt(8)) - differenceCurrentScoreWidthHalf - 34.45}px`
        scoreDifferencesLeftDiamond.style.left = diamondPositionLeftRight
        scoreDifferencesRightDiamond.style.right = diamondPositionLeftRight

        // Set line left/right widths
        const lineWidths = `${406 - differenceCurrentScoreWidthHalf - 48.32}px`
        scoreDifferencesLeftLine.style.width = lineWidths
        scoreDifferencesRightLine.style.width = lineWidths

        // Set colour
        function setScoreDifferenceColour(colour) {
            scoreDifferencesLeftDiamond.style.borderColor = colour
            scoreDifferencesLeftLine.style.backgroundColor = colour
            scoreDifferencesRightDiamond.style.borderColor = colour
            scoreDifferencesRightLine.style.backgroundColor = colour
        }
        if (currentRedScore > currentBlueScore) setScoreDifferenceColour("rgb(255,117,117)")
        else if (currentRedScore < currentBlueScore) setScoreDifferenceColour("rgb(92,138,227)")
        else setScoreDifferenceColour("white")

    } else {
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
                chatDisplayName.classList.add("chatDisplayName", chatColour)
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

    updateNowPlayingInformation(data.menu.bm)

    // IPC State
    if (ipcState !== data.tourney.manager.ipcState) {
        ipcState = data.tourney.manager.ipcState

        if (ipcState == 1) {
            pointGiven = false

            resetCurrentAmplifier()
        }
    }
    if (ipcState == 3) pointGiven = false
    if (ipcState == 4) {
        if (!pointGiven) {
            let pointWinner
            if (currentRedScore > currentBlueScore) {
                pointWinner = "red"
            } else if (currentBlueScore > currentRedScore) {
                pointWinner = "blue"
            } else if (currentAmplifierID == 2 || currentAmplifierID == 27 || currentAmplifierID == 8) {
                const ipcClients = data.tourney.ipcClients
                const teamRedScore = ipcClients[0].gameplay.score + ipcClients[1].gameplay.score
                const teamBlueScore = ipcClients[2].gameplay.score + ipcClients[3].gameplay.score
                if (teamRedScore > teamBlueScore) {
                    pointWinner = "red"
                } else if (teamBlueScore > teamRedScore) {
                    pointWinner = "blue"
                }
            }

            if (pointWinner) {
                changeStarCount(pointWinner, "add")

                // Check gambler points
                if (currentAmplifierID == 14) {
                    if (currentAmplifierTeam === currentTeamNameRed && currentRedScore > currentBlueScore) {
                        changeStarCount(pointWinner, "add")
                    } else if (currentAmplifierTeam === currentTeamNameBlue && currentRedScore < currentBlueScore) {
                        changeStarCount(pointWinner, "add")
                    }
                }
            }

            pointGiven = true
        }
    }
} 

/* Nav Bar Functions */
const nowPlayingPickedByTeam = document.getElementById("nowPlayingPickedByTeam")
function changePickedBy(team) {
    if (team === "red") {
        nowPlayingPickedByTeam.style.color = "rgb(255,117,117)"
        nowPlayingPickedByTeam.innerText = "Red"
    } else if (team === "blue") {
        nowPlayingPickedByTeam.style.color = "rgb(92,138,227)"
        nowPlayingPickedByTeam.innerText = "Blue"
    }
    document.cookie = `currentPicker=${team}; path=/`
}

setInterval(() => {
    changePickedBy(getCookie("currentPicker"))
}, 500)

resetStars()