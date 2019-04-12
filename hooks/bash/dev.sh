#!/bin/bash
echo [START DEPLOY TO DEVELOP `date '+%Y-%m-%d %H:%M:%S'`]
x="ls /var/www/html/app.inspector.com/deploy/backups/dev/ -1 | wc -l"
y=$(eval "$x")
if [ $y -gt 3 ]
then
  echo More than 3 backups
  sudo rm -rf /var/www/html/app.inspector.com/deploy/backups/dev/*
else
  echo Less than 3 backups
fi
sudo zip -r /var/www/html/app.inspector.com/deploy/backups/dev/backup.dev-`date '+%Y-%m-%d-%H:%M:%S'`.zip /var/www/html/app.inspector.com/develop/ --exclude=/var/www/html/app.inspector.com/develop/node_modules**
sudo rm -rf /var/www/html/app.inspector.com/develop/*
sudo rm -rf /var/www/html/app.inspector.com/develop/.well-known/*
sudo unzip /var/www/html/app.inspector.com/deploy/bundle.zip -d /var/www/html/app.inspector.com/develop
sudo npm i --unsafe-perm --prefix /var/www/html/app.inspector.com/develop
sudo rm -rf /var/www/html/app.inspector.com/deploy/bundle.zip
sudo chmod -R 755 /var/www/html/app.inspector.com/develop/
sudo pm2 startOrReload /var/www/html/app.inspector.com/develop/apps.json
echo [END DEPLOY TO DEVELOP `date '+%Y-%m-%d %H:%M:%S'`]
