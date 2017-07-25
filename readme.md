# Description

This is an e-commerce application created with NodeJS and MongoDB. It also uses Passport for some middleware to handle users, and the Stripe API do simulate making payments.

# Local Installation

## Prerequisites

On your local machine you must have the following
* NodeJS v7.8.0+
* NPM v4.2.0+
* [MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)
* Mocha

> **Note**: When testing this application locally, you must have MongoDB running, which you can control with the commands `sudo service mongod start` and `sudo service mongod stop`

## Installation

Clone this repository into your local machine's working directory
```
git clone https://github.com/ma-singh/DWA_Assignment4-3.git
```

Change directory into the repository you just cloned
```
cd DWA_Assignment4-3
```

Install node_modules and other dependencies
```
npm install
```

You can start the application using
```
npm start
```
> **NOTE**: This points at the `./bin/www` file to begin running the application, which you can see in your start scripts in the *package.json*.

View your application at [http://localhost:3000](http://localhost:3000)

## Workflow and Development

Before you begin developing switch to the development branch
```
git checkout -b development
```

Create a new branch for the feature you are working on
```
git checkout -b <FEATURE_NAME>
```

When finished developing, merge your feature back into the development branch
```
git checkout development
git merge <FEATURE_NAME>
```

![Workflow](http://i.imgur.com/f2drHGV.jpg)

# Deployment

Commit changes you've made during your local development to GitHub
```
git push origin development
```

> **NOTE**: Unit tests will run courtesy of Mocha and Chai. You will be unable to commit changes if the tests fail.

If you are required to push a release live, you can do so with the following on your local machine. First, pull the latest stable version of the repository
```
git pull origin <TAGGED_RELEASE>
```

Switch to the production branch
```
git checkout -b production
```

Add the production server to your list of git remote repositories
```
git remote add <REMOTE_SERVER_NAME> ssh://<username>:<IP_ADDRESS>:/var/repos/shopping-cart.git
```

You can then push to the emote repository by running
```
git push <REMOTE_SERVER_NAME> production
```
