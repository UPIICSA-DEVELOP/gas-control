#!/bin/bash
echo [START DEPLOY TO PRODUCTION `date '+%Y-%m-%d %H:%M:%S'`]
x="ls /var/www/html/app.inspector.com/deploy/backups/prod/ -1 | wc -l"
y=$(eval "$x")
if [ $y -gt 3 ]
then
  echo More than 3 backups
  sudo rm -rf /var/www/html/app.inspector.com/deploy/backups/prod/*
else
  echo Less than 3 backups
fi
sudo zip -r /var/www/html/app.inspector.com/deploy/backups/prod/backup.prod-`date '+%Y-%m-%d-%H:%M:%S'`.zip /var/www/html/app.inspector.com/production/ --exclude=/var/www/html/app.inspector.com/production/node_modules**
sudo rm -rf /var/www/html/app.inspector.com/production/*
sudo rm -rf /var/www/html/app.inspector.com/production/.well-known/*
sudo unzip /var/www/html/app.inspector.com/deploy/bundle.zip -d /var/www/html/app.inspector.com/production
sudo npm i --unsafe-perm --prefix /var/www/html/app.inspector.com/production
sudo rm -rf /var/www/html/app.inspector.com/deploy/bundle.zip
sudo chmod -R 755 /var/www/html/app.inspector.com/production/
sudo pm2 startOrReload /var/www/html/app.inspector.com/production/apps.json
echo [END DEPLOY TO PRODUCTION `date '+%Y-%m-%d %H:%M:%S'`]
