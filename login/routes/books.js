var express = require("express");
var bodyParser = require("body-parser");

var app = express();

var books = [
	{
		"author": "BILL SHANKS",
		"books": {
			"1": {
				"title": "My Book",
				"comments": {
					"1": {
						"user": "Ben",
						"comment": "Cool"
					},
					"2": {
						"user": "Jim",
						"comment": "Not Cool"
					}
				}
			},
			"2": {
				"title": "My Book",
				"comments": {
					"1": {
						"user": "Ben",
						"comment": "Cool"
					},
					"2": {
						"user": "Jim",
						"comment": "Not Cool"
					}
				}
			}
		}

	}
];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(function(req, res, next) {
	console.log(`${req.method} request for '${req.url}' - ${JSON.stringify(req.body)}`);
	next();
});

app.use(express.static("./public"));

app.get("/books", function(req, res) {
	res.json(books);
});

app.post("/books" , function(req, res){
    skierTerms.push(req.body);
    res.json(books);
});

app.delete("/books/:author", function(req, res){
    books = books.filter(function(definition){
        return definition.term.toLowerCase() !== req.params.term.toLowerCase();
    });
    res.json(books);
});


app.listen(3001);

console.log("Middleware app running on port 3001");

module.exports = app;