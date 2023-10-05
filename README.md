# NC News API 

[A hosted instance of this API can be found here](https://skelbon-news-api.onrender.com)

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Seeding](#seeding)
- [Testing](#testing)
- [Usage](#usage)

## Description

A RESTful API to a repository of news articles. 

## Features

The API allows you create, read, update and delete articles in the repository.

Articles have a number of attributes:

* Author
* Title
* Body
* Topic 
* Image URL 
* Votes

## Prerequisites

You server or test machine must have an installation of [PostgresSQL](https://www.postgresql.org/)

Postrgres version 16+

Node 20.6.1+

## Installation

Clone the repo and install the dependencies from the package.json file.

In order to connect to the databases locally two environment files are required; 

* .env.test
* .env.development

Containing: PGDATABASE=nc_news_test and PGDATABASE=nc_news respectively.

You will also need to 'npm install dotenv' to utilise these files.

## Seeding

First setup your databases with 'npm run setup-dbs'

To seed your database run 'npm run seed'. 

## Testing

Jest tests are located in the __tests__ folder. To run: 'npm test app'.

## Usage

In the [endpoints.json file]('./endpoints.json') you will find a list of all available endpoints, a description and example responses.


