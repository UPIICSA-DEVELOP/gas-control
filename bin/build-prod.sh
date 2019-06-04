#!/bin/sh
export NODE_ENV=prod
export PORT=9090
export FRONT_URL='https://app.inspectordenormas.com/',
export BACKEND_URL='https://inspector-backend.appspot.com/_ah/api/communication/v1/'
gulp clean
ng build --prod
ng run com.maplander.app.inspector.front:server:production
npm run api
npm run config
npm run lazy
npm run server
exit 0
