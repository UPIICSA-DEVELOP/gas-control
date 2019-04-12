#!/bin/bash
echo [START DEPLOY TO DEVELOP `date '+%Y-%m-%d %H:%M:%S'`]
sudo zip -r /var/www/html/app.inspector.com/deploy/backups/backup.dev-`date '+%Y-%m-%d-%H:%M:%S'`.zip /var/www/html/app.inspector.com/develop/ --exclude=/var/www/html/app.inspector.com/develop/node_modules**
sudo rm -rf /var/www/html/app.inspector.com/develop/*
sudo rm -rf /var/www/html/app.inspector.com/develop/.well-known/*
sudo unzip /var/www/html/app.inspector.com/deploy/bundle.zip -d /var/www/html/app.inspector.com/develop
sudo npm i --unsafe-perm --prefix /var/www/html/app.inspector.com/develop
sudo rm -rf /var/www/html/app.inspector.com/deploy/bundle.zip
sudo chmod -R 755 /var/www/html/app.inspector.com/develop/
sudo pm2 startOrReload /var/www/html/app.inspector.com/develop/apps.json
echo [END DEPLOY TO DEVELOP `date '+%Y-%m-%d %H:%M:%S'`]
