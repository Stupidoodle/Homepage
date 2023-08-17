const apiKey = process.env.API_KEY; // Assuming you have the API key stored as a GitHub secret

const serverIP = '3.65.42.173'; // Replace with your server's IP address
const apiEndpoints = {
    currentSong: `http://${serverIP}:8000/api/current-song`,
    topArtists: `http://${serverIP}:8000/api/top-artists`,
    topTracks: `http://${serverIP}:8000/api/top-tracks`,
    recentlyPlayed: `http://${serverIP}:8000/api/recently-played`
};

// TextScramble class for the text effect
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="dud">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const currentSongDiv = document.getElementById('currentSong');
    const topArtistsDiv = document.getElementById('topArtists');
    const topTracksDiv = document.getElementById('topTracks');
    const recentlyPlayedDiv = document.getElementById('recentlyPlayed');

    // TextScramble initialization
    const el = document.querySelector('.text');
    const fx = new TextScramble(el);

    try {
        // Fetch and display current playing song with text scramble effect
        const currentSongData = await fetchData(apiEndpoints.currentSong);
        fx.setText(`Currently Playing: ${currentSongData.song}`);

        // Fetch and display top artists
        const topArtistsData = await fetchData(apiEndpoints.topArtists);
        topArtistsDiv.innerHTML = `<h2>Top Artists</h2><ul>${topArtistsData.artists.map(artist => `<li>${artist}</li>`).join('')}</ul>`;

        // Fetch and display top tracks
        const topTracksData = await fetchData(apiEndpoints.topTracks);
        topTracksDiv.innerHTML = `<h2>Top Tracks</h2><ul>${topTracksData.tracks.map(track => `<li>${track}</li>`).join('')}</ul>`;

        // Fetch and display recently played
        const recentlyPlayedData = await fetchData(apiEndpoints.recentlyPlayed);
        recentlyPlayedDiv.innerHTML = `<h2>Recently Played</h2><ul>${recentlyPlayedData.songs.map(song => `<li>${song}</li>`).join('')}</ul>`;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});
