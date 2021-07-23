import express from 'express';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';


const port = 3000;
const __dirname = path.resolve();

//express-http-socket.io 연계
const app = express();  //express에서 router, sendfile기능사용
const httpServer = createServer(app);  //socket.io를 위해 http server객체가 필요함.
const io = new Server(httpServer);    //io객체는 연결된 모든 client와의 상호작용을 위한 객체임.

//express app 설정
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

//socket설정
io.on('connection', (socket) => {   //client가 접속하면 발생하는 이벤트
    console.log('user connect!!');

    // socket.emit()으로 연결한 상대에게 이벤트 발생시킴.
    // io.engine.clientsCount는 현재 서버에 접속중인 클라이언트 개수.
    socket.emit('usercount', io.engine.clientsCount);
    
    socket.on('disconnect', () => {
        console.log('user disconnect!!');
    })

    //사용자 정의 이벤트를 사용할 수 있다.
    socket.on('chat', (msg) => {
        console.log('message received!!');

        //io.emit()으로 연결된 모든 소켓에 이벤트 발생.
        io.emit('chat', msg);
    });
})

httpServer.listen(3000, () => {
    console.log('server is running ...');
})