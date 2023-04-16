// Imports
const helper = require('./helper.js');
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

// Domo Form Component
const SongForm = (props) => {
    return(
        /*
        <form id='domoForm'
            onSubmit={handleDomo}
            name='domoForm'
            action='/maker'
            method='POST'
            className='domoForm'
        >
            <label htmlFor='name'>Name: </label>
            <input id='domoName' type='text' name='name' placeholder='Domo Name' />
            <label htmlFor='age'>Age: </label>
            <input id='domoAge' type='number' min='0' name='age' />
            <label htmlFor='job'>Job: </label>
            <input id='domoJob' type='text' name='job' placeholder='Domo Job' />
            <input className='makeDomoSubmit' type='submit' value='Make Domo' />
        </form>
        */

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

    // Maps the Songs to a Div
    const songNodes = props.songs.map(song => {
        return(
            <div key={song._id} className='song'>
                <h3 className='SongName'>Name: {domo.name}</h3>
                <audio controls src={'/retrieve?_id=' + song._id} />
                <button className='delete' type='button' onClick={async () => {
                    const response = await fetch('/deleteDomo', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({id: domo._id}),
                    });
                    //loadDomosFromServer();
                }}>Delete</button>
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
    const response = await fetch('/retrieveUser');
    const data = await response.json();
    console.log(data);
    ReactDOM.render(
        <SongList songs={data.songs} />, document.getElementById('userContent')
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
};

window.onload = init;