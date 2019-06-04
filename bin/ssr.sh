#!/bin/sh
export NODE_ENV=dev
export PORT=8090
export FRONT_URL='https://inspector-develop.maplander.com/',
export BACKEND_URL='https://schedule-maplander.appspot.com/_ah/api/communication/v1/'
gulp clean
ng build -c develop
ng run com.maplander.app.inspector.front:server:develop
npm run api
npm run config
npm run lazy
npm run server
exit 0
