git pull origin production
YARN INSTALL
yarn run build -- --release
pm2 restart build/server.js
