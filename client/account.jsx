// Imports
const helper = require('./helper.js');
const generic = require('./genericElements.jsx');
const React = require('react');
const ReactDOM = require('react-dom');

const handleSong = async (e) => {
    // Prevent Default and Hide Error Message
    e.preventDefault();
    helper.hideError();

    const response = await fetch('/songUp', {
        method: 'POST',
        body: new FormData(e.target),
    });

    return false;

    /*
    // Gets the Parameters
    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const job = e.target.querySelector('#domoJob').value;

    // If There is a Missing Parameter
    if (!name || !age || !job) {
        helper.handleError('All Fields Are Required!');
        return false;
    }

    // Sends the Post
    helper.sendPost(e.target.action, {name, age, job}, loadDomosFromServer);
    return false;
    */
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
            <input type='file' name='songFile' />
            <input type='submit' value='Upload Song!' />
        </form>
    );
    
};

// Song List Component
const SongList = (props) => {
    // If there are no Songs
    if(props.songs.length === 0){
        return (
            <div className='songList'>
                <h3 className='emptySong'>No Songs Yet!</h3>
            </div>
        );
    }

    console.log(props.owner)

    // Maps the Songs to a Div
    const songNodes = props.songs.map(song => {
        return(
            <div key={song._id} className='song'>
                <h3 className='SongName'>Name: {song.filename}</h3>
                <audio controls src={'/retrieve?_id=' + song._id} />
                {props.owner &&
                    <button hidden={props.owner} className='delete' type='button' onClick={async () => {
                        const response = await fetch('/deleteDomo', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({id: domo._id}),
                        });
                        loadSongsFromServer();
                    }}>Delete</button>
                }
            </div>
        );
    });
    

    // Calls the Above Function
    return(
        <div className='songList'>
            {songNodes}
        </div>
    );
};

// Loads Domos From a Server and Renders a DomoList component
const loadSongsFromServer = async () => {
    const response = await fetch(`/retrieveUser${window.location.search}`);
    const data = await response.json();
    if (data.redirect){
        return window.location.href = data.redirect;
    }

    if (data.error){
        return helper.handleError(data.error);
    }

    ReactDOM.render(
        <SongList songs={data.songs} owner={data.owner} />, document.getElementById('userContent')
    );
};

// Init
const init = () => {
    ReactDOM.render(
        <SongForm />,
        document.getElementById('userData')
    );

    ReactDOM.render(
        <SongList songs={[]} />,
        document.getElementById('userContent')
    );

    loadSongsFromServer();

    result = generic.checkLogin();

    // Renders the Component to the screen
    ReactDOM.render(
        <generic.AccountDropdown loggedIn={result.loggedIn} username={result.username} />,
        document.getElementById('header')
    );
};

window.onload = init;