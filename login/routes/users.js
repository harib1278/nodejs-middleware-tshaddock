var express = require('express');
var router = express.Router();

//Load the registery
router.get('/register', function(req, res){
	//render the register view
	res.render('register');
});

//Load the login route
router.get('/login', function(req, res){
	//render the login view
	res.render('login');
});

module.exports = router;