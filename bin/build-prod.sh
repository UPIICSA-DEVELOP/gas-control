#!/bin/sh
export NODE_ENV=prod
export PORT=9090
gulp clean
ng build --prod
ng run com.maplander.app.inspector.front:server:production
npm run config
npm run server
exit 0
