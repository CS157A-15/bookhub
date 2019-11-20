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
import CarouselItem from '../../component/Carousel.js';
import axios, { post } from 'axios';

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
  handleImageChange = async (e) =>{
    e.preventDefault();

    let reader = new FileReader();
    let files = e.target.files;

    // let object = new ActiveXObject("Scripting.FileSystemObject");

    // reader.onloadend = () => {
    //   this.setState({
    //     file: file,
    //     imagePreviewUrl: reader.result
    //   })
    // }

    // reader.readAsDataURL(files[0]);
    // reader.onload = (e) => {
    //   const url =  "http://localhost:4000/upload";
    //   const formData = { file: e.target.result}
    //   return post(url, formData)
    //     .then(response => console.warn("result", response));
    // }

    // fetch(`http://localhost:4000/upload`)
    //   .then(res =>{ console.log("inside upload call frontend")});


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
              {/* <button onClick={this.uploadHandler}><input className="fileInput" type="file" onChange = {(e) => this.handleImageChange(e)}/></button> */}
              <form  action="/upload" method="POST" enctype="multipart/form-data">
                <input type="file" name="file"/>
                <input type="submit" value="Submit"/>
                <img src="/image.png" />
              </form>
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
