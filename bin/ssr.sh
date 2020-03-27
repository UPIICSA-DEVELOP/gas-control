#!/bin/sh
export NODE_ENV=dev
export PORT=8090
gulp clean
ng build -c develop
ng run com.maplander.app.inspector.front:server:develop
npm run config
npm run server
exit 0
