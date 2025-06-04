
const formSearch = document.querySelector('#formsearch');
const inputtxt = document.querySelector('#inputtxt');
const showTitle = document.querySelector('#showTitle');
const container = document.querySelector('#container');

const submitfunc = async (e) => {
    e.preventDefault();
    const userInput = inputtxt.value;
    showTitle.innerHTML = `You searched for shows containing: ${userInput}`;
    const res = await axios.get(`https://api.tvmaze.com/search/shows?q=${userInput}`);
    clearResults(); 
    makeImage(res.data);
    console.log(res.data);
}

const makeImage = (shows) => {
    if (shows.length === 0) {
        const showTxt = document.createElement('h2');
        showTxt.innerHTML = '';
        showTxt.innerHTML = 'This title does not exist on this site';
        container.appendChild(showTxt);
    } else {
        for (let result of shows) {
            if (result.show.image) {
                const showImg = document.createElement('IMG');
                showImg.src = result.show.image.medium;
                container.appendChild(showImg);
            } else {
                const showText = document.createElement('h2');
                showText.innerHTML = result.show.name + ' image not available';
                container.appendChild(showText);
            }
        }
    }
    container.style.display = 'block';
}

const clearResults = () => {
    container.innerHTML = ''; 
    showTitle.innerHTML = ''; 
}

inputtxt.addEventListener('input', () => {
    if (inputtxt.value === '') {
        clearResults();
        container.style.display = 'none';
    }
});

formSearch.addEventListener('submit', submitfunc);