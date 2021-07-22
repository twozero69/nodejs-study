import express from "express";
import ejs from "ejs";
import path from "path";

//node에서 es6 import를 사용하려면 파일확장자까지 명시해야 함.
import router from "./router/main.js";

//node를 commonjs가 아닌 es6로 사용한다면 __dirname은 기본으로 설정되지 않음.
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