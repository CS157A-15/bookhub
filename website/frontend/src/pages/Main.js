import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

class Main extends Component {
    state = {

    }

    render() {
        return(
            <div>
                <Navbar bg="primary" variant="dark">
                    <Navbar.Brand href="#Main">BookHub</Navbar.Brand>
                    <Nav className="mr-auto">
                        {/* buttons for the Nav bar will got here  
                         here is an example:
                         <Nav.Link href="#home">Home</Nav.Link>
                         */}
                    </Nav>   
                    <Form inline>
                         <FormControl type="text" placehoder="Search" className="mr-sm-2"/>
                         <Button variant="outline-info">Search</Button>
                    </Form>            
                </Navbar>
            </div>
        )
    }
}
export default Main;