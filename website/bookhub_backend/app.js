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
  host: 'localhost',
  user: 'root',
  password: '!Salmonfoodie22',
  database: 'bookhub'
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
    `SELECT * FROM List NATURAL JOIN listedBooks WHERE email = '${email}'`,
    (err, result) => {
      if (err) throw err;
      res.send(result);
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

let useremail;

app.get("/login", (req, res) => {
  const { email } = req.query;
  useremail = email;
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

//list_id that will be used to name the picture and add to list table
let list_id;


app.get("/addListing", (req, res) => {
  const {
    bookName,
    bookEdition,
    bookISBN,
    bookPrice,
    bookType,
    bookCondition,
    useremail
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

  // let list_id;

  const INSERT_USER_QUERY = `INSERT INTO listedbooks(title, edition, isbn, price, book_type, book_condition) 
	VALUES ('${bookName}','${bookEdition}','${bookISBN}','${bookPrice}', '${bookType}', '${bookCondition}')`;
  db.query(INSERT_USER_QUERY, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      list_id = results.list_id;
      return res.json({
        data: results
      });
    }
  });

  // const  LISTSQUERY =`INSERT INTO list (email, list_id) VALUES ('${useremail}', '${list_id}')`;
  // db.query(LISTSQUERY, (err, results) => {
  //   if (err) {
  //     return res.send(err);
  //   } else {
  //     return res.json({
  //       data: results
  //     });
  //   }
  // });

});

// handling the file upload
const storage = multer.diskStorage({
  destination: '../bookhub_frontend/public/uploads',//'../uploads',
  filename: function(req, file, cb){
    cb(null, list_id+"-"+Date.now()+path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single('fileToUpload');

function checkFileType(file, cb) {
  const filetypes = /jped|jpg|png/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if(extname && mimetype){
    return cb(null, true);
  } else {
    return cb("Error: images only");
  }
}

app.post('/uploadfile', (req, res) => {
  upload(req, res, (err) => {
    if(err){
      console.log("error cant upload");
    } else {
      if(req.file == undefined){
        console.log("error no file submitted");
      } else {
        console.log("file uploaded successfully");
      }
    }
  });

  res.redirect(301,'localhost:3000/');

  // const  LISTSQUERY =`INSERT INTO usespic (list_id, filepath) VALUES ('${useremail}', '${req.file.filename}')`;
  // db.query(LISTSQUERY, (err, results) => {
  //   if (err) {
  //     return res.send(err);
  //   } else {
  //     return res.json({
  //       data: results
  //     });
  //   }
  // });
});

app.get('/fileForListing', (req, res) => {
  const {
    picnumber
  } = req.query;
  // console.log("pcinumber",picnumber);
  db.query(`SELECT filepath FROM usespic WHERE filepath LIKE'${picnumber}-%'`, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      // console.log("pcinumber res",results);
      return res.json({
        data: results
      });
    }
  });
});

app.get('/getAllPics', (req, res) => {
  const {
    picnumber
  } = req.query;
  // console.log("pcinumber",picnumber);
  db.query(`SELECT * FROM usespic`, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      // console.log("pcinumber res",results);
      return res.json({
        data: results
      });
    }
  });
});



app.get('/mostCurrentListID', (req, res) => {
  db.query(`SELECT list_id FROM listedbooks ORDER BY list_id DESC LIMIT 1`, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json({
        data: results
      });
    }
  });
});


app.get('/conversation', (req, res) => {
  const {email} = req.query;
  db.query(`(SELECT DISTINCT sender_email 
    FROM messages NATURAL JOIN sender NATURAL JOIN receiver 
    WHERE receiver.receiver_email = '${email}' 
    ORDER BY date) UNION (SELECT DISTINCT receiver_email 
    FROM messages NATURAL JOIN sender NATURAL JOIN receiver 
    WHERE sender.sender_email = '${email}'
    ORDER BY date)`
    , (err, results) =>{
      if(err){
          return res.send(err)
      }
      else {
          return res.json({
              data: results
          })
      }
  });
});


app.get('/messages', (req, res) => {
    const {email, otheremail} = req.query;
    db.query(`SELECT * 
    FROM messages NATURAL JOIN sender NATURAL JOIN receiver 
    WHERE (sender.sender_email = '${email}'  AND receiver.receiver_email = '${otheremail}')
    OR (sender.sender_email = '${otheremail}' AND receiver.receiver_email = '${email}') 
    ORDER BY date;`, (err, results) =>{
        if(err){
            return res.send(err)
        }
        else {
            return res.json({
                data: results
            })
        }
    });
});
// INSERT INTO receiver(receiver_email) VALUES( '${receiver_email}');
// INSERT INTO sender_email(sender_email) VALUES( '${sender_email}')

app.get('/sendMessage', (req, res) => {
  console.log('sent message');
  const {message } = req.query;
  db.query(`INSERT INTO messages(content) VALUES('${message}')`, (err, results) => {
    if (err) {
      return res.send(err);
    } 
    else {
      return res.json({
        data: results
      });
    }
  });
});

app.get('/receiver', (req, res) => {
  console.log('sent receiver');
  const {receiver_email} = req.query;
  db.query(`INSERT INTO receiver(receiver_email) VALUES( '${receiver_email}')`, (err, results) => {
    if (err) {
      return res.send(err);
    }
    else {
      return res.json({
        data: results
      });
    }
  });
});

app.get('/sender', (req, res) => {
  console.log('sent sender');
  const { sender_email} = req.query;
  db.query(`INSERT INTO sender(sender_email) VALUES( '${sender_email}')`, (err, results) => {
    if (err) {
      return res.send(err);
    } 
    else {
      return res.json({
        data: results
      });
    }
  });
});

app.listen("4000", () => {
  console.log("Server started on port 4000");
});
