const formSearch = document.querySelector('#formsearch');
const inputtxt = document.querySelector('#inputtxt');
const container = document.querySelector('#container');

// Trending tags click handler
document.querySelectorAll('.trending-tag').forEach(tag => {
    tag.addEventListener('click', () => {
        inputtxt.value = tag.textContent;
        formSearch.dispatchEvent(new Event('submit'));
    });
});

const submitfunc = async (e) => {
    e.preventDefault();
    const userInput = inputtxt.value.trim();
    
    if (!userInput) return;
    
    try {
        const res = await axios.get(`https://api.tvmaze.com/search/shows?q=${userInput}`);
        displayResults(res.data, userInput);
    } catch (error) {
        console.error("Error fetching data:", error);
        showError("Failed to fetch data. Please try again later.");
    }
}

const displayResults = (shows, searchQuery) => {
    clearResults();
    
    if (shows.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <h2>No shows found for "${searchQuery}"</h2>
            <p>Try a different search term or check the spelling.</p>
        `;
        container.appendChild(noResults);
    } else {
        shows.forEach(result => {
            const show = result.show;
            const showCard = document.createElement('div');
            showCard.className = 'show-card';
            
            let imageContent = '';
            if (show.image) {
                imageContent = `<img src="${show.image.medium}" alt="${show.name}" class="show-img">`;
            } else {
                imageContent = `<div class="no-image" style="height: 350px; display: flex; align-items: center; justify-content: center; background: #f0f0f0; color: #666;">
                    <i class="fas fa-image" style="font-size: 3rem;"></i>
                </div>`;
            }
            
            showCard.innerHTML = `
                ${imageContent}
                <div class="show-info">
                    <h3 class="show-title">${show.name}</h3>
                    <div class="show-meta">
                        <span>${show.premiered ? show.premiered.substring(0, 4) : 'N/A'}</span>
                        <span>${show.rating.average ? show.rating.average + '★' : 'No rating'}</span>
                    </div>
                </div>
            `;
            
            container.appendChild(showCard);
        });
    }
}

const clearResults = () => {
    container.innerHTML = '';
}

const showError = (message) => {
    clearResults();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'no-results';
    errorDiv.innerHTML = `<h2>${message}</h2>`;
    container.appendChild(errorDiv);
}

formSearch.addEventListener('submit', submitfunc);

// Clear results when input is empty
inputtxt.addEventListener('input', () => {
    if (inputtxt.value.trim() === '') {
        clearResults();
        container.innerHTML = `
            <div class="welcome-message">
                <h2>Welcome to TV Show Explorer!</h2>
                <p>Search for your favorite TV shows to see details and posters.</p>
                <div class="trending-shows">
                    <p>Try searching for: <span class="trending-tag">Stranger Things</span> <span class="trending-tag">The Office</span> <span class="trending-tag">Breaking Bad</span></p>
                </div>
            </div>
        `;
        
        // Re-add event listeners to trending tags
        document.querySelectorAll('.trending-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                inputtxt.value = tag.textContent;
                formSearch.dispatchEvent(new Event('submit'));
            });
        });
    }
});