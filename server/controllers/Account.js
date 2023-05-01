// Sets up the Models
const { ObjectId } = require('bson');
const models = require('../models');

const { Account } = models;

// Main Page Functions
const loginPage = (req, res) => res.render('login');

// Logout Function
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// Account Functions
const login = (req, res) => {
  // Sets up the Variables
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  // If Variable is Missing
  if (!username || !pass) {
    return res.status(400).json({ error: 'All Fields Are Required!' });
  }

  // Attempts to Authenticate the User
  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong Username Or Password!' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/home' });
  });
};

const signup = async (req, res) => {
  // Sets the Variables
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  // If Variable is Missing
  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All Fields Are Required!' });
  }

  // If Passwords Don't Match
  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords Do Not Match!' });
  }

  // Tries to Create a New User
  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({
      username, password: hash, premiumSubscription: false, numOwnedSongs: 0,
    });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/home' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username Already In Use!' });
    }
    return res.status(500).json({ error: 'An Error Occurred' });
  }
};

// Changes the user's password
const changePassword = (req, res) => {
  // Define the variables
  const { oldPass } = req.body;
  const { newPass } = req.body;
  const { username } = req.body;

  if (!oldPass || !newPass) {
    return res.status(400).json({ error: 'Missing Old or New Password' });
  }

  // Attempts to Authenticate the User
  return Account.authenticate(username, oldPass, async (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong password!' });
    }

    // Tries to Create a New User
    try {
      const hash = await Account.generateHash(newPass);
      const tempAccount = account;
      tempAccount.password = hash;
      await tempAccount.save();
      req.session.account = Account.toAPI(account);
      return res.json({ redirect: '/home' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'An Error Occurred' });
    }
  });
};

// Checks if the user is loggedin
const checkLogin = (req, res) => {
  let responseJson;
  if (req.session.account) {
    responseJson = {
      loggedIn: true,
      username: req.session.account.username,
    };
  } else {
    responseJson = {
      loggedIn: false,
    };
  }

  return res.json(responseJson);
};

// Performs a search for accounts that have the search param in their name
const searchAccount = async (req, res) => {
  // Check if params are present
  if (!req.query.search) {
    return res.status(400).json({ error: 'Missing Search Parameter' });
  }

  let docs;

  // Creates the regex param
  const regexExpression = new RegExp(req.query.search, 'gi');

  try {
    const query = { username: { $regex: regexExpression } };
    docs = await Account.find(query);
    return res.json({ searchResult: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json('Error Searching Database');
  }
};

// Checks if a user has liked a song
const checkLiked = async (req, res) => {
  if (!req.query.id) {
    return res.status(400).json({ error: 'Missing Song Id' });
  }

  let doc;

  try {
    // Looks for the liked song
    const query = { username: req.session.account.username };
    doc = await Account.findOne(query);
    const id = new ObjectId(req.query.id);
    const song = doc.likedSongs.indexOf(id);

    // Prepares the response
    const responseJson = {
      result: true,
    };
    if (song === -1) {
      responseJson.result = false;
    }

    // Returns the result
    return res.json({ responseJson });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error Communicating With Database' });
  }
};

// Updates what songs a user has liked
const updateLiked = async (req, res) => {
  if (!req.body.id || req.body.checked === null) {
    console.log(req.body.checked);
    return res.status(400).json({ error: 'Missing Song ID or Checked Status' });
  }

  const query = { username: req.session.account.username };

  try {
    const userAccount = await Account.findOne(query);
    if (req.body.checked) {
      userAccount.likedSongs.push(req.body.id);
      await userAccount.save();
      return res.json({ message: 'Successfully Added Liked Song' });
    }
    const id = new ObjectId(req.body.id);
    const index = userAccount.likedSongs.indexOf(id);
    userAccount.likedSongs.splice(index, 1);
    await userAccount.save();
    return res.json({ message: 'Successfully Removed Liked Song' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Issue Communicating With Server' });
  }
};

// Returns all of the songs liked by a user
const getLikedSongs = async (req, res) => {
  const query = { username: req.session.account.username };
  let doc;

  try {
    doc = await Account.findOne(query).select('likedSongs').exec();
    return res.json({ ids: doc });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Problem Communicating With Server' });
  }
};

// Updates whether an account has a premium subscription
const updatePremium = async (req, res) => {
  if (req.body.subscribed === null) {
    return res.status(400).json({ error: 'Missing Subscribed Parameter' });
  }

  const query = { username: req.session.account.username };
  let doc;

  try {
    doc = await Account.findOne(query);
    doc.premiumSubscription = req.body.subscribed;
    await doc.save();
    return res.json({ subscribed: doc.premiumSubscription });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Problem Communicating With Database' });
  }
};

// Checks if the user has a premium subscription
const checkPremium = async (req, res) => {
  const query = { username: req.session.account.username };
  let doc;

  try {
    doc = await Account.findOne(query).select('premiumSubscription').exec();
    return res.json({ subscribed: doc.premiumSubscription });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Problem Communicating With Database' });
  }
};

// Exports
module.exports = {
  loginPage,
  logout,
  login,
  signup,
  changePassword,
  checkLogin,
  searchAccount,
  checkLiked,
  updateLiked,
  getLikedSongs,
  updatePremium,
  checkPremium,
};
