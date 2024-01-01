const PORT = process.env.PORT ?? 8000;
const express = require('express');
const { v4:uuidv4} = require('uuid');
const app = express();
const cors = require('cors')
const pool = require('./db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/todos/:email', async (req, res) => {
    const email= req.params.email
    try {
      const query = 'SELECT * FROM todos WHERE user_email = ?';
      pool.query(query, [email], (error, results) => {
        if (error) {
          console.error('Error executing query:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          console.log('Fetched rows from the database:', results);
          res.json(results);
        }
      });
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// create a new todo
app.post('/todos', async (req, res) => {
  try {
    const id = uuidv4()
    const newtoDo = await pool.query('INSERT INTO todos (id,user_email,title, description, progress, date) VALUES (?, ?, ?, ?, ?, ?)', [id, req.body.user_email, req.body.title, req.body.description, req.body.progress, req.body.date], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log('Inserted rows into the database:', results);
        res.json(results);
      }
    })
  } catch (error) {
    console.log(error)
  }
})

app.post('/todos/:id', async (req, res) => {
  try {
    pool.query('UPDATE todos SET progress = ?, title = ?, description = ?, date = ? WHERE id = ?', [req.body.progress, req.body.title, req.body.description, new Date(), req.params.id], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log('Updated rows in the database:', results);
        res.json(results);
      }
    })
  } catch (error) {
    console.log(error)
  }
})

app.post('/todos/delete/:id', async (req, res) => {
  try {
    pool.query('DELETE FROM todos WHERE id = ?', [req.params.id], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log('Deleted rows in the database:', results);
        res.json(results);
      }
    })
  } catch (error) {
    console.log(error)
  }

})

// Sign up
app.post('/signup', (req, res) => {
  const { email, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  pool.query('SELECT * FROM users WHERE email = ?', [email],async (error, results)=>{
    if (error){
      console.log(error)
      return
    }
    if (results.length > 0) {
      return res.json({ detail: 'Email already exists!' });
    }
  });
  pool.query('INSERT INTO users (email, hashed_password) VALUES (?, ?)', [email, hashedPassword], async (error,results) => {
    if (error) {
      console.error(error);
      res.json({detail:'Sign up failed'})
      return;
    }
  const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' });
  res.json({ email, token });
  });
  }
);


// Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  pool.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
    if (error) {
      console.error(error);
      return;
    }

    if (!results.length) {
      return res.json({ detail: 'User does not exist!' });
    }

    const success = await bcrypt.compare(password, results[0].hashed_password);
    const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' });

    if (success) {
      res.json({ 'email' : results[0].email, token });
    } else {
      res.json({ detail: "Login failed" });
    }
  });
});




app.listen(PORT,()=>console.log(`Server Running on PORT ${PORT}`))
