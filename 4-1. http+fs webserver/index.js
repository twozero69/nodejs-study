import http from "http";
import fs from "fs";

//서버생성
http.createServer((req, res) => {
    //요청발생시 실행되는 callback
    
    //req.url이랑 생성된 URL객체의 pathname은 어차피 같다.
    const baseURL = "http://localhost:3000"
    const newURL = new URL(req.url, baseURL)
    let pathname = newURL.pathname;
    console.log("request for "+pathname+" received");

    if(pathname == "/"){
        pathname = "/index.html";
    }

    //파일 읽기
    fs.readFile(pathname.substr(1), (err, data) => {    

        if(err){
            console.log(err);
            //responsehead작성 response은 순수 텍스트
            res.writeHead(404, {'Content-Type' : 'text/plain'});
        }
        else {
            //responsehead작성 response는 html문서
            res.writeHead(200, {'Content-Type' : 'text/html'});
            //responsebody작성
            res.write(data.toString());
            // res.write(data); //둘 모두 가능
        }
        
        //responsebody전송
        res.end();
    });

}).listen(3000, () => {//서버실행
    console.log("server is running ...");
}); 
