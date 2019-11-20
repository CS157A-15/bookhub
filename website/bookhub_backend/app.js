const express = require('express');
const mysql = require('mysql');
const app = express();
const cors = require('cors');
const multer = require("multer");
const path = require("path");

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
  db.query('SELECT * FROM BOOKS', (err, results) => {
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
  // let SQLSearchParam =``;
  // for (let i = 0; i < searchInput.length; i++) {
  //   console.log(searchInput[i]);
  //   if (i === 0) {
  //     SQLSearchParam += `${searchInput[i]}`;
  //   } else {
  //     SQLSearchParam += `OR title LIKE '%${searchInput[i]}%' `;
  //   }
  // }
  db.query(
    `SELECT * FROM usefor NATURAL JOIN listedbooks WHERE title LIKE '%${searchInput}%'`,
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


// handling the file upload
// app.post('/upload', (req, res) => {
//   // create an incoming form object
//   let form = new formidable.IncomingForm();

//   // specify that we want to allow the user to upload multiple files in a single request
//   form.multiples = true;

//   // store all uploads in the /uploads directory
//   form.uploadDir = path.join(__dirname, '../../../uploads');

//   // every time a file has been uploaded successfully,
//   // rename it to it's orignal name
//   form.on('file', function(field, file) {
//     logger.info(`Uploaded: "${file.name}"`);
//     fs.rename(file.path, path.join(form.uploadDir, file.name));
//   });

//   // log any errors that occur
//   form.on('error', function(err) {
//     errorLogger.error('During file upload: ' + err);
//   });

//   // once all the files have been uploaded, send a response to the client
//   form.on('end', function() {
//     res.end('success');
//   });

//   // parse the incoming request containing the form data
//   form.parse(req);
// });

const upload = multer({
  dest: "C:/Users/xinru/Documents/bookhub/website"
  // you might also want toset some limits: https://github.com/expressjs/multer#limits
});

app.post(
  "/upload",
  upload.single("file" /* name attribute of <file> element in your form */),
  (req, res) => {
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, "./../uploads/image.png");

    if (path.extname(req.file.originalname).toLowerCase() === ".png") {
      fs.rename(tempPath, targetPath, err => {
        if (err) return handleError(err, res);

        res
          .status(200)
          .contentType("text/plain")
          .end("File uploaded!");
      });
    } else {
      fs.unlink(tempPath, err => {
        if (err) return handleError(err, res);

        res
          .status(403)
          .contentType("text/plain")
          .end("Only .png files are allowed!");
      });
    }
  }
);

app.get("/image.png", (req, res) => {
  res.sendFile(path.join(__dirname, "./uploads/image.png"));
});

app.listen('4000', () => {
  console.log('Server started on port 4000');
});
