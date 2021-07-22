import fs from "fs"; //file system

fs.readFile('./input.txt', (err, data) => {
    if (err){
        return console.error(err);
    }

    console.log(data.toString()+' - non blocking');
})

const data = fs.readFileSync('./input.txt');
console.log(data.toString()+" - blocking");
//non blocking을 사용함으로 더 많은 양의 요청을 빠르게 처리 할 수 있다.