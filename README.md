# culexpress
CUL Express project
Building with NodeJS,Express,AngularJS + MySQL

# Env. setup instruction
* Download and install latest node.js from https://nodejs.org/dist/v5.0.0/node-v5.0.0-x64.msi
* Install bower with command "npm install -g bower"
* Download and install mysql work-branch(V6.3) and mysql server community version
* Pull source code from github

# Database Installation
* Go to "database" folder, execute script "01_Database_Creation" to create database "culexpress" in MySQL
* Under database "culexpress",execute all scripts one by one.

# CUL api
* Go to "culapi" folder and run command "npm install", make sure everything installed correctly
* Run command "npm start" to strat the API at "http://localhost:8000"

# CUL Web App
* Go to folder "culwebapp/config/db.js" and change mysql host,user and password to whatever you're using locally
* Go to folder "culwebapp" and run command "npm install", make sure everything installed correctly
* Run command "bower install", make sure everything installed correctly
* Run command "grunt serve" and will automatically open browser with address "http://localhost:3000" 

# CUL Admin App
* Go to folder "culadminapp/config/db.js" and change mysql host,user and password to whatever you're using locally
* Go to folder "culadminapp" and run command "npm install", make sure everything installed correctly
* Run command "bower install", make sure everything installed correctly
* Run command "grunt serve" and will automatically open browser with address "http://localhost:9000" 
