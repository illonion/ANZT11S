let player1ID = 9383377
let player1Score = 897543
let player1Combo = 876
let player1Acc = 98.57
let player1Misses = 2

let player2ID = 8530809
let player2Score = 764123
let player2Combo = 735
let player2Acc = 99.35
let player2Misses = 6
let team1BaseScore = 1661666

let player3ID = 11189608
let player3Score = 973212
let player3Combo = 1012
let player3Acc = 99.67
let player3Misses = 0

let player4ID = 8379046
let player4Score = 643284
let player4Combo = 532
let player4Acc = 98.65
let player4Misses = 11
let team2BaseScore = 1616496

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

function runAPITest(index, amplifierID, teamName, team1_score, team2_score) {
    let test = new XMLHttpRequest()
    test.open("GET", `http://45.32.105.80:5000/score?team_name=${teamName}` + 
                    `&amplifier_id=${amplifierID}` +
                    `&player1_id=${player1ID}&player1_score=${player1Score}&player1_combo=${player1Combo}&player1_acc=${player1Acc}&player1_misses=${player1Misses}` +
                    `&player2_id=${player2ID}&player2_score=${player2Score}&player2_combo=${player2Combo}&player2_acc=${player2Acc}&player2_misses=${player2Misses}` +
                    `&player3_id=${player3ID}&player3_score=${player3Score}&player3_combo=${player3Combo}&player3_acc=${player3Acc}&player3_misses=${player3Misses}` +
                    `&player4_id=${player4ID}&player4_score=${player4Score}&player4_combo=${player4Combo}&player4_acc=${player4Acc}&player4_misses=${player4Misses}`, true)
    test.onreadystatechange = function() {
        if (test.readyState === XMLHttpRequest.DONE) {
            if (test.status === 200) {
                var responseData = JSON.parse(test.responseText);
                if (responseData.team1_score == team1_score && responseData.team2_score == team2_score) console.log(`TEST ${index} PASSED`)
                else console.log(`TEST ${index} FAILED`)
            } else console.error(`Error ${index}: ` + test.status);
        }
    }
    test.send()
}

// Dude That Fingerlock
amplifierID = 1
runAPITest(1, amplifierID, "chili con carne", 906518+787047, 1616496)
sleep(100)
runAPITest(2, amplifierID, "qc kp", 1661666, 973212 + 678665)
sleep(100)

// Limit Break
amplifierID = 2
runAPITest(3, amplifierID, "chili con carne", 1611, 1544)
sleep(100)
runAPITest(4, amplifierID, "qc kp", 1611, 1544)
sleep(100)

// Cold Clear Eyes I
amplifierID = 3
runAPITest(5, amplifierID, "chili con carne", 1744749, 1616496)
runAPITest(6, amplifierID, "qc kp", 1661666, 1697321)

// Cold Clear Eyes II
amplifierID = 4
runAPITest(7, amplifierID, "chili con carne", 1910915, 1616496)
runAPITest(8, amplifierID, "qc kp", 1661666, 1858971)

// Cold Clear Eyes III
amplifierID = 5
runAPITest(9, amplifierID, "chili con carne", 1910915, 1616496)
runAPITest(10, amplifierID, "qc kp", 1661666, 1858971)

// Gambler
amplifierID = 14
runAPITest(11, amplifierID, "chili con carne", 2077083, 1616496)
runAPITest(12, amplifierID, "qc kp", 1661666, 2020620)

// The King I
amplifierID = 15
player2Score = 0
runAPITest(13, amplifierID, "chili con carne", 1705332, 1616496)
player2Score = 764123
player4Score = 0
runAPITest(14, amplifierID, "qc kp", 1661666, 1849103)

// The King II
amplifierID = 16
player2Score = 0
player4Score = 643284
runAPITest(15, amplifierID, "chili con carne", 1795086, 1616496)
player2Score = 764123
player4Score = 0
runAPITest(16, amplifierID, "qc kp", 1661666, 1946424)

// The King III
amplifierID = 17
player2Score = 0
player4Score = 643284
runAPITest(17, amplifierID, "chili con carne", 1795086, 1616496)
player2Score = 764123
player4Score = 0
runAPITest(18, amplifierID, "qc kp", 1661666, 1946424)

// Make It Rock
amplifierID = 18
player4Score = 643284
runAPITest(19, amplifierID, "chili con carne", 1661666, 2020620)
runAPITest(20, amplifierID, "qc kp", 2077083, 1616496)

// Yin And Yang I
amplifierID = 20
runAPITest(21, amplifierID, "chili con carne", 936294, 960074)
runAPITest(22, amplifierID, "qc kp", 891709, 1008077)

// Yin And Yang II
amplifierID = 21
runAPITest(23, amplifierID, "chili con carne", 980880, 960074)
runAPITest(24, amplifierID, "qc kp", 891709, 1056081)

// Yin And Yang III
amplifierID = 22
runAPITest(25, amplifierID, "chili con carne", 980880, 960074)
runAPITest(26, amplifierID, "qc kp", 891709, 1056081)

// Classic Farmer I
amplifierID = 25
runAPITest(27, amplifierID, "chili con carne", 1744749, 1616496)
runAPITest(28, amplifierID, "qc kp", 1661666, 1697321)

// Classic Farmer II
amplifierID = 26
runAPITest(29, amplifierID, "chili con carne", 1744749, 1616496)
runAPITest(30, amplifierID, "qc kp", 1661666, 1697321)

// Synchronised I
amplifierID = 28
runAPITest(31, amplifierID, "chili con carne", 1763028, 1616496)
runAPITest(32, amplifierID, "qc kp", 1661666, 1695704)

// Synchronised II
amplifierID = 29
runAPITest(33, amplifierID, "chili con carne", 1929194, 1616496)
runAPITest(34, amplifierID, "qc kp", 1661666, 1857354)

// Go with the flow
amplifierID = 30
runAPITest(35, amplifierID, "chili con carne", 1910915, 1616496)
runAPITest(36, amplifierID, "qc kp", 1661666, 1858971)

// Loadbearer I
amplifierID = 31
runAPITest(37, amplifierID, "chili con carne", 1695021, 1616496)
runAPITest(38, amplifierID, "qc kp", 1661666, 1698978)

// Loadbearer II
amplifierID = 32
runAPITest(39, amplifierID, "chili con carne", 1728376, 1616496)
runAPITest(40, amplifierID, "qc kp", 1661666, 1781460)

// Loadbearer III
amplifierID = 33
runAPITest(41, amplifierID, "chili con carne", 1728376, 1616496)
runAPITest(42, amplifierID, "qc kp", 1661666, 1781460)

// True Hero
amplifierID = 36
runAPITest(43, amplifierID, "chili con carne", 1930929, 1616496)
runAPITest(44, amplifierID, "qc kp", 1661666, 1908460)

// The Dragon Consumes I
amplifierID = 37
runAPITest(45, amplifierID, "chili con carne", 1827832, 1616496)
runAPITest(46, amplifierID, "qc kp", 1661666, 1778145)

// The Dragon Consumes II
amplifierID = 38
runAPITest(47, amplifierID, "chili con carne", 1994000, 1616496)
runAPITest(48, amplifierID, "qc kp", 1661666, 1939795)

// The Dragon Consumes III
amplifierID = 39
runAPITest(49, amplifierID, "chili con carne", 1910916, 1616496)
runAPITest(50, amplifierID, "qc kp", 1661666, 1858970)

// Snail
amplifierID = 27
runAPITest(51, amplifierID, "chili con carne", 98.96, 99.16)
runAPITest(52, amplifierID, "qc kp", 98.96, 99.16)

// Snail Sect
amplifierID = 8
runAPITest(53, amplifierID, "chili con carne", 98.96, 99.16)
runAPITest(54, amplifierID, "qc kp", 98.96, 99.16)