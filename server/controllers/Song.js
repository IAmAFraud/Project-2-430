// Requires
const models = require('../models');

const { Song } = models;

// Renders the Homepage
const homePage = async (req, res) => res.render('homepage');

// Renders an account page
const accountPage = async (req, res) => res.render('account');

// Get random song(s)
const getRandomSong = async (req, res) => {
  try {
    const docs = await Song.aggregate([{ $sample: { size: 2 } }]);

    return res.json({ songs: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error Finding Songs' });
  }
};

const saveSong = async (req, res) => {
  // Checks if a file was provided
  if (!req.file || !req.body.fileName) {
    return res.status(400).json({ error: 'Missing File or Filename' });
  }

  // Checks if the file is an MP3
  if (req.file.mimetype !== 'audio/mpeg') {
    return res.status(400).json({ error: 'Invalid File Type' });
  }

  // Creates a data file from the Multer Upload
  const songData = {
    name: req.body.fileName,
    filename: req.file.originalname,
    data: req.file.buffer,
    size: req.file.size,
    owner: req.session.account.username,
  };

  try {
    const newSong = new Song(songData);
    newSong.save();
    return res.status(201).json({ filename: newSong.filename });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error Saving Song!' });
  }
};

// Function to get all the ids of a user's songs
const retrieveUserSongs = async (req, res) => {
  let user;
  if (!req.query.user && req.session.account) {
    user = '';
    return res.json({ redirect: `/account?user=${req.session.account.username}` });
  }
  user = req.query.user;

  if (!user) {
    return res.status(400).json({ error: 'No User Provided' });
  }

  let owner = false;
  if (req.session.account && (req.session.account.username === user)) {
    owner = true;
  }

  try {
    const query = { owner: user };
    const docs = await Song.find(query).select('_id name').exec();

    return res.json({ songs: docs, owner });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error When Retrieving Id\'s' });
  }
};

// Load Song Function
const retrieveSong = async (req, res) => {
  if (!req.query._id) {
    return res.status(400).json({ error: 'ID Not Provided' });
  }

  let doc;

  try {
    const query = { _id: req.query._id };
    doc = await Song.findOne(query);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error Retrieving File!' });
  }

  if (!doc) {
    return res.status(404).json({ error: 'File Not Found!' });
  }

  res.set({
    'Content-Type': 'audio/mpeg',
    'Content-Length': doc.size,
    'Content-Disposition': `filename="${doc.filename}"`,
  });

  return res.send(doc.data);
};


const searchSong = async (req, res) => {
  // Check if params are present
  if (!req.query.search) {
    return res.status(400).json({ error: 'Missing Search Parameter' });
  }

  let docs;

  // Creates the regex param
  const regexExpression = new RegExp(req.query.search, 'gi');

  try {
    const query = {name: {$regex: regexExpression}};
    docs = await Song.find(query);
    return res.json({ searchResult: docs});
  } catch (err) {
    console.log(err);
    return res.status(500).json('Error Searching Database');
  }
};


// Exports
module.exports = {
  homePage,
  accountPage,
  getRandomSong,
  saveSong,
  retrieveUserSongs,
  retrieveSong,
  searchSong,
};
