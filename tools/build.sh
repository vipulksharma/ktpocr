git pull origin production
yarn install
yarn run build -- --release
pm2 restart build/server.js
