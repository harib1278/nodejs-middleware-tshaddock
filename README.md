## Thomas Shaddock - Enterprise Computing Bookface Project ##  
  
  
## Project setup instructions ##  
  
## To start demon:  
run /bin/mongod   
  
## If using command line:  
run /bin/mongo to login to instance  
  
## set up database and collections:  
show dbs  
> use loginapp  
> db.createCollection('users');  
> db.createCollection('authors');  
> show collections  
   
## Verify you can see:  
users  
authors  
  
## Install dependencies
composer install
-- To get and install composer go to: https://getcomposer.org/  
   
## Start the application servers  
node app  
-- To get and install nodejs go to: https://nodejs.org/en/  
  
## Verify you can see:  
Middleware server running on port 3001  
App server running on port 3000  
  
## Project Log ##  
  
This application follows a simple architecture and is made up of two componenent servers, one a webserving application server operating on port 3000 and the other an API middleware layer server operating on port 3001. This decision was undertaken in order to mimic a middleware architecture that one may see in a larger scale organisation (in this case it is only a small example of a much large concept).
  
The project will spin up two these two different connected servers, the web application server will process the website requests, user interaction (e.g login) and display content while the API server is responsible for serving and updating Author + Book information.
  
The user is expected to create an account using an email address and username/password combination. Once the account is created, the user can the login to the application and see their dashboard. The dashboard displays the stored books and controls for adding new authors, new books and for writing comments on books.  
  
- To create a new author just click the 'add new author' button on the dashboard, a dialogue box will pop up and the information is entered in there. Click ok to save.  
- To add new books just click the 'add new book' button that comes up on the new author on the dashboard - fill in the dialogue box and click save.  
- Comments are viewed by clicking the 'comments' button that comes up on the indvidual books. You can add a new comment by filling in the comment box on the dialogue box that is displayed.  
- Books are favorited simply by clicking the star icon that is displayed on each book, when the book is favorited the star will turn black.  
  
# Security    
A number of security measures have been taken when coding this project, firstly the use of complex 1 way hashing and salting on the user passwords using the passport module. This makes the storage of user passwords much safer - if say the database is hacked the passwords will still be encrypted.  
  
As the API server was on a different port, the use of the CORS (Cross-origin resource sharing) module was needed to allow the main application to call the API and then consume the data and allow for submissions to the API.
  
It is assumed that the middleware API if ran on a different server will be whitelisted when the main application server is accessing it. It is for this reason that authorisation was not required for the api access.
  
# Design  
The overall project utilises a simple but very intuitive UI design, this has been designed this was very carefully to give the best possible user experience when using the project. A number of important design ideas have been followed:  
 - The small number of pages makes for simple navigation of the application.  
 - The index page has been reused for the dashboard  
 - The user login and the dashboard contains the entire author and book objects along with all of the necessary controls to operate the application.  
  
The UI design comes from a Bootstrap template called 'FreeLancer', it can be downloaded for free here: https://blackrockdigital.github.io/startbootstrap-freelancer/  
  
# Routing  
- GET /authors - responsible for loading the author and book information into the dashboard  
- POST /authors/add - responsible for adding new authors to the database  
- PUT /author/adbook - responsible for adding a book to an author object  
- PUT /author/book/addcomment - responsible for adding a comment to a book object  
- PUT /author/book/addfavorite - responsible for adding a user favorite option to a book object (not working correctly)  
  
# Problems  
- Initially until discovering the CORS module I had lots of problems with accessing API data from the main application server.  
- The user login and register functionality was by far the hardest part of this entire project and thus consumed the overwhelming amount of time spent. I didn't really feel the course prepared me for the complexity of doing this in nodejs - I had to teach myself the entire thing instead.  
- I ran out of time when debugging the last route (the favoriting mechanism), I left the mostly complete code in anyway for the marker to reference, I was trying to save the unique username to the BookRating attribute of the Book object. The page then on load would have cross referenced this with username of the logged in user, if they matched then the start of the favoited book would be coloured black to indicate the book was a favorite and had been loaded from a saved choice.  
  
# Conclusions  
This project took an overwhelming amount of time to complete, I had lots of issues with the amount of time commited to this project and it was a struggle to juggle around my other Uni and Work commitments. It was mostly the sheer amount that I had to teach myself to complete it to a semi satisfactory standard - had I not had quite a bit of javascript experience outside of Birkbeck I do not think this project could have been completed.  
  
Overall it was a good learning project and I now feel I have a solid grip of what coding middleware applications on nodeJs encompasses.  
  
## composer dependencies:  
"bcryptjs": "*",  
"body-parser": "*",  
"connect-flash": "*",  
"cookie-parser": "^1.4.3",  
"cors": "^2.7.1",   
"express": "*",  
"express-handlebars": "*",  
"express-messages": "*",  
"express-session": "*",  
"express-validator": "*",  
"moment": "^2.17.1",  
"mongodb": "*",  
"mongoose": "*",  
"noty": "^2.4.1",  
"passport": "*",  
"passport-http": "*",  
"passport-local": "*",  
"path-to-regexp": "^1.7.0"  
  
## Data example:  
Author and Book:  
```json
{  
	"_id" : ObjectId("5918838a0466c929ece3e39d"),  
	"authName" : "Book",   
	"authDescription" : "This is a book",  
	"authBooks" : [   
		{  
			"bookDescription" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed porta ligula vel sodales porta. Etiam tempor leo ipsum.",  
			"bookName" : "Book title",  
			"_id" : ObjectId("591883960466c929ece3e39e"),  
			"bookRating" : {  
				"user" : "Jimbo Jones"  
			},  
			"bookComments" : [  
				{  
					"user" : "Jimbo Jones",  
					"comment" : "Great book - favoriting this!",  
					"_id" : ObjectId("591886c1a46ae3344cb04854"),  
					"time" : ISODate("2017-05-14T16:33:05.733Z")  
				}  
			]  
		}  
	],  
	"__v" : 0  
}  
```

  
User:  
```json

{  
	"_id" : ObjectId("58835cc2360fa82a6c5bdede"),  
	"name" : "Jimbo Jones",  
	"email" : "jimjones@email.com",  
	"username" : "jimbob",  
	"password" : "$2a$10$4iA7tkJnxbMNtcnZvtTiL.8MhAW0vdLZ4HCMqbfyUcITPjxboGOiS",  
	"__v" : 0  
}  
```
