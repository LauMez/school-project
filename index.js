import { createServer } from 'node:http';
import { findAvailablePort } from './free-port.js';

const server = createServer((req, res) => {
    console.log('request received');
    res.end('Hola mundo');
});

findAvailablePort(3000).then(port => {
    server.listen(port, () => {
        console.log(`Server listening on http://localhost:${port}`);
    });
})