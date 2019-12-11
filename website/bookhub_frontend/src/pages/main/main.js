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
  MDBView,
  MDBInput
} from 'mdbreact';
import UserAuth from '../../user_auth';
import Navbar from '../navbar/navbar.js';
import CollapseButton from './../../component/CollapseButton.js';
import Upload from './../../component/UploadBox.js';
import CarouselItem from '../../component/Carousel.js';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Popover from '@material-ui/core/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import Card from './../../component/Card.js';




let books = [];
let picpaths = [];
let currentListID;
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
      sendMessage: "",
      messageReceiver: '',
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
        currentListID = res.data;
        // console.log("currentListID", this.state.currentListID[0].list_id);
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
    var path = "../../../uploads/" + list_id +".jpg" ;
    var defaultPic = "../../../uploads/book_default.jpg";
    // if (this.state.pics) { //picpaths.length !== 0
    //   const thePic = (element) => element.list_id === list_id ;
    //   const index = this.state.pics.findIndex(thePic);
    //   console.log("thPic", thePic);
    //   console.log("this.state.pics[index]", picpaths[index]);
    //   let path = "../../../uploads/book_default.jpg";

    //   if(picpaths[index] !== undefined){
    //     path = "../../../uploads/" +picpaths[index].filepath;
    //   } 

      return (
        <div className="card-inline" key={title}>
          <MDBCol>
            <MDBCard style={{ width: '17rem' }}>
              <MDBCardImage
                className="img-fluid"
               src={path}
               onError={(ev) => ev.target.src=defaultPic}
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
                {/* variant="popover" */}
              <PopupState  variant="popover" popupId="demo-popup-popover">
              {popupState => (
                <div>
                  <Button  color="primary" {...bindTrigger(popupState)}>
                    Contact
                  </Button>
                  <Popover
                    {...bindPopover(popupState)}
                    anchorOrigin={{
                      height: "100%",
                      width: "50vw",
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      height: "100%",
                      width: "50vw",
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                  >
                     
                    <Box p={5}>
                     <p align="top"> Message</p>
                     {/* onChange={e =>this.setState({sendMessage: e.target.value})} */}
                    <input id="message_box" type="textbox" rows="5" label="Type you message" onChange={e =>this.setState({sendMessage: e.target.value})}  />
                    <Button  color="primary" onClick={this.message.bind(this,{list_id})}>Send</Button>
                    </Box>
                  </Popover>
                </div>
              )}
            </PopupState>

              {/* <button className="btn btn-primary" onClick={this.message.bind(this,{list_id})}>Contact</button> */}
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </div>);
    }
  // }

async message(list_id){
  console.log(list_id.list_id);
  console.log(this.state.sendMessage);
  document.getElementById("message_box").value="";
  await fetch(`http://localhost:4000/bookOwner?list_id=${list_id.list_id}`)
  .then(res => res.json())
  .then(res => res.data.map((p)=> this.setState({messageReceiver: p.email})))
  .catch(err => console.error(err));


  console.log("message ",this.state.sendMessage);
  await fetch(`http://localhost:4000/sendMessage?message=${this.state.sendMessage}`)
  .then(res => res.json())
  .catch(err => console.error(err));

  console.log("sender", UserAuth.getEmail());
  await fetch(`http://localhost:4000/sender?sender_email=${UserAuth.getEmail()}`)
  .then(res => res.json())
  .catch(err => console.error(err));

  console.log("receiver",this.state.messageReceiver);
  await fetch(`http://localhost:4000/receiver?receiver_email=${this.state.messageReceiver}`)
  .then(res => res.json())
  .catch(err => console.error(err));
}

  //----------------------- Handling the file download after upload -------------------------------------


  render() {
    // let cards = [];
    // if (picpaths.length !== 0 && this.state.pics && this.state.pics.length !== 0) {
    //   cards = this.state.books.map(b => this.renderBooks(b.list_id, b.title, b.edition, b.isbn, b.price, b.book_type, b.book_condition));

    // }


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
              <Upload />
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
            {/* {cards} */}
            {this.state.books.map(b => this.renderBooks(b.list_id, b.title, b.edition, b.isbn, b.price, b.book_type, b.book_condition))}
          </div>
        </div>
      </div>
    );
  }
}

export default Main;