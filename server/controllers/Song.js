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

    try{
        const newSong = new Song(songData);
        newSong.save();
        return res.status(201).json({filename: newSong.filename});
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: 'Error Saving Song!'});
    }
  };  

  // Function to get all the ids of a user's songs
  const retrieveUser = async (req, res) => {
    try{
        const query = {owner: req.session.account._id };
        const docs = await Song.find(query).select('_id').exec();

        return res.json({songs: docs});
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: 'Error When Retrieving Id\'s'})
    }
  };



  // Load Song Function
  const retrieveSong = async (req, res) => {  
    if (!req.query._id){
        return res.status(400).json({error: 'ID Not Provided'})
    }

    let doc;
  
    try{
      const query = {_id: req.query._id };
      doc = await Song.findOne(query);
    } catch (err){
      console.log(err);
      return res.status(500).json({error: 'Error Retrieving File!'});
    }
  
    if (!doc){
      return res.status(404).json({error: 'File Not Found!'});
    }
  
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': doc.size,
      'Content-Disposition': `filename="${doc.name}"`,
    });
  
    return res.send(doc.data);
  };
  
  // Exports
  module.exports = {
    homePage,
    accountPage,
    saveSong,
    retrieveUser,
    retrieveSong,
  };