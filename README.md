# Riverwalk-Web-Application

A modern credit repair website with credit monitoring services

## Built With

* Angular 2 - 2.1.1
* Node.js - 7.2.1
* Express - 4.14.0
* PG npm - 6.1.0
* Postgres System - 9.6

## Development Environment

node: 7.2.1
os: darwin x64 Sierra
npm: 4.0.3

## Contributing

No Contributing

## Versioning

0.0.1

## Authors

* **Nicholas J. Diaz** - *Initial work* - [Wuno, Inc.](https://wuno.com)

## Github

* https://github.com/wuno

## License

This product is owned by Wuno, Inc. 

## Acknowledgments

* Special thanks to Wuno, Inc. devs

## Development server
Run `npm run build` to compile Typescript and set program to watch for changes. Then in a different terminal window run `npm start` for a dev server. Navigate to `http://localhost:4200/`.

## Setting Up Application For Development
There are three config files in the .gitignore which you will need to create in order to run the application. 
These files are as followed,
1. db/config.js
2. assets/app/services/auth.config.ts
3. merchant/merchant.config.js

Pleas create each of these files in the correct path so the application will work properly. 

## Postgres Database Configuration
db/config.js

'use strict';
var algorithm = 'aes-256-ctr';
var password = 'd6F3Efeq';
var pgConfig = {
    user: 'postgres',
    database: 'DBNAME',
    password: 'PASSWORD',
    host: 'localhost',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000
};

module.exports.algorithm = algorithm;
module.exports.password = password;
module.exports.pgConfig = pgConfig;

## Autho0 configuration 
assets/app/services/auth.config.ts

interface AuthConfiguration {
    clientID: string,
    domain: string,
    callbackURL: string
}

export const myConfig: AuthConfiguration = {
    clientID: 'CLIENTID',
    domain: 'DOMAIN.auth0.com',
    // You may need to change this!
    callbackURL: 'http://localhost:4200/overview/'
};

## Authorize.net Configuration
merchant/merchant.config.js

'use strict';
module.exports.AUTHNET_API_LOGIN_ID = 'API_LOGIN_ID';
module.exports.AUTHNET_TRANSACTION_KEY = 'KEY';
