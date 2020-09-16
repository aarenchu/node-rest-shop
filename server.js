// Provides some http functionality needed for setting up a server
const http = require('http');
// use the app file.
const app = require('./app');

// if the PORT number exists in the env or hard-coded
const port = process.env.PORT || 3000;

// create server, which will need a listener eventually.
const server = http.createServer();

server.listen(port);

