import React, { Component } from 'react';
import './messages.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import Navbar from '../navbar/navbar';
import UserAuth from '../../user_auth';
import { MDBBtn, MDBInput } from 'mdbreact';

class Messages extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user_email:'',
            sendMessage:'',
            username: '',
            other_email:'',
            conversationSelected: 0,
            conversations: [],
            messages:[],
            auth: UserAuth.getAuth()
        }
    }

    componentWillMount() {
        if (UserAuth.getAuth() === true) {
            this.setState({user_email: UserAuth.getEmail(), username: UserAuth.getUsername(), auth: UserAuth.getAuth(),conversationSelected: 0});
            // this.getSentMessages();
            // this.getReceivedMessages();
            this.getMessages();
            this.getConversations();
        }
    }

    getConversations = async _ => {
        if(this.state.auth === true){
            await fetch(`http://localhost:4000/conversation?email=${UserAuth.getEmail()}`)
            .then(res => res.json())
            .then(res => this.setState({conversations: res.data}))
            .catch(err => console.error(err));
        }   
        this.state.conversations.map((e)=>{
                console.log(e);
        })
     }

     getMessages = async e => {
        if(e === undefined){
             console.log("CLICK ONE OF THE BUTTONS");
         }
        else if(this.state.auth === true){
            this.setState({other_email: e});
            await fetch(`http://localhost:4000/messages?email=${UserAuth.getEmail()}&otheremail=${e}`)
            .then(res => res.json())
            .then(res => this.setState({messages: res.data}))
            .catch(err => console.error(err));
            this.state.conversations.map((k)=>{
                console.log(k);
            });
        }
    };
    
    renderMessages = ({message_id, content,date,sender_email,receiver_email}) =>{
        var align;
        var message;
        if(sender_email === UserAuth.getEmail()){
            align = "right";
            message = "mine messages"
        }
        else{
            align = "left"
            message = "yours messages"
        }
        return <div key ={message_id} align= {align}  className={message}>
            <div className="message">
            {content}
            </div>
        </div> 
    }
    

    btnConversation = async e => {
        const id = e.target.id;
        this.setState({conversationSelected: 1});
        this.setState({other_email:id})
        console.log("e.id =",id);
        this.getMessages(id);
    };
        
    renderConversations = ({sender_email}) => 
    <button id={sender_email} type="button" class="btn btn-primary" onClick={this.btnConversation}>{sender_email}</button> 

    render(){
        if (this.state.auth === false) {
            return <Redirect push to="/" />;
        }
        return (
            <div className="wrapper">
                <nav id="sidebar" align="center">
                <div className="sidebar-header">
                    <img  className="center" width="100" height="100" src="https://upload.wikimedia.org/wikipedia/en/thumb/e/ec/San_Jose_State_Spartans_logo.svg/378px-San_Jose_State_Spartans_logo.svg.png" alt = "SJSU SAMMY"/>
                    <h3>Bookhub</h3>
                </div>
                {/* <ul className="list-unstyled CTAs">
                    <li>
                        <button type="button" className="btn btn-light">New Message</button>
                    </li>
                </ul> */}
                <ul className="list-unstyled">
                    <p>Messages</p>
                    <div id="button_list">
                    {this.state.conversations.map(this.renderConversations)}
                    </div>
                </ul>
                </nav>

            {/* <!-- Page Content  --> */}
            <div id="content">
                <Navbar/>
                {this.showMessages()}       
            </div>
        </div>
        )
    }

    showMessages = _=>{
        if(this.state.conversationSelected === 1){
            return (
                <div>
                    <div className="chat">
                        {this.state.messages.map(this.renderMessages)}
                    </div>
                    <div>
                        <div id="input-area">
                        <MDBInput id="text_input" label="Type Your Message" rows="1" class="md-textarea form-control" style= {{width: "70vw"}} onChange={e =>this.setState({sendMessage: e.target.value})}/>
                        </div>
                        <div id="send">
                            <button className="btn btn-light" style= {{align: "center"}} type="submit" onClick={this.sendMessage}> Send</button>
                        </div>
                    </div>
                </div>
            )
        }
        else{
            return <div style={{fontStyle: "oblique" ,fontSize: "500%", textAlign: "center"}}>Select a Conversation</div>
        }
    }

    sendMessage = async _=>{
        console.log(this.state.sendMessage);
        console.log(this.state.other_email);
        console.log(this.state.user_email);
        await fetch(`http://localhost:4000/sendMessage?message=${this.state.sendMessage}`)
        .then(res => res.json())
        .catch(err => console.error(err));

        await fetch(`http://localhost:4000/sender?sender_email=${this.state.user_email}`)
        .then(res => res.json())
        .catch(err => console.error(err));

        await fetch(`http://localhost:4000/receiver?receiver_email=${this.state.other_email}`)
        .then(res => res.json())
        .catch(err => console.error(err));
        this.getMessages(this.state.other_email);
        
        this.text_input.value = "";
    }
}
export default Messages;