const express = require("express");
const mysql = require('mysql2');
const cors = require('cors');
const { check, validationResult } = require('express-validator');
const cookie = require('cookie');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "tejashri",
  database: "todo_list"
});

// Middleware to set up cookies
app.use((req, res, next) => {
  req.cookies = cookie.parse(req.headers.cookie || '');
  next();
});

app.post('/signup', [
  check('name').notEmpty(),
  check('email').isEmail().isLength({ min: 10, max: 30 }),
  check('password').isLength({ min: 8, max: 20 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const sql = "INSERT INTO login (name, email, password) VALUES (?, ?, ?)";
  const values = [
    req.body.name,
    req.body.email,
    req.body.password
  ];

  db.query(sql, values, (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json(data);
  });
});

app.post('/login', [
  check('email').isEmail().isLength({ min: 10, max: 30 }),
  check('password').isLength({ min: 8, max: 20 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const sql = "SELECT * FROM login WHERE email = ? AND password = ?";
  const values = [req.body.email, req.body.password];

  db.query(sql, values, (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (data.length > 0) {
      const user = {
        id: data[0].id,
        name: data[0].name,
        email: data[0].email
      };
      const serializedUser = JSON.stringify(user);
      //res.setHeader('Set-Cookie', cookie.serialize('user', serializedUser, { httpOnly: true }));
      return res.json({...user , status: true});
    } else {
      return res.json({status: false});
    }
  });
});

app.get('/todos', (req, res) => {
  const user = req.query.userId;
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const query = 'SELECT * FROM todos WHERE userid = ?';
  db.query(query, [user], (error, results) => {
    if (error) {
      console.error('Error retrieving todos: ' + error.stack);
      res.status(500).json({ error: 'Failed to retrieve todos' });
      return;
    }
    res.status(200).json(results);
  });
});

app.post('/todos', (req, res) => {
  const { title, completed, date, userId } = req.body;
  const query = 'INSERT INTO todos (title, completed, date, userid) VALUES (?, ?, ?, ?)';
  
  db.query(query, [title, completed ? 1 : 0, date, userId], (error, results) => {
    if (error) {
      console.error('Error creating a new todo: ' + error.stack);
      res.status(500).json({ error: 'Failed to create a new todo' });
      return;
    }
    res.status(201).json({ id: results.insertId });
  });
});

app.put('/updateTodos', (req, res) => {
  const { Id } = req.query;
  const { title, completed, date, todoId  } = req.body;
  const formattedDate = new Date(date).toISOString().slice(0, 19).replace('T', ' ');
  const query = 'UPDATE todos SET title = ?, completed = ?, date = ? WHERE id = ?';
  const params = [title, completed ? 1 : 0, formattedDate, Id];
  db.query(query, params, (error, results) => {
    if (error) {
      console.error('Error updating the todo: ' + error);
      res.status(500).json({ error: 'Failed to update the todo' });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }
    res.sendStatus(200);
  });
});

app.delete('/deleteTodos', (req, res) => {
  const { id } = req.query;
  const query = 'DELETE FROM todos WHERE id = ?';
  db.query(query, [id], (error, results) => {
    if (error) {
      console.error('Error deleting the todo: ' + error.stack);
      res.status(500).json({ error: 'Failed to delete the todo' });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }
    res.sendStatus(200);
  });
});



app.listen(8081, () => {
  console.log("Listening on port 8081");
});
