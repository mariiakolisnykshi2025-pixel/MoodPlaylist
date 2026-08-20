const YOUTUBE_API_KEY = 'AIzaSyA0UVeMYTiLiVphRJbHJ_gqiguIEDqGJjM';


async function searchYouTube(query) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&type=video&key=${YOUTUBE_API_KEY}`;

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        
        return data.items;
    } catch (error) {
        console.error('YouTube API query error:', error);
        return [];
    }
}

let selectedMood = '';
let selectedGenres = [];


const moodSection = document.getElementById('mood-section');
const genreSection = document.getElementById('genre-section');
const generateButton = document.getElementById('generate-button');
const genreList = genreSection.querySelector('.genre-list');

const moodButtons = moodSection.querySelectorAll('button');

const moodGenres = {
    depressed: ['Rock', 'Indie', 'Folk', 'Pop', 'Instrumental'],
    longing: ['Jazz', 'Classics', 'Instrumental', 'Indie', 'Folk'],
    epic: ['Classics', 'Electronic', 'Instrumental', 'Rock'],
    romanticising: ['Pop', 'Jazz', 'Indie', 'Folk', 'Instrumental'],
    concentrate: ['Instrumental', 'Classics', 'Electronic', 'Jazz'],
    dancing: ['Pop', 'Electronic', 'Hip-hop'],
    nostalgic: ['Rock', 'Jazz', 'Pop', 'Indie'],
    love: ['Pop', 'Indie', 'Jazz', 'Rock'],
    trip: ['Rock', 'Indie', 'Electronic', 'Hip-hop', 'Folk'],
    mood: ['Rock', 'Indie', 'Folk', 'Pop', 'Jazz', 'Instrumental', 'Classics', 'Hip-hop', 'Electronic']
};

function renderGenres(selectedMood) {
    genreList.innerHTML = '';
    const genresToDisplay = moodGenres[selectedMood] || moodGenres.mood;

    genresToDisplay.forEach(function(genre) {
        const label = document.createElement('label');
        label.innerHTML = `
            <input type="checkbox" name="genre" value="${genre.toLowerCase()}"> ${genre}
        `;
        genreList.appendChild(label); 
    });
}


function getSelectedGenres() {
    const checkedGenres = genreList.querySelectorAll('input[name="genre"]:checked');
    return Array.from(checkedGenres).map(function(checkbox) {
        return checkbox.value;
    });
}


function showGenreSection(event) {
    console.log('Button:', event.currentTarget);
    console.log('dataset:', event.currentTarget.dataset);

    selectedMood = event.currentTarget.dataset.mood;

    renderGenres(selectedMood);

    moodSection.classList.add('hidden');
    genreSection.classList.remove('hidden');
    generateButton.classList.remove('hidden');
}


moodButtons.forEach(function(button) {
    button.addEventListener('click', showGenreSection);
});




const playlistSection = document.getElementById('playlist-section');
const playlistBody = playlistSection.querySelector('tbody');

function displayPlaylist(videos) {
    playlistBody.innerHTML = '';

    if (videos.length === 0) {
        playlistBody.innerHTML = `<tr><td colspan="5" style="text-align: center;">Nothing found((( Try different genres</td></tr>`;
        playlistSection.classList.remove('hidden');
        return;
    }

    videos.forEach(function(item) {
        const snippet = item.snippet;
        const videoId = item.id.videoId;

        const thumbnailUrl = snippet.thumbnails.default.url;
        const title = snippet.title;
        const channelTitle = snippet.channelTitle;
        const youtubeLink = `https://www.youtube.com/watch?v=${videoId}`;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${thumbnailUrl}" alt="cover" width="40" style="border-radius: 6px;"></td>
            <td>${title}</td>
            <td>${channelTitle}</td>
            <td>${selectedGenres.join(', ')}</td>
            <td><a href="${youtubeLink}" target="_blank">Listen on YT</a></td>
        `;

        playlistBody.appendChild(tr);
    });

    playlistSection.classList.remove('hidden');
    
    playlistSection.scrollIntoView({ behavior: 'smooth' });
}



generateButton.addEventListener('click', async function() {
    selectedGenres = getSelectedGenres();

    if (selectedGenres.length === 0) {
        alert('Please choose at least one genre!');
        return;
    }

    const query = `${selectedMood} ${selectedGenres.join(' ')} music`;
    console.log('YT query:', query);


    generateButton.textContent = 'Loading playlist...';
    generateButton.disabled = true;

    const videos = await searchYouTube(query);
    displayPlaylist(videos);
    
    generateButton.textContent = 'Generate Playlist';
    generateButton.disabled = false;

});




