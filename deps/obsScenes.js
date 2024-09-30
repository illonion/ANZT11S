// Set variables and constants
const musicArtist = document.getElementById("musicArtist")
const musicTitle = document.getElementById("musicTitle")
let currentMusicArtist, currentMusicTitle

// Socket Events
// Credits: VictimCrasher - https://github.com/VictimCrasher/static/tree/master/WaveTournament
const socket = new ReconnectingWebSocket("ws://" + location.host + "/ws");
socket.onopen = () => { console.log("Successfully Connected"); };
socket.onclose = event => { console.log("Socket Closed Connection: ", event); socket.send("Client Closed!"); };
socket.onerror = error => { console.log("Socket Error: ", error); };

socket.onmessage = event => {
    const metadata = JSON.parse(event.data).menu.bm.metadata
    if (metadata.artist !== currentMusicArtist) {
        currentMusicArtist = metadata.artist
        musicArtist.innerText = currentMusicArtist
    }
    if (metadata.title !== currentMusicTitle) {
        currentMusicTitle = metadata.title
        musicTitle.innerText = currentMusicTitle
    }
}