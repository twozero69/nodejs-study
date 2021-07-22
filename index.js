/* http */
// import http from "http"; //http server

// http.createServer((req, res) => {
//     res.writeHead(200, {'Content-Type' : 'text/plain'});
//     res.end("Hello World\n");
// }).listen(3000);



/* fs */
// import fs from "fs"; //file system

// fs.readFile('./input.txt', (err, data) => {
//     if (err){
//         return console.error(err);
//     }

//     console.log(data.toString()+'non blocking');
// })

// const data = fs.readFileSync('./input.txt');
// console.log(data.toString()+"blocking");
//non blocking을 사용함으로 더 많은 양의 요청을 빠르게 처리 할 수 있다.



/* event */
// import events from "events";

// const eventEmitter = new events.EventEmitter();

// eventEmitter.on('connection', () => {
//     console.log("connect event");
//     eventEmitter.emit("receive_data");
// });

// eventEmitter.on('receive_data', () => {
//     console.log("data receive");
// })

// eventEmitter.emit('connection');
// console.log("program end");



/* http + fs + url 웹서버 */
// import http from "http";
// import fs from "fs";
// import url from "url";

// //서버생성
// http.createServer((req, res) => {
//     //요청발생시 실행되는 callback
    
//     //req.url이랑 생성된 URL객체의 pathname은 어차피 같다.
//     let pathname = url.parse(req.url).pathname;
//     console.log("request for "+pathname+" received");

//     if(pathname == "/"){
//         pathname = "/index.html";
//     }

//     //파일 읽기
//     fs.readFile(pathname.substr(1), (err, data) => {    

//         if(err){
//             console.log(err);
//             //responsehead작성 response은 순수 텍스트
//             res.writeHead(404, {'Content-Type' : 'text/plain'});
//         }
//         else {
//             //responsehead작성 response는 html문서
//             res.writeHead(200, {'Content-Type' : 'text/html'});
//             //responsebody작성
//             res.write(data.toString());
//             // res.write(data); //둘 모두 가능
//         }
        
//         //responsebody전송
//         res.end();
//     });

// }).listen(3000, () => {//서버실행
//     console.log("server is running ...");
// }); 


/* express */
import express from "express";
import ejs from "ejs";
import path from "path";
import router from "./router/main.js";

const __dirname = path.resolve();
const app = express();
const port = 3000;

//서버설정
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);
app.use(express.static('public'));
router(app);

//서버생성
const server = app.listen(port, () => {
    console.log(`example app listening on port ${port}`);
})