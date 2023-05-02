// Imports
const helper = require('./helper.js');
const generic = require('./genericElements.jsx');
const React = require('react');
const ReactDOM = require('react-dom');

// Displays the result of the search to the page
const displaySearch = (result, type) => {
    document.getElementById('searchAlert').classList.add('hidden');
    if (type === '/searchSong') {
        const loggedIn = generic.checkLogin();
        ReactDOM.render(
            <generic.SongList songs={result.searchResult} loggedIn={loggedIn.loggedIn} />,
            document.getElementById('display')
        );

        generic.updateLikedCheckbox();
    }
    else {
        ReactDOM.render(
            <generic.AccountList users={result.searchResult} />,
            document.getElementById('display')
        );
    }
}

const searchCallback = async (e) => {
    e.preventDefault();
    helper.hideError();

    const search = e.target.querySelector('#searchQuery').value;
    const type = e.target.querySelector('#searchSelect').value
    
    // If missing search, just return random songs
    if (!search) {
        return randomSong();
    }

    // If missing type, prevent search
    if (!type) {
        helper.handleError('Missing Search Parameter');
    }

    const url = `${type}?search=${search}`;
    
    document.getElementById('searchAlert').classList.remove('hidden');
    
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    displaySearch(await response.json(), type);
}


// Gets a random song
const randomSong = async () => {
    // Gets the random songs and renders them to the page
    const response = await fetch('/getRandomSongs');
    const docs = await response.json();
    const loginResult = await generic.checkLogin();
    ReactDOM.render(<generic.SongList songs={docs.songs} loggedIn={loginResult.loggedIn}/>, document.getElementById('display'));

    // Updates the checkboxes
    generic.updateLikedCheckbox();
};

const init = async () => {
    ReactDOM.render(
        <generic.SearchBar callback={searchCallback} />,
        document.getElementById('search')
    );
    
    ReactDOM.render(
        <generic.SongList songs={[]} loggedIn='false' />,
        document.getElementById('display')
    );

    randomSong();

    // Renders the Component to the screen
    const loginResult = await generic.checkLogin();
    let isSubscribed = false;
    if (loginResult.loggedIn){
        const response = await fetch('/checkPremium', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();
        isSubscribed = result.subscribed;
    }
    

    ReactDOM.render(
        <generic.AccountDropdown loggedIn={loginResult.loggedIn} username={loginResult.username} subscribed={isSubscribed}/>,
        document.getElementById('header')
    );
}


window.onload = init;