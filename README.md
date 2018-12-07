# Base Front End

Development environment for scalable Web App using Angular 7,
Angular CLI and deployed with Google App Engine

Use Google App Engine for deploy app with Express server 


## Getting Started

These instructions will get you a copy of the project up and running on your
local machine for development and testing purposes.

## Requirements

* [WebStorm IDE](https://www.jetbrains.com/webstorm/)
* [Git](https://git-scm.com/downloads)
* [NodeJs](https://nodejs.org/es/)
* [NPM](https://www.npmjs.com/)
* [Google Cloud SDK](https://cloud.google.com/sdk/install)

## Install dependencies

Run command

`npm install`

## List tasks

This project use technology of [Angular CLI](https://cli.angular.io/) for compile

[Can a read the complete command list here](https://github.com/angular/angular-cli/wiki)

Can execute commands manually or configure your WebStorm for execute tasks with NPM

### **IMPORTANT!** 
> Before execute `npm build` command make sure of commit all yours changes. Do not forget to read [Commits](#commits)


Title  | Command  | Description
------------- | ------------- | -------------
Start application in localhost  | `npm run start` | Start application for development
Test Server Side Rendering | `npm run test:ssr` | Test in localhost the server side rendering before deploy to develop/production (Prevent errors in server)
Build bundle for development | `npm run build:develop` | Build application for deploy in develop
Build bundle for production | `npm run build` | Build application for deploy in production
Build server file | `npm run webpack:server` | Build server file for develop/production
Deploy to develop | `npm run deploy:develop ` | Deploy application to development  
Deploy to production | `npm run deploy:production` | Deploy application to production  
Upload CDN to development | `npm run upload:cdn:dev` | Upload files to CDN in development
Upload CDN to production | `npm run upload:cdn:prod` | Upload files to CDN in production
Generate Node config file for development | `npm run create:nconfig:dev` | Generate File nconfig.json for development
Generate Node config file for production | `npm run create:nconfig:prod` | Generate File nconfig.json for production
Generate bundle report | `npm run bundle-report` | Generate bundle report for inspect application size 
  
##Folder Structure

    .
    ├── dist                            # Compiled files (server and browser) 
    │   └── .well-known                 # Files for config Dynamic Links (IOS/Android)  
    ├── e2e                                           
    ├── src                             # Source files                                
    │   ├── app
    │   │      ├── components
    │   │      └── core
    │   │              ├── class
    │   │              ├── components
    │   │              ├── constants
    │   │              ├── directives
    │   │              ├── enums
    │   │              ├── material
    │   │              ├── models
    │   │              ├── pipes
    │   │              ├── services
    │   │              └── utilities
    │   ├── assets
    │   ├── environments
    │   └── styles
    ├── CHANGELOG.md
    └── README.md
    
    

  
## Environments

Name | URL
-----------|----------
LocalHost  | [http://localhost:4200](http://localhost:4200)
Develop  | [https://example.appspot.com](https:/example.appspot.com)
Production | [https://example.com](https:/example.com)
  
## List of changes

Read the [CHANGELOG.md](CHANGELOG.md)

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available.

##Commits

It is strictly forbidden to commit without following the standardization of [Conventional Commits](https://www.conventionalcommits.org)

## Branches

Type | Description
------|-----------
Develop | In this branch, only the commits that are deployed in the development environment can exist
Master | In this branch there can only be commits that have been deployed in the development environment and that have been approved to be deployed in production.

For this it is necessary to join the branch Develop with Master and push the changes.
   
## Authors and Contributions ###

* [Alejandro Lopez](https://alx-developer.herokuapp.com) - *Initial work*
* Fernando Flores - Contributor

## Copyright ###

[Add Copyright to WebStorm IDE](https://www.jetbrains.com/help/idea/copyright.html)

> Do not forget to insert the copyright in each of the project files.

```
 Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 Unauthorized copying of this file, via any medium is strictly prohibited
 Proprietary and confidential
```

Copyright (C) 2018 MapLander S. de R.L de C.V

All rights reserved
