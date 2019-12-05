const express = require("express");
const mysql = require("mysql");
const app = express();
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const base64ToImage = require("base64-img");
const fs = require("fs");

// Create connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password", //'!Salmonfoodie22',
  database: "bookhub"
});

// Connect
db.connect(err => {
  if (err) {
    console.log(err);
  }
});

app.use(cors());

app.get("/", (req, res) => {
  res.send("go to /books to see books");
});

app.get("/", express.static(path.join(__dirname, "./public")));

app.get("/books", (req, res) => {
  db.query("SELECT * FROM listedbooks", (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json({
        data: results
      });
    }
  });
});

app.get("/courses", (req, res) => {
  db.query("SELECT * FROM courses", (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json({
        data: results
      });
    }
  });
});

app.get("/department", (req, res) => {
  db.query("SELECT * FROM department", (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json({
        data: results
      });
    }
  });
});

app.get("/userListings", (req, res) => {
  const { email } = req.query;
  db.query(
    `SELECT * FROM List NATURAL JOIN ListedBooks WHERE email = '${email}'`,
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
});

app.get("/deleteListing", (req, res) => {
  const { email, listID } = req.query;
  db.query(
    `DELETE FROM List WHERE email = '${email}' AND list_id = '${listID}'`,
    (err, result) => {
      if (err) throw err;
      res.send("Removed Listing with User");
    }
  );
});

app.get("/deleteListedBook", (req, res) => {
  const { listID } = req.query;
  db.query(
    `DELETE FROM ListedBooks where list_id = ${listID}`,
    (err, result) => {
      if (err) throw err;
      res.send("Removed Book Listing");
    }
  );
});

app.get("/profile", (req, res) => {
  const { email } = req.query;
  db.query(`SELECT * FROM users WHERE email = '${email}'`, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.get("/dropdownlist", (req, res) => {
  db.query(
    "SELECT department.dept_name, courses.course_name FROM courses NATURAL JOIN department",
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

app.get("/listedBooks", (req, res) => {
  db.query("SELECT * FROM usefor NATURAL JOIN listedbooks", (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json({
        data: results
      });
    }
  });
});

app.get("/searchResults", (req, res) => {
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

app.get("/requestedBooksByDept", (req, res) => {
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

app.get("/requestedBooksByDeptByCourse", (req, res) => {
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

app.get("/addUser", (req, res) => {
  console.log("added a user");
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

app.get("/login", (req, res) => {
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

app.get("/addListing", (req, res) => {
  const {
    bookName,
    bookEdition,
    bookISBN,
    bookPrice,
    bookType,
    bookCondition
  } = req.query;
  console.log(
    "in book listing",
    bookName,
    bookEdition,
    bookISBN,
    bookPrice,
    bookType,
    bookCondition
  );
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

// const upload = multer({
//   dest: "C:/Users/xinru/Documents/bookhub/website"
//   // you might also want toset some limits: https://github.com/expressjs/multer#limits
// });

app.get("/upload", (req, res) => {
  let { fileData, fileName } = req.query;
  // fileData = Buffer.from(fileData, '').toString('base64');
  console.warn("in backend upload", fileData);
  // fileData =  fileData[0].replace(/^data:image\/png;base64,/, "");
  // fileData = fileData.replace(/(\r\n|\n|\r)/gm, "");
  // console.warn(fileData);
  // console.log(fileData);
  // const file = `${__dirname}/uploads/${fileName}`;
  // res.download(file); // Set disposition and send it.
  // base64Img.img(fileData, './uploads', fileName, function(err, filepath) {});
  // let base64Image = fileData.split(';base64,').pop();

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

  fs.writeFile("../uploads/test1.png", fileData, function(err) {
    if (err) return console.error(err);
  });
});

// app.post("/upload",
//   (req, res) => {
//     alert(req);
//     alert(res);
//     console.sleep(1000);
//   }
// );

app.get("/image.png", (req, res) => {
  res.sendFile(path.join(__dirname, "./uploads/image.png"));
});

app.get("/conversation", (req, res) => {
  const { email } = req.query;
  db.query(
    `(SELECT DISTINCT sender_email 
    FROM messages NATURAL JOIN sender NATURAL JOIN receiver 
    WHERE receiver.receiver_email = '${email}' 
    ORDER BY date) UNION (SELECT DISTINCT receiver_email 
    FROM messages NATURAL JOIN sender NATURAL JOIN receiver 
    WHERE sender.sender_email = '${email}'
    ORDER BY date)`,
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

app.get("/messages", (req, res) => {
  const { email, otheremail } = req.query;
  db.query(
    `SELECT * 
    FROM messages NATURAL JOIN sender NATURAL JOIN receiver 
    WHERE (sender.sender_email = '${email}'  AND receiver.receiver_email = '${otheremail}')
    OR (sender.sender_email = '${otheremail}' AND receiver.receiver_email = '${email}') 
    ORDER BY date;`,
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
// INSERT INTO receiver(receiver_email) VALUES( '${receiver_email}');
// INSERT INTO sender_email(sender_email) VALUES( '${sender_email}')

app.get("/sendMessage", (req, res) => {
  console.log("sent message");
  const { message } = req.query;
  db.query(
    `INSERT INTO messages(content) VALUES('${message}')`,
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

app.get("/receiver", (req, res) => {
  console.log("sent receiver");
  const { receiver_email } = req.query;
  db.query(
    `INSERT INTO receiver(receiver_email) VALUES( '${receiver_email}')`,
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

app.get("/sender", (req, res) => {
  console.log("sent sender");
  const { sender_email } = req.query;
  db.query(
    `INSERT INTO sender(sender_email) VALUES( '${sender_email}')`,
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

app.listen("4000", () => {
  console.log("Server started on port 4000");
});
