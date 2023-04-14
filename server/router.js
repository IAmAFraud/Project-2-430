// Requires
const controllers = require('./controllers');
const multer = require('multer')
const upload = multer();
const mid = require('./middleware');

// Create the Router Function
const router = (app) => {
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

  // Get Domos
  //app.get('/getDomos', mid.requiresLogin, controllers.Domo.getDomos);

  //app.post('/deleteDomo', mid.requiresLogin, controllers.Domo.deleteDomo);

  // Default Route
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

// exports
module.exports = router;
