// Sets up the Models
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

    return res.json({ redirect: '/maker' });
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
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username Already In Use!' });
    }
    return res.status(500).json({ error: 'An Error Occurred' });
  }
};

// Exports
module.exports = {
  loginPage,
  logout,
  login,
  signup,
};
