const http = require('node:http');
const { findAvailablePort } = require('./free-port.js');

const server = http.createServer((req, res) => {
    console.log('request received');
    res.end('Hola mundo');
});

findAvailablePort(3000).then(port => {
    server.listen(port, () => {
        console.log(`Server listening on http://localhost:${port}`);
    });
})