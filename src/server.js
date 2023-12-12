const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();
    const httpServer = http.createServer(server);
    const io = new Server(httpServer);

    server.all('*', (req, res) => {
        return handle(req, res);
    });

    io.on('connection', (socket) => {
        console.log('User connected');


        socket.on('privateMessage', (data) => {
            console.log('Private message received:', data);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    httpServer.listen(3000, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:3000');
    });
});
