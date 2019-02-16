const http = require('http');
const fs = require('fs');
const path = require('path');

const hostName = '127.0.0.1';
const port = 8091;

const serveFile = function(pathToFile, contentType, res) {
     console.log('Serving file: ' + pathToFile + ' as ' + contentType);
    fs.readFile(pathToFile, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404);
                res.end("404 not found " + pathToFile);
            } else {
                res.writeHead(500);
                res.end('Error code ' + error.code);
                res.end();
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
};

const server = http.createServer((req, res) => {

    const url = req.url;
    console.log(url);

    const elements = url.split('/');
    if (elements.length > 1) {
        const first = elements[1];
        console.log(first);
        switch(first) {
            case 'js':
                serveFile('.' + url, 'text/javascript', res);
                break;
            case 'css':
                serveFile('.' + url, 'text/css', res);
                break;
            default:
                serveFile('./' + first + ".html", 'text/html', res);
                break;
        }
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('404: not found');
    }
});

server.listen(port, hostName, () => {
	console.log(`Server running at http://${hostName}:${port}/`);
});

