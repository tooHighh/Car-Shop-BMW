# Car-Rental

## Project overview
A small full stack project that is composed of a public folder that contains all the frontend files (html/css/js) and a nodeJs folder that contains all the backend files (nodeJs). The shop consists of a home page where all the users (logged or not) have access to it. After logging in or signing up the user will be redirected to a similar page like the home page but with some additional features (add car to shopping cart, adjust user profile, adjust cart, checkout). This projects uses pure js to dynamically fetch the cars, user profile data and the choices of the user (using JWT and cookies), nodeJS to retrieve data from the database (mysql), and finally sending an email when submitting the checkout.

>[!warning]
>The project misses alot of things that will be discussed later.
>When submitting the checkout none of your data is saved nor used (mock submit).

## Requirements

### First step: initialize npm

``` npm init -y ```

To load the package.json containing all the dependencies.

### Second step: install all the dependencies needed

``` npm mysql2 express socket.io dotenv ```

To install all the dependencies needed to run the code.

### Third step: launch the server

``` node server.js (nodemon server.js if downloaded) ```

To run the server that serves the index.html and achieve many tasks.

> [!NOTE]
> The steps above require installing nodeJs on your machine.
> Also do not forget to put all your private infos in a .env file.

## Future goals

- Make the website responsive (especially for mobile users).
- Make more things dynamic (car type sections).
- Enable importing an image from the user's machine as a user profile picture.
