
const quotes = [
    {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
    },
    {
        text: "Life is what happens when you're busy making other plans.",
        author: "John Lennon"
    },
    {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt"
    },
    {
        text: "Whoever is happy will make others happy too.",
        author: "Anne Frank"
    },
    {
        text: "You only live once, but if you do it right, once is enough.",
        author: "Mae West"
    },
    {
        text: "In the end, it's not the years in your life that count. It's the life in your years.",
        author: "Abraham Lincoln"
    },
    {
        text: "Life is either a daring adventure or nothing at all.",
        author: "Helen Keller"
    },
    {
        text: "Many of life's failures are people who did not realize how close they were to success when they gave up.",
        author: "Thomas A. Edison"
    },
    {
        text: "If you want to live a happy life, tie it to a goal, not to people or things.",
        author: "Albert Einstein"
    },
    {
        text: "Never let the fear of striking out keep you from playing the game.",
        author: "Babe Ruth"
    }
];

const quoteTextElement = document.getElementById('quote-text');
const quoteAuthorElement = document.getElementById('quote-author');
const newQuoteButton = document.getElementById('new-quote');
const saveQuoteButton = document.getElementById('save-quote');
const saveIcon = document.getElementById('save-icon');
const toggleFavoritesButton = document.getElementById('toggle-favorites');
const favoritesSidebar = document.getElementById('favorites-sidebar');
const closeFavoritesButton = document.getElementById('close-favorites');
const favoritesList = document.getElementById('favorites-list');

let currentQuote = null;
let favorites = [];

function init() {
    loadFavorites();
    displayRandomQuote();
    renderFavorites();
    
    newQuoteButton.addEventListener('click', displayRandomQuote);
    saveQuoteButton.addEventListener('click', toggleFavorite);
    toggleFavoritesButton.addEventListener('click', () => {
        favoritesSidebar.classList.add('show');
    });
    closeFavoritesButton.addEventListener('click', () => {
        favoritesSidebar.classList.remove('show');
    });
}

function loadFavorites() {
    const savedFavorites = localStorage.getItem('favoriteQuotes');
    if (savedFavorites) {
        const lines = savedFavorites.split('\n');
        for (let i = 0; i < lines.length; i += 2) {
            if (lines[i] && lines[i + 1]) {
                favorites.push({
                    text: lines[i],
                    author: lines[i + 1]
                });
            }
        }
    }
}


function saveFavorites() {
    let favoritesString = '';
    favorites.forEach(quote => {
        favoritesString += `${quote.text}\n${quote.author}\n`;
    });
    localStorage.setItem('favoriteQuotes', favoritesString);
}


function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    currentQuote = quotes[randomIndex];
    
    quoteTextElement.textContent = currentQuote.text;
    quoteAuthorElement.textContent = `— ${currentQuote.author}`;
    
    updateSaveButton();
}


function toggleFavorite() {
    if (!currentQuote) return;
    
    const index = findQuoteIndex(currentQuote);
    
    if (index === -1) {
        favorites.push(currentQuote);
        saveIcon.textContent = '♥';
        saveQuoteButton.classList.add('saved');
    } else {
        favorites.splice(index, 1);
        saveIcon.textContent = '♡';
        saveQuoteButton.classList.remove('saved');
    }
    
    saveFavorites();
    renderFavorites();
}


function findQuoteIndex(quote) {
    for (let i = 0; i < favorites.length; i++) {
        if (favorites[i].text === quote.text && favorites[i].author === quote.author) {
            return i;
        }
    }
    return -1;
}


function updateSaveButton() {
    if (!currentQuote) return;
    
    const isFavorite = findQuoteIndex(currentQuote) !== -1;
    
    saveIcon.textContent = isFavorite ? '♥' : '♡';
    if (isFavorite) {
        saveQuoteButton.classList.add('saved');
    } else {
        saveQuoteButton.classList.remove('saved');
    }
}


function renderFavorites() {
    favoritesList.innerHTML = '';
    
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p>No favorite quotes yet. Save some quotes to see them here!</p>';
        return;
    }
    
    favorites.forEach((quote, index) => {
        const favoriteItem = document.createElement('div');
        favoriteItem.className = 'favorite-item';
        
        favoriteItem.innerHTML = `
            <div class="favorite-quote">${quote.text}</div>
            <div class="favorite-author">— ${quote.author}</div>
            <button class="remove-favorite" data-index="${index}">Remove</button>
        `;
        
        favoritesList.appendChild(favoriteItem);
    });
    
    document.querySelectorAll('.remove-favorite').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            favorites.splice(index, 1);
            saveFavorites();
            renderFavorites();
            
            if (currentQuote && findQuoteIndex(currentQuote) === index) {
                updateSaveButton();
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', init);