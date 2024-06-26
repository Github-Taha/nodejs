const http = require('http');
const fs = require('fs');
const path = require('path');
const filename = 'text.txt';
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    if (req.method == 'GET') {
        const filePath = path.join(__dirname, 'site', req.url === '/' ? 'index.html' : req.url);

        const extname = path.extname(filePath);
        let contentType = 'text/html';

        switch (extname) {
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
            case '.json':
                contentType = 'application/json';
                break;
            case '.png':
                contentType = 'image/png';
                break;
            case '.jpg':
                contentType = 'image/jpg';
                break;
        }

        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code == 'ENOENT') {
                    res.writeHead(404);
                    res.end('File not found');
                } else {
                    res.writeHead(500);
                    res.end('Internal Server Error');
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    }
    else if (req.method == 'POST') {
        var chunk = '';
        req.on('data', (data) => {
            chunk += data;
        });
        req.on('end', (data) => {
            console.log(chunk);
            fs.readFile(filename, 'utf-8', (err, data) => {
                if (!err) {
                    fs.writeFile(filename, data + '\n' + chunk, (err) => {
                        if (err) throw err;
                    });
                }
                else {
                    throw err;
                }
            });

            res.end();
        });
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
