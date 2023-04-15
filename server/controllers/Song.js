// Requires
const models = require('../models');

const { Song } = models;

// Renders the Homepage
const homePage = async (req, res) => res.render('homepage');

// Renders an account page
const accountPage = async (req, res) => res.render('account');


const saveSong = async (req, res) => {
    // Checks if a file was provided
    if(!req.file) {
        return res.status(400).json({error: 'Missing File'});
    }

    // Checks if the file is an MP3
    if (req.file.mimetype !== 'audio/mpeg') {
        return res.status(400).json({error: 'Invalid File Type'});
    }

    // Creates a data file from the Multer Upload
    const songData = { 
        filename: req.file.originalname,
        data: req.file.buffer,
        size: req.file.size,
        owner: req.session.account._id,
    };

    console.log(songData);

    try{
        const newSong = new Song(songData);
        newSong.save();
        return res.status(201).json({filename: newSong.filename});
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: 'Error Saving Song!'});
    }


    //console.log(req.file);

  };  
  
  // Exports
  module.exports = {
    homePage,
    accountPage,
    saveSong,
  };