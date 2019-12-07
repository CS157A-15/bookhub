import React, { Component } from "react";
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBCardTitle,
    MDBCardText,
    MDBCol,
  } from 'mdbreact';
  import 'bootstrap/dist/css/bootstrap.min.css';

export default class Card extends Component {
    render() {
        return (
            <div className="card-inline" key={this.props.book.title}>
                <MDBCol>
                    <MDBCard style={{ width: '17rem' }}>
                        <MDBCardImage
                            className="img-fluid"
                            src={this.props.path}//"../../../uploads/8-59473928754.jpg"//"https://www.qualtrics.com/m/assets/blog/wp-content/uploads/2018/08/shutterstock_1068141515.jpg"
                            waves
                        />

                        <MDBCardBody>
                            <MDBCardTitle>{this.props.book.title}</MDBCardTitle>
                            <MDBCardText>
                                Edition: {this.props.book.edition}, ISBN: {this.props.book.isbn}
                            </MDBCardText>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    {' '}
                                    Book Condition: {this.props.book.book_condition}
                                </li>
                                <li className="list-group-item"> Type: {this.props.book.book_type}</li>
                                <li className="list-group-item"> Price: ${this.props.book.price}</li>
                            </ul>
                            <MDBBtn className="btn btn-primary">Contact</MDBBtn>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </div>
        );
    }

}