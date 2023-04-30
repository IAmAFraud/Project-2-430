// Requires
const multer = require('multer');
const controllers = require('./controllers');

const upload = multer();
const mid = require('./middleware');

// Create the Router Function
const router = (app) => {
  // Homepage Routes
  app.get('/home', controllers.Song.homePage);
  app.get('/getRandomSongs', controllers.Song.getRandomSong);

  // Login/Signup/Password Change Routes
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/changePass', mid.requiresSecure, mid.requiresLogin, controllers.Account.loginPage);
  app.post('/changePass', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePassword);

  // Account Page Routes
  app.get('/account', controllers.Song.accountPage);
  app.get('/retrieveUser', controllers.Song.retrieveUserSongs);
  app.get('/retrieve', controllers.Song.retrieveSong);

  app.post('/songUp', mid.requiresLogin, upload.single('songFile'), controllers.Song.saveSong);
  app.post('/deleteSong', mid.requiresLogin, controllers.Song.deleteSong);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  // Liked Songs Routes
  app.get('/checkLike', mid.requiresLogin, controllers.Account.checkLiked);
  app.get('/likedSongs', mid.requiresLogin, controllers.Account.getLikedSongs);
  app.get('/getSongName', controllers.Song.getSongName);
  app.post('/updateLiked', mid.requiresLogin, controllers.Account.updateLiked);

  // Account Verification Route
  app.get('/checkLogin', controllers.Account.checkLogin);

  // Search Routes
  app.get('/searchSong', controllers.Song.searchSong);
  app.get('/searchUser', controllers.Account.searchAccount);

  // Default Route
  app.get('/', controllers.Song.homePage);

  /*
  // Login Routes
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  // Signup Routes
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  // Logout Routes
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  // Maker Routes
  app.get('/maker', mid.requiresLogin, controllers.Song.homePage);
  app.post('/maker', mid.requiresLogin, upload.single('songFile'), controllers.Song.saveSong);

  app.get('/account', mid.requiresLogin, controllers.Account.accountPage);
  */

  // Get Domos
  // app.get('/getDomos', mid.requiresLogin, controllers.Domo.getDomos);

  // app.post('/deleteDomo', mid.requiresLogin, controllers.Domo.deleteDomo);
};

// exports
module.exports = router;
