# inSpéctor Front End

Development environment for scalable Web App using Angular 7,
Angular CLI and deployed on AWS

## Getting Started

These instructions will get you a copy of the project up and running on your
local machine for development and testing purposes.

## Requirements

* [WebStorm IDE](https://www.jetbrains.com/webstorm/)
* [Git](https://git-scm.com/downloads)
* [NodeJs](https://nodejs.org/es/)
* [NPM](https://www.npmjs.com/)

## Install dependencies

Run command

`npm install`

## List tasks

This project use technology of [Angular CLI](https://cli.angular.io/) for compile

[Can a read the complete command list here](https://github.com/angular/angular-cli/wiki)

Can execute commands manually or configure your WebStorm for execute tasks with NPM

### **IMPORTANT!** 
> Before execute `npm build` or `npm build:develop` command make sure of commit all yours changes. 
Do not forget to read [Commits](#commits)


Title  | Command  | Description
------------- | ------------- | -------------
Start application in localhost  | `npm run start` | Start application for development
Build bundle for production | `npm run build` | Build application for deploy in production
Build bundle for development | `npm run build:develop` | Build application for deploy in develop
Test Server Side Rendering | `npm run ssr` | Test in localhost the server side rendering before deploy to develop/production (Prevent errors in server)
Build server file | `npm run server` | Build server file for develop/production
Deploy to develop | `npm run deploy:develop` | Deploy application to development  
Deploy to production | `npm run deploy:production` | Deploy application to production 
Generate apps.json and package.json | `npm run config` | Generate File apps.json for start applications with PM2 and create package.json for dependencies
Increase version as pre release |  `npm run prerelease:patch` | Update package.json with new version for release and adding the changes to CHANGELOG.md file
Increase version as pre release |  `npm run prerelease:minor` | Update package.json with new version for release and adding the changes to CHANGELOG.md file
Increase version as pre release |  `npm run prerelease:major` | Update package.json with new version for release and adding the changes to CHANGELOG.md file
Increase version as release |  `npm run release:patch` | Update package.json with new version for release and adding the changes to CHANGELOG.md file
Increase version as release |  `npm run release:minor` | Update package.json with new version for release and adding the changes to CHANGELOG.md file
Increase version as release |  `npm run release:major` | Update package.json with new version for release and adding the changes to CHANGELOG.md file
Build API |  `npm run api` | Build API
Update index.html for lazy loading |  `npm run lazy` | Update index.html for improve performance with lazy loading 
Setup for deploy |  `npm run deploy:setup` | 
Generate bundle report | `npm run bundle-report` | Generate bundle report for inspect application size 
  
##Folder Structure

    .
    ├── .well-known                                                 
    ├── api  
    ├── bin
    ├── hooks
    ├── server                                                   
    ├── src                                                         
    │   ├── app
    │   │   ├── commons
    |   |   |   └── modules
    │   │   ├── core
    │   │   |   ├── components
    │   │   |   ├── directives
    │   │   |   ├── services
    │   │   |   ├── interceptors
    |   │   │   |   ├── browser
    |   │   │   |   └── server
    │   │   |   ├── directives
    │   │   |   └── pipes
    |   |   ├── shared
    |   │   │   ├── components
    │   │   |   └── pipes
    |   |   ├── ui 
    |   |   └── utils
    │   │       ├── class
    │   │       ├── constants
    │   │       ├── enums
    │   │       ├── interfaces    
    │   │       └── utilities      
    │   ├── assets
    │   ├── environments
    │   └── styles
    ├── CHANGELOG.md
    └── README.md
    
    

  
## Environments

Name | URL | PORT
-----------|----------|------
LocalHost  | [http://localhost:4200](http://localhost:4200) | 4200
Develop  | [https://inspector-develop.maplander.com](https://inspector-develop.maplander.com) | 8090
Production | [https://app.inspectordenormas.com](https://app.inspectordenormas.com) | 9090
  
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
