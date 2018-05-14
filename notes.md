# Notes

Fork the master repo on GitHub

Clone the fork to local machine

`npm install`

## Configuration Background Information

In order to keep our database information secure, we need to use environment variables. However, Sequelize presents an interesting challenge with doing so, as the configuration file is a .json file which does not allow the use of variables. To work around this, we create a `.sequelizerc` file PRIOR to initializing sequelize. In this file, we override the path that Sequelize will use to configure the database, setting the path to a `config.js` file which requires the `dotenv` node module and exports a JSON object containing our environment variables. This change can be seen after initializing sequelize by the changed config path in `models/index.js`. 

## Setup

Create a .env file and add the following environment variables specific to local database:

`DB_USER`

`DB_PASS`

`DB_HOST`


In the CLI, run:

`sequelize db:create` to establish the database

`sequelize db:migrate` to migrate the existing model

`sequelize db:seed:all` to seed the model with the demo user

Once your database connection is established, start the server and navigate to `localhost:8080`. You should see a demo username and password displayed to the page. Now create your working branch!


## Heroku Deployment Background Information

Creating the app and provisioning the jawsdb for MySQL

1. heroku create [project name]
2. heroku addons:create jawsdb
3. Get the secret URL: heroku config:get JAWSDB_URL
4. Important: install sequelize-cli locally to make it work with remote migrations

### Run migrations after deployment:

`heroku run [migration command]`

ex.: `heroku run sequelize db:migrate` or `heroku run sequelize db:seed:all`