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
  MDBCol,
  MDBCarouselItem,
  MDBView
} from 'mdbreact';
import Navbar from '../navbar/navbar.js';
import CollapseButton from './../../component/CollapseButton.js';
import Upload from './../../component/UploadBox.js';
import CarouselItem from '../../component/Carousel.js';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Card from './../../component/Card.js';




let books = [];
let picpaths = [];
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      depts: [],
      courses: [],
      dropdownlist: [],
      pics: [],
      query_dept: undefined,
      query_course: undefined,
      searchInput: undefined,
      picpath: undefined,
      currentListID: 0
    };

  }


  componentDidMount() {
    this.getBooks();
    this.getDepartments();
    this.getDropdownList();
    this.getMostCurrentListID();
    this.getPics();
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

  getPics = () => {
    fetch('http://localhost:4000/getAllPics')
      .then(res => res.json())
      .then(res => {
        this.setState({ pics: res.data });
        picpaths= res.data;
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

  getMostCurrentListID = () => {
    fetch(
      `http://localhost:4000/mostCurrentListID`
    )
      .then(res => res.json())
      .then(res => {
        this.setState({ currentListID: res.data });
        console.log("currentListID", this.state.currentListID[0].list_id);
      })
      .catch(err => console.error(err));
  }

  //----------------------------------- Handeling the serach ---------------------------------
  handleSearch = e => {
    this.setState({ searchInput: e.target.value });
  };

  enterPressed = event => {
    let code = event.keyCode || event.which;
    if (code === 13) {
      //13 is the enter keycode
      event.preventDefault();

      let searchWords = this.state.searchInput.trim().split(' ');
      this.getSearchResults(this.generateSQLSearchParam(searchWords));
    }

  };

  //----------------- Generate where condition for the query ---------------------------------
  generateSQLSearchParam(searchWords) {
    let SQLSearchParam = '';
    for (let i = 0; i < searchWords.length; i++) {
      if (i === 0) {
        SQLSearchParam = SQLSearchParam.concat(searchWords[i]);
      } else {
        SQLSearchParam = SQLSearchParam.concat("%20" + searchWords[i]);
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
    let button_list = [
      <div onClick={() => this.getBooks()}>
        <Button>All listed books</Button>
      </div>
    ];
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
  //----------------------- Creating carousel for cards -------------------------------------
  createCItemList(imgs) {
    let carouselItems = [];
    for (let i = 0; i < imgs.length; i++) {
      // let cItem = 
      carouselItems.push(
        <MDBCarouselItem itemId={i + 1}>
          <MDBView>
            <img
              className="d-block w-100"
              src={imgs[i]}
              id={"img" + i}
            />
          </MDBView>
        </MDBCarouselItem>
      );
    }
    return carouselItems;
  }

  //----------------------- Creating cards book data -------------------------------------
  renderBooks = (
    list_id,  //using this to get the picture
    title,
    edition,
    isbn,
    price,
    book_type,
    book_condition
  ) => {

    if (picpaths.length !== 0) {
      const thePic = (element) => element.list_id === list_id;
      const index = this.state.books.findIndex(thePic);
      // console.log("this.state.pics[index]", picpaths[index].filepath);
      // const path1 = (picpaths[index].filepath)?"../../../uploads/" +picpaths[index].filepath:
      let path = "https://www.qualtrics.com/m/assets/blog/wp-content/uploads/2018/08/shutterstock_1068141515.jpg";

      if(picpaths[index] !== undefined){
        path = "../../../uploads/" +picpaths[index].filepath;
      } 

      return (
        <div className="card-inline" key={title}>
          <MDBCol>
            <MDBCard style={{ width: '17rem' }}>
              <MDBCardImage
                className="img-fluid"
                src={path}
                // src={"../../../uploads/" + picpaths[index].filepath}
                //this.state.picpath}//"../../../uploads/8-59473928754.jpg"
                waves
              />

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
                  <li className="list-group-item"> Type: {book_type}</li>
                  <li className="list-group-item"> Price: ${price}</li>
                </ul>
                <MDBBtn className="btn btn-primary">Contact</MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </div>);
    }
    
  };

  //----------------------- Handling the file download after upload -------------------------------------


  render() {
    let cards = [];
    if (picpaths.length !== 0 && this.state.pics && this.state.pics.length !== 0) {
      cards = this.state.books.map(b => this.renderBooks(b.list_id, b.title, b.edition, b.isbn, b.price, b.book_type, b.book_condition));

    }

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
              <Upload list_id={this.state.currentListID} />
            </li>
          </ul>
          <ul className="list-unstyled components">
            <p>Categories</p>
            {this.renderDropdown()}
          </ul>
        </nav>

        {/* <!-- Page Content  --> */}
        {/* {citems = this.createCItemList(testImg)} */}
        <div id="content">
          <div id="search"><Navbar handleSearch={this.handleSearch} enterPressed={this.enterPressed} /></div>
          {/* <h1> Welcome to SJSU Bookhub, {this.props.location.state.username} </h1> */}
          <div className="card-inline" id="cards">
            {cards}
            {/* {this.state.books.map(b => this.renderBooks(b.list_id, b.title, b.edition, b.isbn, b.price, b.book_type, b.book_condition))} */}
            {/* {this.state.books.map(this.renderBooks())} */}
            {/* {<CarouselItem imgs={array}></CarouselItem>} */}
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
