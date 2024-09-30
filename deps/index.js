// Reset cookies
// document.cookie = "currentStarRed=0; path=/"
// document.cookie = "currentStarBlue=0; path=/"
// document.cookie = "stage=Round of 32; path=/"
// document.cookie = "matchNumber=0; path=/"

// Stars
const redTeamStars = document.getElementById("redTeamStars")
const blueTeamStars = document.getElementById("blueTeamStars")
let currentBestOf = 0
let currentFirstTo = 0
let currentTeamRedStarCount = 0
let currentTeamBlueStarCount = 0

/* Nav Bar Functions */
const handleMatchNumber = () => {
    let matchNumber = document.getElementById("navBarMatchText").value.trim()
    
    changeMatchNumber(matchNumber)
}
const changeMatchNumber = matchNumber => {
    if (matchNumber == "") document.getElementById("matchText").style.opacity = 0
    else document.getElementById("matchText").style.opacity = 1
    document.getElementById("matchNumber").innerText = matchNumber
    document.cookie = `matchNumber=${matchNumber}; path=/` 
}
function changeRound(round) { 
    document.getElementById("stageText").innerText = round 
    document.cookie = `stage=${round}; path=/` 

    // Setting current best of and current first to
    switch (round) {
        case "Round of 32": case "Round of 16":
            currentBestOf = 9
            break
        case "Quarterfinals": case "Semifinals":
            currentBestOf = 11
            break
        default:
            currentBestOf = 13
    }
    currentFirstTo = Math.ceil(currentBestOf / 2)

    // Create missing elements
    function addStars(element, direction) {
        while (element.childElementCount < currentFirstTo) {
            // Create outer div
            const starDiv = document.createElement("div")
            starDiv.classList.add(`starDiv${direction}`)

            for (let i = 0; i < 2; i++) {
                const starImage = document.createElement("img")
                starImage.classList.add("starImage")
                starImage.classList.add(`starImage${direction}`)
                starImage.setAttribute("src", i === 1 ? "static/starFilled.png" : "static/starEmpty.png");
                starImage.style.top = `-${26 * i}px`
                if (i === 1) {
                    starImage.style.top = "-26px"
                    starImage.style.opacity = 0;
                }
                starDiv.appendChild(starImage);
            }

            element.append(starDiv)
        }
    }
    // Check red stars
    if (redTeamStars.childElementCount < currentFirstTo) addStars(redTeamStars, "Left")
    else if (redTeamStars.childElementCount > currentFirstTo) {
        while (redTeamStars.childElementCount > currentFirstTo) redTeamStars.lastChild.remove()
    }
    // Check blue stars
    if (blueTeamStars.childElementCount < currentFirstTo) addStars(blueTeamStars, "Right")
    else if (blueTeamStars.childElementCount > currentFirstTo) {
        while (blueTeamStars.childElementCount > currentFirstTo) blueTeamStars.lastChild.remove()
    }

    checkAndApplyStarCounts()
}
function checkAndApplyStarCounts() {
    // Check current star counts
    if (currentTeamRedStarCount > currentFirstTo) currentTeamRedStarCount = currentFirstTo
    if (currentTeamBlueStarCount > currentFirstTo) currentTeamBlueStarCount = currentFirstTo
    if (currentTeamRedStarCount < 0) currentTeamRedStarCount = 0
    if (currentTeamBlueStarCount < 0) currentTeamBlueStarCount = 0

    // Apply them onto the page
    applyStarOpacity(currentTeamRedStarCount, redTeamStars)
    applyStarOpacity(currentTeamBlueStarCount, blueTeamStars)

    // Cookies
    document.cookie = `currentStarRed=${currentTeamRedStarCount}; path=/` 
    document.cookie = `currentStarBlue=${currentTeamBlueStarCount}; path=/` 
}
function applyStarOpacity(starCount, starElement) {
    let i
    for (i = 0; i < starCount; i++) starElement.children[i].children[1].style.opacity = 1
    for (i; i < currentFirstTo; i++) starElement.children[i].children[1].style.opacity = 0
}
// Star Count
function changeStarCount(team, action) {
    if (starToggle.innerText === "ON") {
        changeStarCountInner(team, action)
    }
}
function changeStarCountInner(team, action) {
    if (team === "red" && action === "add") currentTeamRedStarCount++
    if (team === "red" && action === "minus") currentTeamRedStarCount--
    if (team === "blue" && action === "add") currentTeamBlueStarCount++
    if (team === "blue" && action === "minus") currentTeamBlueStarCount--

    checkAndApplyStarCounts()
}
// Star Reset
function resetStars() {
    currentTeamRedStarCount = 0
    currentTeamBlueStarCount = 0
    checkAndApplyStarCounts()
}
// Star Toggles
const starToggle = document.getElementById("starToggle")
const starToggleButton = document.getElementById("starToggleButton")
function toggleStars() {
    if (starToggle.innerText === "ON") {
        starToggle.innerText = "OFF"
        redTeamStars.style.opacity = 0
        blueTeamStars.style.opacity = 0
        starToggleButton.style.backgroundColor = "darkred"
    } else if (starToggle.innerText = "OFF") {
        starToggle.innerText = "ON"
        redTeamStars.style.opacity = 1
        blueTeamStars.style.opacity = 1
        starToggleButton.style.backgroundColor = "green"
    }
}

/* Get Cookies */
function getCookie(cname) {
    let name = cname + "="
    let ca = document.cookie.split(';')
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) == ' ') c = c.substring(1)
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length)
    }
    return ""
}

setInterval(() => {
    // Current stars
    currentTeamRedStarCount = parseInt(getCookie("currentStarRed"))
    currentTeamBlueStarCount = parseInt(getCookie("currentStarBlue"))

    // Change stage
    changeRound(getCookie("stage"))

    // Change match number
    changeMatchNumber(getCookie("matchNumber"))
}, 500)