const port = 8080;
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: `http://localhost:${port}`,
        methods: ['GET', 'POST']
    }
});


io.on('connection', (socket) => {
    //연결된 socket의 id를 돌려준다.
    socket.emit('me', socket.id);

    socket.on('disconnect', () => {
        //나를 제외한 모든 소켓에게 callEnded메세지 발생
        socket.broadcast.emit('callEnded');
    });

    socket.on('callUser', (data) => {
        io.to(data.userToCall).emit('callUser', {
            signal: data.signalData,
            from: data.from,
            name: data.name
        });
    });

    socket.on('answerCall', (data) => {
        io.to(data.to).emit('callAccepted', data.signal);
    });
})

server.listen(port, () => {
    console.log(`server is running on port ${port}`)
})