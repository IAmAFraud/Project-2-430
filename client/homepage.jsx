// Imports
const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

// Account Navigation Component









// Song List Component
const SongList = (props) => {
    console.log(props.songs);

    // If there are no songs found
    if(props.songs.length === 0){
        return (
            <div className='songList'>
                <h3 className='emptySong'>No Songs Yet!</h3>
            </div>
        );
    }

    // Maps the song to elements
    const songNodes = props.songs.map(song => {
        return(
            <div key={song._id} className='song'>
                <audio src={'/retrieve?_id=' + song._id} />
            </div>
        );
    });

    // Calls songNodes
    return(
        <div className='songList'>
            {songNodes}
        </div>
    );
};


// Gets a random song
const randomSong = async () => {
    const response = await fetch('/getRandomSongs');
    const docs = await response.json();
    console.log(docs.songs[0]._id);
    ReactDOM.render(<SongList songs={[docs]} />, document.getElementById('songs'));
}


const init = () => {
    ReactDOM.render(
        <SongList songs={[]} />,
        document.getElementById('songs')
    );

    randomSong();
}


window.onload = init;