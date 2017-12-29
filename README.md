# Nutritioinal Data Website

This website uploads data of various recipes including their calories, fat and weight information and queries them.

Azure Web App is used to host the website and Azure Cosmos DB is used as the NoSQL Database.


# Getting Started

# Prerequisites
1. node js v8 or greater
2. npm version 5.5.1


# Setting up the project:

1. Sign In or Sign up for a Microsoft Azure Account and Deploy a Azure Web App with latest version of node js

2. clone this project into the Azure Web App.

3. cd into the project's root directory and run the command "npm install" to install all necessary              dependencies

4. Using Azure Cosmos DB (NoSQL) create a database named "photos" and collection named "photo". Enter the       primary key details into the lib/config.js file.
   (You can also change the database and collection name, make sure to reflect the changes in the lib/config.js file)

5. In the project's root directory run the command: npm run start, and go to                                    http://<your_app_name>.azurewebsites.net:1337/populateDB to load all files from lib/data directory into      the collection.

6. Now Go to http://<your_app_name>.azurewebsites.net:1337 and run any query from given forms.



# Authors
Jaymit Desai


# Contributing
This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.