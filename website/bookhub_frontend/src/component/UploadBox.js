import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import './UploadBox.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import UserAuth from '../../user_auth';

function UploadBox(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          List a book
          </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Book information</h4>
        <Container>
          <Row>
            <Col>
              <form>

                <input type="text" name="bookname" /><p>Book name:</p>

                <input type="text" name="bookedition" /><p>Book Edition(put 0 if none):</p>

                <input type="text" name="bookisbn" /><p>ISBN (starts with 978...):</p>

                <select name="bookcondition">
                  <option value="new">new</option>
                  <option value="gently used">gently used</option>
                  <option value="worn">worn</option>
                </select><p>Book condition</p>

                <select name="booktype">
                  <option value="paperback">paperback</option>
                  <option value="hardcover">hardcover</option>
                </select><p>Book type</p>

                <input type="number" name="bookprice" />   <p>Listing Price</p>
                <input type="submit" value="Submit" onClick={(e) => addListing(e)} />
                {/* <Button onClick={addListing()}>Submit</Button> */}
              </form>
            </Col>
            <Col>
              <p>Upload pictures</p>
              <form action="http://localhost:4000/uploadfile" method="POST" encType="multipart/form-data">
                <input type="file" name="fileToUpload" id="fileToUpload" />
                <input type="submit" value="Upload Image" name="submit"></input>
                {/* <Button as="input" type="submit" value="Submit" /> */}
              </form>
            </Col>
          </Row>
        </Container>

      </Modal.Body>
      <Modal.Footer>
        <Button onClick={ (e) => {addListing(e); props.onHide} }>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
// props.onHide
function addListing(event) {
  event.preventDefault();
  console.log("in add listiing");
  const name = document.getElementsByName("bookname")[0];
  const edition = document.getElementsByName("bookedition")[0];
  const isbn = document.getElementsByName("bookisbn")[0];
  const price = document.getElementsByName("bookprice")[0];
  const type = document.getElementsByName("booktype")[0];
  const condition = document.getElementsByName("bookcondition")[0];

  if (name && edition && isbn && price && type && condition) {
    fetch(`http://localhost:4000/addListing?bookName=${name.value}&bookEdition=${edition.value}&bookISBN=${isbn.value}
    &bookPrice=${price.value}&bookType=${type.value}&bookCondition=${condition.value}&user=${UserAuth.getEmail()}`)
      .then(res => res.json())
      .then(res => {
      })
      .catch(err => console.error(err));


    //clearing form input
    name.value = "";
    edition.value = "";
    isbn.value = "";
    price.value = "";
    type.value = "";
    condition.value = "";
  }
};

export default function Upload() {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <ButtonToolbar>
      <Button id="listbook" variant="primary" onClick={() => setModalShow(true)}>
        List a book
          </Button>

      <UploadBox
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </ButtonToolbar>
  );
}
