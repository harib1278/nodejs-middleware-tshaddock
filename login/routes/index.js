var express = require('express');
var router = express.Router();

//Load the home page
router.get('/', ensureAuthenticated, function(req, res){
	//render the index view
	res.render('index');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg', 'Sorry, you have not logged in.');
		res.redirect('/users/login');
	}
}

module.exports = router;