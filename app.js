const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// SQLite 데이터베이스 연결 설정
const db = new sqlite3.Database('mydatabase.db');

// 데이터베이스 스키마 및 테이블 생성 (이미 생성되었으면 생략 가능)
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS mytable (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)");
});

// 정적 파일을 제공하는 미들웨어를 추가
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// POST 요청 처리
app.post('/add', (req, res) => {
  const name = req.body.name;
  const age = req.body.age;

  // SQLite 데이터베이스에 데이터 추가
  const sql = 'INSERT INTO mytable (name, age) VALUES (?, ?)';
  db.run(sql, [name, age], function (err) {
    if (err) {
      console.error('데이터베이스 쿼리 오류: ' + err);
      res.send('데이터베이스 오류');
      return;
    }
    res.send('데이터가 성공적으로 추가되었습니다. ID: ' + this.lastID);
  });
});

app.get('/data', (req, res) => {
  // SQLite 데이터베이스에서 데이터 조회
  const sql = 'SELECT * FROM mytable';
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('데이터베이스 쿼리 오류: ' + err);
      res.status(500).json({ error: '데이터베이스 오류' });
      return;
    }
    res.json(rows);
  });
});

// 서버를 시작
const port = 3000;
app.listen(port, () => {
  console.log(`서버가 ${port} 포트에서 실행 중`);
});