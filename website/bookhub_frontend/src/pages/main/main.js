import React, { Component } from 'react';
import './main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardTitle,
  MDBCardText,
  MDBCol
} from 'mdbreact';
import Navbar from './navbar/navbar';
import CollapseButton from './../../component/CollapseButton.js';
import Upload from './../../component/UploadBox.js';
import CarouselItem from '../../component/Carousel.js';
import axios, { post } from 'axios';
import FileSaver from 'file-saver';


let books = [];
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      depts: [],
      courses: [],
      dropdownlist: [],
      query_dept: undefined,
      query_course: undefined,
      searchInput: undefined
    };
  }


  componentDidMount() {
    this.getBooks();
    this.getDepartments();
    this.getDropdownList();
  }

  getBooks = () => {
    fetch('http://localhost:4000/books')
      .then(res => res.json())
      .then(res => {
        this.setState({ books: res.data });
        books = res.data;
      })
      .catch(err => console.error(err));
  };

  getDepartments = () => {
    fetch('http://localhost:4000/department')
      .then(res => res.json())
      .then(res => this.setState({ depts: res.data }))
      .catch(err => console.error(err));
  };

  getDropdownList = () => {
    fetch('http://localhost:4000/dropdownlist')
      .then(res => res.json())
      .then(res => this.setState({ dropdownlist: res.data }))
      .catch(err => console.error(err));
  };

  getRequestedBooksDeptCourse = async (dept, course) => {
    fetch(
      `http://localhost:4000/requestedBooksByDeptByCourse?dept=${dept}&course=${course}`
    )
      .then(res => res.json())
      .then(res => {
        this.setState({ books: res.data });
        books = res.data;
      })
      .catch(err => console.error(err));
  };

  getRequestedBooksDept = async query_dept => {
    fetch(`http://localhost:4000/requestedBooksByDept?dept=${query_dept}`)
      .then(res => res.json())
      .then(res => {
        this.setState({ books: res.data });
        books = res.data;
      })
      .catch(err => console.error(err));
  };

  getSearchResults = async SQLParam => {
    let q = `http://localhost:4000/searchResults?searchInput=${SQLParam}`;
    console.log(q);
    fetch(
      `http://localhost:4000/searchResults?searchInput=${SQLParam}`
    )
      .then(res => res.json())
      .then(res => {
        this.setState({ books: res.data });
        books = res.data;
      })
      .catch(err => console.error(err));


  };

  uploadFiles = async(fileName, fileData) => {
    fetch(`http://localhost:4000/upload?fileData=${fileData}&fileName=${fileName}`,  {mode: 'no-cors'})
      .catch(err => console.error(err));
  };

  //----------------------------------- Handeling the serach ---------------------------------
  handleSearch = e => {
    // console.log('handleSearch from main');
    this.setState({ searchInput: e.target.value });
  };

  enterPressed = event => {
    console.log('enterPressed from main');

    var code = event.keyCode || event.which;
    if (code === 13) {
      //13 is the enter keycode
      event.preventDefault();

      let searchWords = this.state.searchInput.trim().split(' ');
      console.log(searchWords);
      this.getSearchResults(this.generateSQLSearchParam(searchWords));
    }

  };

  //----------------- Generate where condition for the query ---------------------------------
  generateSQLSearchParam(searchWords) {
    let SQLSearchParam = '';
    for (let i = 0; i < searchWords.length; i++) {
      console.log(searchWords[i]);
      if (i === 0) {
        SQLSearchParam += `${searchWords[i]}`;
      } else {
        SQLSearchParam += `OR title LIKE '%${searchWords[i]}%' `;
      }
    }

    return SQLSearchParam;
  }

  //-----------------------Side bar: Query Books by Course and Dept -------------------------------
  getBooksByCourse = async e => {
    let course = e.currentTarget.id;
    let dept = e.currentTarget.className;
    this.setState({ query_course: course });
    this.setState({ query_dept: dept });
    this.getRequestedBooksDeptCourse(dept, course);
  };

  //-----------------------Side bar: Query Books by Dept -------------------------------------
  getBooksByDept = e => {
    const dept = e.currentTarget.id;
    this.setState({ query_dept: dept });
    this.getRequestedBooksDept(dept);
  };

  //----------------------- Rendering the sidebar dropdown -------------------------------------
  renderDropdown = () => {
    let dropdown = this.state.dropdownlist;
    let dept = 'blah';
    let button_list = [];
    let li_array = [];
    if (dropdown.length > 0) {
      for (let i = 0; i < dropdown.length; i++) {
        if (dropdown[i].dept_name !== dept) {
          //if not equal to dept name add classes of prev dep & set dept to current dept name
          //getting the previous ul and adding the list items to it before creating another unordered list
          dept = dropdown[i].dept_name;
          li_array = [];
          li_array.push(
            <div id={dept} onClick={e => this.getBooksByDept(e)}>
              <li>
                <a>ALL </a>
              </li>
            </div>
          );
          li_array.push(
            <div
              id={dropdown[i].course_name}
              className={dept}
              onClick={e => this.getBooksByCourse(e)}
            >
              <li>
                <a>{dropdown[i].course_name} </a>
              </li>
            </div>
          );
          button_list.push(
            <div id={dept}>
              <CollapseButton
                button_name={dept}
                collapse_content={
                  <ul className="list-unstyled components">{li_array}</ul>
                }
              />
            </div>
          );
        } else {
          //if the dept name does not change. keep on adding classes under that name
          li_array.push(
            <div
              id={dropdown[i].course_name}
              className={dept}
              onClick={e => this.getBooksByCourse(e)}
            >
              <li>
                <a>{dropdown[i].course_name} </a>
              </li>
            </div>
          );
        }
      }
    }

    return <div id="button_list">{button_list}</div>;
  };

  //----------------------- Creating cards book data -------------------------------------
  renderBooks = ({
    list_id,
    title,
    edition,
    isbn,
    price,
    book_type,
    book_condition
  }) => (
      <div className="card-inline" key={list_id}>
        <MDBCol>
          <MDBCard style={{ width: '17rem' }}>
            {/* <MDBCardImage
            className="img-fluid"
            src="https://www.qualtrics.com/m/assets/blog/wp-content/uploads/2018/08/shutterstock_1068141515.jpg"
            waves
          /> */}
            <MDBCardBody>
              <MDBCardTitle>{title}</MDBCardTitle>
              <MDBCardText>
                Edition: {edition}, ISBN: {isbn}
              </MDBCardText>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  {' '}
                  Book Condition: {book_condition}
                </li>
                <li className="list-group-item"> Price: ${price}</li>
              </ul>
              <MDBBtn className="btn btn-primary">Contact</MDBBtn>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </div>
    );
  //----------------------- Handling the file upload-------------------------------------
  handleImageChange = async (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let files = e.target.files;
    let base64 ="";
    reader.readAsDataURL(files[0]);

    // let blob = this.b64toBlob(files);
    // FileSaver.saveAs(blob, "image.png");
    // let object = new ActiveXObject("Scripting.FileSystemObject");

    reader.onloadend = () => {
      // this.setState({
      //   file: file,
      //   imagePreviewUrl: reader.result
      // })'
  
      base64 = reader.result;

      console.log(base64);
      
      // const imageBuffer = this.decodeBase64Image(base64);
      // console.log("image buffer ", imageBuffer);
      
      let base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
      console.log(base64Data);

      const buf = Buffer.from(base64Data).toString('base64');
      console.log("buf", buf);

      this.uploadFiles("name", buf); //sending the data to the backend
      
      // let base64Image = base64.split(';base64,').pop();
      // fs.writeFile('image.png', base64Image, { encoding: 'base64' }, function (err) {
      //   console.log('File created');
      // });
    }

    // let base64Image = base64.split(';base64,').pop();
    // fs.writeFile('image.png', base64Image, { encoding: 'base64' }, function (err) {
    //   console.log('File created');
    // });


    // reader.onload = (e) => {
    //   const url =  "http://localhost:4000/upload";
    //   const formData = { file: e.target.result}
    //   return post(url, formData)
    //     .then(response => console.warn("result", response));
    // }

    // fetch(`http://localhost:4000/upload`)
    //   .then(res =>{ console.log("inside upload call frontend")});


  }

  //https://stackoverflow.com/questions/20267939/nodejs-write-base64-image-file
  decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
      response = {};
  
    if (matches.length !== 3) {
      return new Error('Invalid input string');
    }
  
    response.type = matches[1];
    
    response.data = Buffer.from(matches[2]).toString('base64');
    console.log("matches[2]",matches[2] );

    return response;
  }

  //https://stackoverflow.com/questions/27980612/converting-base64-to-blob-in-javascript
  b64toBlob(dataURI) {

    // let byteString = atob(dataURI.split(',')[1]);
    // let ab = new ArrayBuffer(byteString.length);
    // let ia = new Uint8Array(ab);
    let imgType = 'image/jpeg';
    const sliceSize = 512;

    // for (let i = 0; i < byteString.length; i++) {
    //     ia[i] = byteString.charCodeAt(i);
    // }


    const byteCharacters = atob(dataURI);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    if (dataURI.contains("jpeg")) {
      imgType = 'image/jpeg';
    } else if (dataURI.contains("png")) {
      imgType = 'image/png';
    }

    return new Blob(byteArrays, { type: imgType });
  }

  uploadHandler = () => { }
  //----------------------- Handling the file download after upload -------------------------------------


  render() {
    return (
      <div className="wrapper">
        <nav id="sidebar" align="center">
          <div className="sidebar-header">
            <img
              className="center"
              width="100"
              height="100"
              src="https://upload.wikimedia.org/wikipedia/en/thumb/e/ec/San_Jose_State_Spartans_logo.svg/378px-San_Jose_State_Spartans_logo.svg.png"
              alt="SJSU SAMMY"
            />
            <h3>Bookhub</h3>
          </div>
          <ul className="list-unstyled CTAs">
            <li>
              {/* <button type="button" className="btn btn-light">
                Add Book
              </button> */}
              {/* <input className="fileInput" type="file" onChange={(e) => this.handleImageChange(e)} /> */}
              <input className="fileInput" type="file" accept="image/png, image/jpeg" onChange={(e) => this.handleImageChange(e)} />
              <Upload/>
              {/* <form action="/upload" method="POST" enctype="multipart/form-data">
                <input type="file" name="file"/>
                <input type="submit" value="Submit"/>
               <img src="/image.png" /> 
              </form> */}
            </li>
          </ul>
          <ul className="list-unstyled components">
            <p>Categories</p>
            {this.renderDropdown()}
          </ul>
        </nav>

        {/* <!-- Page Content  --> */}
        <div id="content">
          <Navbar handleSearch={this.handleSearch} enterPressed={this.enterPressed} />
          {/* <h1> Welcome to SJSU Bookhub, {this.props.location.state.username} </h1> */}
          <div className="card-inline">
            {this.state.books.map(this.renderBooks)}
            {/* {<CarouselItem imgs={array}></CarouselItem>} */}
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
