// Imports
const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

// Account Navigation Component









// Song List Component
const SongList = (props) => {
    // If there are no songs found
    if(props.songs.length === 0){
        return (
            <div className='songList'>
                <h3 className='emptySong'>No Songs Yet!</h3>
            </div>
        );
    }

    // Maps the song to elements
    const songNodes = props.domos.map(song => {
        <div key={song._id} className='song'>
            
        </div>
    });
};





const init = () => {

}


window.onload = init;