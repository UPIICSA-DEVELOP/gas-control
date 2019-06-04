#!/bin/sh
gulp zip --file hooks/bash
node hooks/scp --filePath hooks/bash/bundle.zip --destination /var/www/html/app.inspector.com/deploy/bash
node hooks/remotely --setup
exit 0
