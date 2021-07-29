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
    io.emit('usercount', io.engine.clientsCount);
    
    socket.on('disconnect', () => {
        console.log('user disconnect!!');
        io.emit('usercount', io.engine.clientsCount);
    })

    //사용자 정의 이벤트를 사용할 수 있다.
    socket.on('chat', (msg) => {
        console.log('message received!!');

        //io.emit()으로 연결된 모든 소켓에 이벤트 발생.
        io.emit('chat', msg);
    });
});


/* socket.io namespace, room 예제

    socket.io 기본 연결은 다음의 연결을 지원한다.
        1. 소켓과 1대1 통신
        2. 모든 소켓과 통신
    
    1대 N(전체중 일부) 통신을 위해서 socket.io에서 네임스페이스와 룸을 지원한다.
    네임스페이스는 같은 네임스페이스에 속한 socket끼리의 연결을 지원한다.
    룸은 네임스페이스 내의 채널이다. 룸에 join, leave가 가능하고 하나의 소켓이 여러개의 룸에 입장 가능하다.
*/

//of()를 사용하여 mynamespace라는 이름으로 커스텀네임스페이스를 생성
const nsp = io.of("/mynamespace");
const room = 'room name';   //room은 이름인 문자열로 구분됨.

nsp.on('connection', (socket) => {
    console.log('user connect into namespace!!');

    //namespace에 포함되는 모든 소켓에게 hi-namespace이벤트 발생
    nsp.emit('hi-namespace', socket.id);

    //room에 join
    socket.on('join-room', () => {
        socket.join(room);
    })

    //room에서 leave
    socket.on('leave-room', () => {
        socket.leave(room);
    })

    //namespace중에서 room에 속하는 socket에게 이벤트 발생
    nsp.to(room).emit('hi-room', socket.id);
});

httpServer.listen(3000, () => {
    console.log('server is running ...');
});