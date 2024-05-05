# CSE312 Group Project

## For graders

### installation instructions

- `docker compose up --build`
- Note:
  - frontend is accessible through `localhost:8080` (requirement)
  - backend is accessible through `localhost:9000`
  - MongoDB is accessible through `localhost:27017`

## For developers

### installation instructions

### Frontend installation (first terminal)

- `cd client`
- `npm install && npm start`
- Is accessible through localhost:3000q234
- IMPORTANT: YOU HAVE TO `docker compose up --build` AFTER EVERY CHANGE

### Backend installation (second terminal)

- Open another terminal and `cd server`
- `docker compose up --build`
- Is accessible through localhost:9000
- IMPORTANT: YOU HAVE TO `docker compose up --build` AFTER EVERY CHANGE

### Test examples

- username: `test1`
- password: `QJLFKX12323W123q@`

### Domain Name

# recall312.me

### Ao3 Project 3 feature

Change all text color feature

#### Procedure

in the page left of the make big button there is a color button
click on the color button and ensure that all text on the screen except the image post changes to the color you select

#### tests

Tests
-check that the button text color is changed to ones selected
-check that each chat post text color is changed to one selected
-check that schedule post text color is changed when clicked on the calendar colors should remain defaulted
-check that the schedule post button text color change to one selected
-check that each logout button text is changed to one selected
-check that each like button text color is changed to one selected
-check that each chat post text color is changed to one selected
