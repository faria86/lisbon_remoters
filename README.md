# lisbon_remoters

Node.js project description:

Scope: web application for logged users to add places is Lisbon to work remotely.

Structure: 

Models (schemas):

User: name, email, password.

Place: title, location, creator (reference to user), coordinates, timestamps.

====

Routes:

- Authentication: GET & POST for sign-in and sign-up.

- Index: GET for homepage.

- Place: GET list of all places, GET & POST to create place (with route Guard to prevent unregistered users to create).

===

Views: 

- Sign-in and sign-up forms.

- Private: for user logged in.

- Error: display errors.

Place: 

- list; 
- single view (with edit and delete buttons if creator = user.id); 
- create; 
- edit.

===

Note: 

- Google API to show all places in the map with markers.

- npm packages: 
bycript to hash passwords.
node sass middleware.
cloudinary (upload photos).

- MongoDB database.

- Deploy on Heroku.
