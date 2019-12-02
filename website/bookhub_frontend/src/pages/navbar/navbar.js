import React, { Component } from "react";
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse, MDBFormInline,
        MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBBtn} from "mdbreact";
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import UserAuth from '../../user_auth';
class Navbar extends Component {
state = {
  isOpen: false,
  authorize: UserAuth.getAuth()
};


  toggleCollapse = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  // _handleSearch = e => {
  //   console.log('handleSearch from navbar');
  //   console.log(e.target.value);
  //   this.setState({ searchInput: e.target.value });
  // };

  // _enterPressed(event) {
  //   var code = event.keyCode || event.which;
  //   if (code === 13) {
  //     //13 is the enter keycode
  //     console.log(this.state.searchInput);
  //     console.log(this.state.books);
  //   }
  //   this.getSearchResults();
  //   return this.state.books;
  // }

auth= _=>{
  UserAuth.setAuth(false);
  this.setState({authorize:UserAuth.getAuth()});
}


render() {
  if (this.state.authorize == false) {
    return <Redirect push to="/" />;
  }
    return (
      <Router>
        <MDBNavbar color="indigo" dark expand="md">
          <MDBNavbarBrand>
            <strong className="white-text">Bookhub</strong>
          </MDBNavbarBrand>
          <MDBNavbarToggler onClick={this.toggleCollapse} />
          <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
            <MDBNavbarNav left>
              <MDBNavItem active>
                <MDBNavLink to="/Main">Home</MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBNavLink to="#!">Profile</MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBNavLink to="#!">Messages</MDBNavLink>
              </MDBNavItem>
            </MDBNavbarNav>
            <MDBNavbarNav right>
              <MDBNavItem>
                <MDBFormInline waves>
                  <div className="md-form my-0">
                    <input
                      className="form-control mr-sm-2"
                      type="text"
                      placeholder="Search"
                      aria-label="Search"
                      onChange={e => {
                        this.props.handleSearch(e);
                      }}
                      onKeyPress={ e =>{
                        this.props.enterPressed(e);
                      }}
                    />
                  </div>
                </MDBFormInline>
              </MDBNavItem>
              <MDBNavbarNav right>
              <MDBBtn color="primary" onClick={this.auth} type="submit">Logout</MDBBtn>
              </MDBNavbarNav>
            </MDBNavbarNav>
          </MDBCollapse>
        </MDBNavbar>
      </Router>
    );
  }
}
export default Navbar;

