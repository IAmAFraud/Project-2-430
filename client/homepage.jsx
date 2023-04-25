// Imports
const helper = require('./helper.js');
const generic = require('./genericElements.jsx');
const React = require('react');
const ReactDOM = require('react-dom');

const displaySearch = (result, type) => {
    console.log(result);

    if (type === '/searchSong') {
        ReactDOM.render(
            <generic.SongList songs={result.searchResult} />,
            document.getElementById('songs')
        );
    }
    else {
        ReactDOM.render(
            <generic.AccountList users={result.searchResult} />,
            document.getElementById('songs')
        );
    }
}

const searchCallback = async (e) => {
    e.preventDefault();
    helper.hideError();

    const search = e.target.querySelector('#searchQuery').value;
    const type = e.target.querySelector('#searchSelect').value
    
    // If missing value, prevent search
    if (!search || !type) {
        helper.handleError('Missing Search Parameter');
    }

    const url = `${type}?search=${search}`;
    
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
    const response = await fetch('/getRandomSongs');
    const docs = await response.json();
    console.log(docs);
    ReactDOM.render(<generic.SongList songs={docs.songs} />, document.getElementById('songs'));
};

const init = async () => {
    ReactDOM.render(
        <generic.SearchBar callback={searchCallback} />,
        document.getElementById('search')
    );
    
    ReactDOM.render(
        <generic.SongList songs={[]} />,
        document.getElementById('songs')
    );

    randomSong();

    result = await generic.checkLogin();

    // Renders the Component to the screen
    ReactDOM.render(
        <generic.AccountDropdown loggedIn={result.loggedIn} username={result.username} />,
        document.getElementById('header')
    );
}


window.onload = init;