const port = 8080;
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
// const io = require('socket.io')(server);
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000',    //react app이 동작하는 주소
        methods: ['GET', 'POST']
    }
});


io.on('connection', (socket) => {
    console.log('new client connect!!');

    //연결된 socket의 id를 돌려준다.
    socket.emit('me', socket.id);

    socket.on('disconnect', () => {
        //나를 제외한 모든 소켓에게 callEnded메세지 발생
        socket.broadcast.emit('callEnded');
    });

    socket.on('callUser', ({userID, signal, from, name}) => {
        io.to(userID).emit('callUser', {
            signal: signal,
            from: from,
            name: name
        });
    });

    socket.on('answerCall', ({signal, to}) => {
        io.to(to).emit('callAccept', signal);
    });
})

server.listen(port, () => {
    console.log(`server is running on port ${port}`)
})