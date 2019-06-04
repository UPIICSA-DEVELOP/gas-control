#!/bin/sh
gulp zip --file dist
node hooks/scp --filePath dist/bundle.zip --destination /var/www/html/app.inspector.com/deploy
exit 0
