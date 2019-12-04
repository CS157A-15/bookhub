import React, { Component } from "react";
import "./Card.css";
import defaultImage from "./default-book.png";

class Card extends Component {
  render() {
    return (
      <div>
        <div class="card shadow-sm" style={{ width: "18rem" }}>
          <img src={defaultImage} class="card-img-top" alt="..." />
          <div class="card-body">
            <h5 class="card-title">{this.props.bookTitle}</h5>
            <p>Price: ${this.props.bookPrice}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Card;
