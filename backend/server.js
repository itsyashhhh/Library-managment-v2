const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'libraryy'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

app.post('/submit-form', (req, res) => {
  const { title, author, subject, publishDate, count } = req.body;
  const query = `INSERT INTO books (title, author, subject, publish_date, count) VALUES (?, ?, ?, ?, ?)`;

  connection.query(query, [title, author, subject, publishDate, count], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    res.status(200).json({ message: 'Book added successfully' });
  });
});

app.get('/books', (req, res) => {
  const { search = '', page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize);

  let query = `SELECT * FROM books WHERE title LIKE '%${search}%' OR author LIKE '%${search}%' OR subject LIKE '%${search}%' OR publish_date LIKE '%${search}%' LIMIT ?, ?`;
  
  connection.query(query, [offset, limit], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    res.json(results);
  });
});

app.delete('/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const query = `DELETE FROM books WHERE id = ?`;

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ message: 'Book not found' });
    } else {
      res.status(200).json({ message: 'Book deleted successfully' });
    }
  });
});

app.get('/books/count', (req, res) => {
  connection.query('SELECT COUNT(*) AS totalBooks FROM books', (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const totalBooksCount = results[0].totalBooks;
    res.json({ count: totalBooksCount });
  });
});

app.post('/borrowers', (req, res) => {
  const { bookId, borrowerData } = req.body;

  const query = 'INSERT INTO borrowers (book_id, name, email, phone_number, address) VALUES (?, ?, ?, ?, ?)';
  const values = [bookId, borrowerData.name, borrowerData.email, borrowerData.phoneNumber, borrowerData.address];

  connection.query(query, values, (error, results) => {
    if (error) {
      console.error('Error inserting borrower data:', error);
      return res.status(500).json({ error: 'Failed to store borrower data' });
    }

    res.status(200).json({ message: 'Borrower data stored successfully' });
  });
});


app.post('/books/:id/borrow', async (req, res) => {
  const bookId = req.params.id;
  const { email, title } = req.body;

  connection.query('UPDATE books SET count = count - 1 WHERE id = ?', [bookId], async (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }

    try {
      await sendEmail(email, title);
      res.status(200).json({ message: 'Book borrowed successfully and email sent' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

app.get('/borrowers', (req, res) => {
  const query = 'SELECT DISTINCT name, phone_number AS phoneNumber, email, address FROM borrowers';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    res.json(results);
  });
});

app.post('/send-email', (req, res) => {
  const { email, bookTitle } = req.body;

  sendEmail(email, bookTitle)
    .then(() => {
      res.status(200).json({ message: 'Email sent successfully' });
    })
    .catch(error => {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send email notification' });
    });
});


const sendEmail = async (toEmail, bookTitle) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'itsyashoff@gmail.com', 
      pass: 'redgta123' 
    }
  });

  try {
    let info = await transporter.sendMail({
      from: 'itsyashoff@gmail.com', 
      to: toEmail,
      subject: 'Book Borrowed Notification',
      text: `You have borrowed the book: ${bookTitle}. Enjoy reading!`
    });
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
