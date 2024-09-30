const teamMaker = document.getElementById("teamMaker")
let allObjects = []
let teamObjects = {teams: {}}
function teamCreate() {
    const teamMakerText = teamMaker.value.trim()

    // Check if empty
    if (teamMakerText == "") {
        alert("Please enter something in the textarea!")
        return
    }

    const teamMakerLines = teamMakerText.split("\n")
    for (let i = 0; i < teamMakerLines.length; i++) {
        if (teamMakerLines[i].trim() == "") continue
        let teamMakerLineSections = teamMakerLines[i].split("|")

        if (teamMakerLineSections.length > 5 || teamMakerLineSections.length < 4) {
            alert(`Too or too little sections in line ${i + 1}!
Necessary sections: 4-5
Your numebr of sections: ${teamMakerLineSections.length}`)
            return
        }

        // Make up to 6 sections
        while (teamMakerLineSections.length < 6) {
            teamMakerLineSections.push("")
        }
        // Trim everything
        for (let j = 0; j < teamMakerLineSections.length; j++) teamMakerLineSections[j] = teamMakerLineSections[j].trim()

        let objectData = {
            teamName: teamMakerLineSections[0],
            player1ID: teamMakerLineSections[1],
            player2ID: teamMakerLineSections[2],
            amplifiers: [teamMakerLineSections[3], teamMakerLineSections[4]]
        }
        allObjects.push(objectData)

        teamObjects.teams[teamMakerLineSections[0]] = [parseInt(teamMakerLineSections[1]), parseInt(teamMakerLineSections[2])]
    }

    downloadJSON(allObjects, "teams.json")
    downloadJSON(teamObjects, "data.json")
}

function downloadJSON(object, fileName) {
    const jsonString = JSON.stringify(object, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = fileName;
    downloadLink.click()
}