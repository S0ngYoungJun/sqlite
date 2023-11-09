const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const db = new sqlite3.Database('mydb.db');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/addItem', (req, res) => {
  const name = req.body.name;

  db.run('INSERT INTO items (name) VALUES (?)', [name], function(err) {
    if (err) {
      console.error('Error adding item:', err);
      res.status(500).send('Error adding item');
    } else {
      res.send('Item added successfully');
    }
  });
});

app.get('/getItems', (req, res) => {
  db.all('SELECT name FROM items',[], function(err, rows) {
    if (err) {
      console.error('Error fetching items:', err);
      res.status(500).send('Error fetching items');
    } else {
      console.log('Items fetched successfully.');
      res.json(rows);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database closed.');
    process.exit(0);
  });
});