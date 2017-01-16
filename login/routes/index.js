var express = require('express');
var router = express.Router();

//Load the home page
router.get('/', function(req, res){
	//render the index view
	res.render('index');
});

module.exports = router;