const express = require('express');
const mysql = require('mysql');
const app = express();
const cors = require('cors');
const multer = require("multer");
const path = require("path");
const base64Img = require('base64-img');
const fs = require('fs');

// Create connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '!Salmonfoodie22', //'Maninderpal51',
  database: 'bookhub'
});

// Connect
db.connect(err => {
  if (err) {
    console.log(err);
  }
});

app.use(cors());

app.get('/', (req, res) => {
  res.send('go to /books to see books');
});

app.get("/", express.static(path.join(__dirname, "./public")));

app.get('/books', (req, res) => {
  db.query('SELECT * FROM listedbooks', (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json({
        data: results
      });
    }
  });
});

app.get('/courses', (req, res) => {
  db.query('SELECT * FROM courses', (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json({
        data: results
      });
    }
  });
});

app.get('/department', (req, res) => {
  db.query('SELECT * FROM department', (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json({
        data: results
      });
    }
  });
});

app.get('/dropdownlist', (req, res) => {
  db.query(
    'SELECT department.dept_name, courses.course_name FROM courses NATURAL JOIN department',
    (err, results) => {
      if (err) {
        return res.send(err);
      } else {
        return res.json({
          data: results
        });
      }
    }
  );
});

app.get('/listedBooks', (req, res) => {
  db.query('SELECT * FROM usefor NATURAL JOIN listedbooks', (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json({
        data: results
      });
    }
  });
});

app.get('/searchResults', (req, res) => {
  const { searchInput } = req.query;
  db.query(
    //`SELECT * FROM usefor NATURAL JOIN listedbooks WHERE title LIKE '%${searchInput}%'`,
    `SELECT * FROM listedbooks WHERE title LIKE '%${searchInput}%'`,
    (err, results) => {
      if (err) {
        return res.send(err);
      } else {
        return res.json({
          data: results
        });
      }
    }
  );
});

app.get('/requestedBooksByDept', (req, res) => {
  const { dept } = req.query;
  db.query(
    `SELECT * FROM usefor NATURAL JOIN listedbooks WHERE dept_name = '${dept}'`,
    (err, results) => {
      if (err) {
        return res.send(err);
      } else {
        return res.json({
          data: results
        });
      }
    }
  );
});

app.get('/requestedBooksByDeptByCourse', (req, res) => {
  const { dept, course } = req.query;
  db.query(
    `SELECT * FROM usefor NATURAL JOIN listedbooks WHERE dept_name = '${dept}' && course_name = '${course}'`,
    (err, results) => {
      if (err) {
        return res.send(err);
      } else {
        return res.json({
          data: results
        });
      }
    }
  );
});

app.get('/addUser', (req, res) => {
  console.log('added a user');
  const { username, email, password } = req.query;
  const INSERT_USER_QUERY = `INSERT INTO users (email,username,password) VALUES( '${email}','${username}','${password}')`;
  db.query(INSERT_USER_QUERY, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json({
        data: results
      });
    }
  });
});

app.get('/login', (req, res) => {
  const { email } = req.query;
  db.query(`SELECT * FROM users WHERE email = '${email}'`, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json({
        data: results
      });
    }
  });
});


app.get('/addListing', (req, res) => {
  const { bookName, bookEdition, bookISBN, bookPrice, bookType, bookCondition } = req.query;
  console.log("in book listing", bookName, bookEdition, bookISBN, bookPrice, bookType, bookCondition);
  const INSERT_USER_QUERY = `INSERT INTO listedbooks(title, edition, isbn, price, book_type, book_condition) 
	VALUES ('${bookName}','${bookEdition}','${bookISBN}','${bookPrice}', '${bookType}', '${bookCondition}')`;
  db.query(INSERT_USER_QUERY, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json({
        data: results
      });
    }
    console.log("successfully added book to listing");
  });
});

// handling the file upload
app.get('/upload', (req, res) => {
  
  let { fileData, fileName } = req.query;
  // fileData = fileData + Buffer.from("'data:image/png").toString('base64');
  console.log("in backend upload", fileData);


  // fs.writeFile('./uploads/image.png', base64Image, {encoding: 'base64'}, function(err) {
  //   console.log('File created');
  // });
  // fs.writeFile('./myfile.png', fileData , { flag: 'w' }, function(err) {
  //   if (err) 
  //       return console.error(err); 
  //   // fs.readFile('./myfile.png', 'utf-8', function (err, data) {
  //   //     if (err)
  //   //         return console.error(err);
  //   //     console.log(data);
  //   // });
  // });

  fs.writeFile('../uploads/test2.png', fileData, function(err) { 
    if (err) 
        return console.error(err); 
  });

  // base64Img.img(b, '../uploads', 'test2.png', function(err, filepath) {});

});


app.get("/image.png", (req, res) => {
  res.sendFile(path.join(__dirname, "./uploads/image.png"));
});

app.listen('4000', () => {
  console.log('Server started on port 4000');
});
