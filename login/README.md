## Thomas Shaddock - Enterprise Computing Bookface Project ##  
  
  
## Project setup instructions ##  
  
## to start demon:  
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
  
## Project Log ##  
  
-- middleware
-- two apps
-- book data thorugh api
-- security
-- cors module
-- ui design
-- project routing design
-- problems
-- conclusions