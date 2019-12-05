import React, { Component } from "react";
import "./Card.css";
import { Modal } from "react-bootstrap";
import defaultImage from "./default-book.png";
import { Redirect } from "react-router-dom";

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      listID: this.props.listID,
      email: this.props.email
    };
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  delete(email, listID) {
    fetch(
      `http://localhost:4000/deleteListing?email=${email}&listID=${listID}`
    );
    fetch(`http://localhost:4000/deleteListedBook?listID=${listID}`);
  }

  render() {
    return (
      <div>
        <div class="card shadow-sm" style={{ width: "18rem" }}>
          <img src={defaultImage} class="card-img-top" alt="..." />
          <div class="card-body">
            <h5 class="card-title">{this.props.bookTitle}</h5>
            <p>Price: ${this.props.bookPrice}</p>
            <button className="btn btn-danger" onClick={this.open}>
              Remove
            </button>
          </div>
        </div>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton />
          <Modal.Body>
            <p>Are you sure you want to remove this listing?</p>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-dark" onClick={this.close}>
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={this.delete(this.props.email, this.props.listID)}
            >
              Remove
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Card;
