import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Profile.css";
import Navbar from "../navbar/navbar.js";
import defaultIcon from "./default-user-icon.jpg";
import UserAuth from "../../user_auth";
import {MDBCard, MDBCardBody, MDBCardTitle,MDBCardText, MDBCol,MDBCardImage} from 'mdbreact';
import CarouselItem from '../../component/Carousel.js';
import Button from 'react-bootstrap/Button';
import Box from '@material-ui/core/Box';
import Popover from '@material-ui/core/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import { Redirect } from 'react-router';


class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      profile_picture: undefined,
      email:'',
      auth: UserAuth.getAuth(),
      listings: []
    };
  }

  componentWillMount() {
    if (UserAuth.getAuth() === true) {
      this.setState({user: UserAuth.getUsername(),email: UserAuth.getEmail()});
      this.getUserListing();
    }
  }

  // async getUserData(){
  //   await fetch(`http://localhost:4000/profile?email=${UserAuth.getEmail()}`) // user info
  //   .then(res => res.json())
  //   .then(data => {
  //     this.setState({
  //       user: data[0].username,
  //       email: data[0].email
  //     });
  //   });
  // }

 async getUserListing(){
  await fetch(`http://localhost:4000/userListings?email=${UserAuth.getEmail()}`) // user listings
    .then(res => res.json())
    .then(data => {
      this.setState({
        listings: data
      });
    });
    console.log(this.state.listings);
  }

  async deleteListing(listID){
    console.log(listID + UserAuth.getEmail());

    await fetch(`http://localhost:4000/deleteListedBook?listID=${listID}`) // user listings
    .then(res => res.json());

    await fetch(`http://localhost:4000/deleteListing?email=${UserAuth.getEmail()}&listID=${listID}`) // user listings
    .then(res => res.json());

    this.getUserListing();

  }

  async updateListing(listID){
    //event.preventDefault();
    console.log("in add listiing");
    console.log(listID);

    const name = document.getElementsByName("bookname")[0];
    const edition = document.getElementsByName("bookedition")[0];
    const isbn = document.getElementsByName("bookisbn")[0];
    const price = document.getElementsByName("bookprice")[0];
    const type = document.getElementsByName("booktype")[0];
    const condition = document.getElementsByName("bookcondition")[0];
    if (name && edition && isbn && price && type && condition) {
      console.log("book attributes", name.value, edition.value, isbn.value,
        price.value, type.value, condition.value);
    await fetch(`http://localhost:4000/updateListedBook?listID=${listID}&bookName=${name.value}&bookEdition=${edition.value}&bookISBN=${isbn.value}&bookPrice=${price.value}&bookType=${type.value}&bookCondition=${condition.value}`)
      .then(res => res.json())
      .catch(err => console.error(err));

      this.getUserListing();
  }
}

  render() {
    if (this.state.auth === false) {
        return <Redirect push to="/" />;
    }
    
    let { user, listings, email, profile_picture } = this.state;

    // if user has no profile picture use default
    if (profile_picture === undefined) {
     this.setState({profile_picture: defaultIcon});
      console.log(profile_picture);
    }

    const profileListings = listings.map(listing => {
      var path = "../../../uploads/" + listing.list_id +".jpg" ;
      var defaultPic = "../../../uploads/book_default.jpg";
      return (
        <div className="col-md-4 pb-3" key={listing.list_id}>
          <MDBCol>
            <MDBCard style={{ width: '17rem' }}>
              <MDBCardImage
                className="img-fluid"
               src={path}
               onError={(ev) => ev.target.src=defaultPic}
                waves
              />
            <MDBCardBody>
              <MDBCardTitle>{listing.title}</MDBCardTitle>
              <MDBCardText>
                Edition: {listing.edition}, ISBN: {listing.isbn}
              </MDBCardText>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  {' '}
                  Book Condition: {listing.book_condition}
                </li>
                <li className="list-group-item"> Type: {listing.book_type}</li>
                <li className="list-group-item"> Price: ${listing.price}</li>
              </ul>
              {/* variant="popover" */}
              <div id="delete-b" >
              <PopupState  id="delete-b" variant="popover" popupId="demo-popup-popover">
              {popupState => (
                <div>
                  <button type="button" class="btn btn-danger" style={{fontSize:"10px"}} {...bindTrigger(popupState)}>
                    Delete
                  </button>
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
                    <Box align="center" p={5}>
                     <p align="top" style={{fontSize:"15px"}}> Are you sure you want to delete this book?</p>
                     <button type="button" class="btn btn-danger" onClick={this.deleteListing.bind(this,listing.list_id)}>Delete</button>
                    </Box>
                  </Popover>
                </div>
              )}
            </PopupState>
            </div>
            <div id="edit-b">
            <PopupState id="edit-b" variant="popover" popupId="demo-popup-popover">
              {popupState => (
                <div>
                 <button type="button" class="btn btn-warning" style={{fontSize:"10px"}}{...bindTrigger(popupState)}>
                    Edit
                  </button>
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
                    <input type="text" name="bookname" defaultValue={listing.title}/><p>Book name:</p>

                    <input type="text" name="bookedition" defaultValue={listing.edition} /><p>Book Edition:</p>

                    <input type="text" name="bookisbn" defaultValue={listing.isbn} /><p>ISBN</p>

                    <select name="bookcondition" defaultValue={listing.book_condition}>
                      <option value="new">new</option>
                      <option value="gently used">gently used</option>
                      <option value="worn">worn</option>
                    </select><p>Book condition</p>

                    <select name="booktype" defaultValue={listing.book_type}>
                      <option value="paperback">paperback</option>
                      <option value="hardcover">hardcover</option>
                    </select><p>Book type</p>

                    <input type="number" name="bookprice" defaultValue={listing.price}/><p>Listing Price</p>
                    <button type="button" class="btn btn-warning" onClick={this.updateListing.bind(this,listing.list_id)}>Update</button>
                    </Box>
                  </Popover>
                </div>
              )}
            </PopupState>
            </div>
              {/* <button className="btn btn-primary" onClick={this.message.bind(this,{list_id})}>Contact</button> */}
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        </div>
      );
    });

    return (
      <div>
        <Navbar />
        <div className="Top">
          <header class="page-cover">
            <div class="text-center">
              {console.log(this.state.profile_picture)}
              <img
                src={this.state.profile_picture}
                width="140"
                height="140"
                border="0"
                class="rounded-circle"
              />
              <h2 class="h4 mt-2 mb-0">{this.state.user}</h2>
              <p class="text-muted">{this.state.email}</p>
            </div>
          </header>
        </div>
        <div class="Inner">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item active" aria-current="page">
                <strong>{this.state.user}'s Active Listings</strong>
                {console.log(this.state.email)}
              </li>
            </ol>
          </nav>
          <div class="album py-3">
            <div class="container">
              <div class="row">{profileListings}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
