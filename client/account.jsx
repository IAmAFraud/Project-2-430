// Imports
const helper = require('./helper.js');
const generic = require('./genericElements.jsx');
const React = require('react');
const ReactDOM = require('react-dom');
const { result } = require('underscore');

// Displays the Search Results on the Webpage
const displaySearch = (result, type) => {
    if (type === '/searchSong') {
        ReactDOM.render(
            <generic.SongList songs={result.searchResult} />,
            document.getElementById('userContent')
        );
    }
    else {
        ReactDOM.render(
            <generic.AccountList users={result.searchResult} />,
            document.getElementById('userContent')
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


const handleSong = async (e) => {
    // Prevent Default and Hide Error Message
    e.preventDefault();
    helper.hideError();

    const uploadResponse = await fetch('/songUp', {
        method: 'POST',
        body: new FormData(e.target),
    }); 

    const uploadResult = await uploadResponse.json();
    
    if (uploadResult.error) {
        helper.handleError(uploadResult.error);
    }

    const pageUser = window.location.search.split('=')[1];
    const result = await generic.checkLogin();
    loadSongsFromServer(pageUser, result.loggedIn);

    return false;
};

// Song Upload Component
const SongForm = (props) => {
    return(
        <form id='uploadForm'
            onSubmit={handleSong}
            name='uploadForm'
            action='/songUp'
            method='POST'
            className='uploadForm'
            encType='multipart/form-data'
        >
            <input id='fileUpload' type='file' name='songFile' />
            <label htmlFor='fileName'>Song Name:</label>
            <input id='fileNameInput' type='text' name='fileName' placeholder='Song Name' />
            <input className='uploadSongSubmit' type='submit' value='Upload Song!' />
        </form>
    );
    
};

// Song List Component
const SongList = (props) => {    
    // If there are no Songs
    if(props.songs.length === 0){
        return (
            <div className='songList'>
                <h1>User: {window.location.search.split('=')[1]}</h1>
                <h3 className='emptySong'>No Songs Yet!</h3>
            </div>
        );
    }

    // Maps the Songs to a Div
    const songNodes = props.songs.map(song => {
        return(
            <div key={song._id} className='song'>
                {!song.name ? 
                    <h3 className='songName'>Song Has Been Deleted</h3> : 
                    <h3 className='songName'>Name: {song.name}</h3>
                }
                {!song.name ?
                    <audio controls src='' /> :
                    <audio controls src={'/retrieve?_id=' + song._id} />
                }
                
                {props.loggedIn &&
                    <label for='like'>Like: </label> 
                }
                {props.loggedIn &&
                    <input id={song._id} class='liked' type='checkbox' onChange={(e) => {
                        const id = song._id;
                        const checked = e.target.checked;
                        helper.sendPost('/updateLiked', {id, checked});
                    }} /> 
                }
                {props.owner !== 'false' &&
                    <button hidden={props.owner} className='delete' type='button' onClick={async () => {
                        // Deletes the song from the database
                        const response = await fetch('/deleteSong', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({id: song._id}),
                        });

                        const pageUser = window.location.search.split('=')[1];
                        const result = await generic.checkLogin();
                        loadSongsFromServer(pageUser, result.loggedIn);
                    }}>Delete</button>
                }
            </div>
        );
    });
    

    // Calls the Above Function
    return(
        <div className='songList'>
            <h1>User: {window.location.search.split('=')[1]}</h1>
            {songNodes}
        </div>
    );
};

// Loads Songss From a Server and Renders a SongList component
const loadSongsFromServer = async (user, _loggedIn) => {
    const response = await fetch(`/retrieveUser${window.location.search}`);
    const data = await response.json();
    if (data.redirect){
        return window.location.href = data.redirect;
    }

    if (data.error){
        return helper.handleError(data.error);
    }

    ReactDOM.render(
        <SongList songs={data.songs} owner={data.owner} loggedIn={_loggedIn}/>, document.getElementById('userContent')
    );

    // Updates the checkboxes
    generic.updateLikedCheckbox();
};

// Loads the songs to the page from the page
const loadAccountSongs = async (e) => {
    e.preventDefault();
    helper.hideError();

    // Loads the user's songs to the page
    const result = await generic.checkLogin();
    const pageUser = window.location.search.split('=')[1];

    loadSongsFromServer(pageUser, result.loggedIn);
};

// Loads in the users liked songs
const loadLikedSongs = async (e) => {
    e.preventDefault();
    helper.hideError();

    const response = await fetch('/likedSongs', {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
        }
    });
    const resJson = await response.json();

    const songInfo = [];
    for (let i = 0; i < resJson.ids.likedSongs.length; i++) {
        const nameResponse = await fetch(`/getSongName?id=${resJson.ids.likedSongs[i]}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
            }
        });
        const nameResJson = await nameResponse.json();

        songInfo.push({_id: resJson.ids.likedSongs[i], name: nameResJson.songName});
    }

    ReactDOM.render(
        <SongList songs={songInfo} owner='false' loggedIn='true' />, document.getElementById('userContent')
    );

    generic.updateLikedCheckbox();
}

// Init
const init = async () => {
    // Checks if the user is logged in
    const loginResult = await generic.checkLogin();
    const account = window.location.search.split('=')[1];

    // Adds Functions to the Nav Buttons
    const mySongsBtn = document.getElementById('accountSongsButton');
    const likedSongsBtn = document.getElementById('likedSongsButton');

    mySongsBtn.addEventListener('click', loadAccountSongs);
    if (!loginResult.loggedIn || account !== loginResult.username) {
        likedSongsBtn.classList.add('hidden');
    }
    likedSongsBtn.addEventListener('click', loadLikedSongs);
    
    // Renders the Search Bar
    ReactDOM.render(
        <generic.SearchBar callback={searchCallback} />,
        document.getElementById('search')
    );

    // Tests if the user is logged in and logged into their own account
    const pageUser = window.location.search.split('=')[1];

    if (loginResult.loggedIn && pageUser === loginResult.username){
        ReactDOM.render(
            <SongForm />,
            document.getElementById('userData')
        );
    }

    // Loads in the user's songs
    ReactDOM.render(
        <SongList songs={[]} />,
        document.getElementById('userContent')
    );

    loadSongsFromServer(pageUser, loginResult.loggedIn);

    let isSubscribed = false;
    if (loginResult.loggedIn) {
        // Renders the Component to the screen
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
};

window.onload = init;