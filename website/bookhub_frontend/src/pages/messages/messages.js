import React, { Component } from 'react';
import './messages.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from 'react-router-dom';
import { Redirect } from 'react-router';
import Navbar from '../navbar/navbar';
import UserAuth from '../../user_auth';

class Messages extends Component {
    constructor(props){
        super(props)
        this.state = {
            user_email:'',
            username: '',
            messagesSent:[],
            messagesReceived:[],
            selectedMessages:[],
            conversations: [],
            auth: UserAuth.getAuth()
        }
    }

    componentWillMount(){
        if (UserAuth.getAuth() === true) {
            this.setState({user_email: UserAuth.getEmail(), username: UserAuth.getUsername(), auth: UserAuth.getAuth()});
            this.getSentMessages();
            this.getReceivedMessages();
        }
    }

    getSentMessages = async _ => {
        if(this.state.auth === true){
            await fetch(`http://localhost:4000/message_sent?email=${UserAuth.getEmail()}`)
            .then(res => res.json())
            .then(res => this.setState({messagesSent: res.data}))
            .catch(err => console.error(err));
        }   
        this.state.messagesSent.map((e)=>{
            if(this.state.conversations.indexOf(e.sent_to) === -1){
                this.state.conversations.push(e.sent_to);
                console.log(this.state.conversations);
            };
        })
     }

     getReceivedMessages = async _ => {
        if(this.state.auth === true){
            await fetch(`http://localhost:4000/message_received?email=${UserAuth.getEmail()}`)
            .then(res => res.json())
            .then(res => this.setState({messagesReceived: res.data}))
            .catch(err => console.error(err))

            this.state.messagesReceived.map((e)=>{
                if(this.state.conversations.indexOf(e.received_from) === -1){
                    this.state.conversations.push(e.received_from);
                    console.log(this.state.conversations);
                };
            })
        }   
     }

     displayMessages(e){
        for(var i = 0; i<this.state.messagesSent.length;i++){
            if(this.state.messagesSent[i].sent_to !== e){
                this.state.messagesSent.splice(i,1);
            }
        }
    }

    
    
    renderSentMessages = ({content,date,sent_to}) => 
    <div key ={content}>
        Content = {content} date = {date} Sent To = {sent_to}
    </div> 

    renderReceivedMessages = ({content,date,received_from}) => 
    <div key ={content}>
        Content = {content} date = {date} Received From = {received_from}
    </div> 

    renderConversations = (e)=> 
    <div key = {e}>
        <li>
            <a onClick={this.displayMessages(e)}>{e}</a>
        </li>
    </div> 

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
                <ul className="list-unstyled CTAs">
                    <li>
                        <button type="button" className="btn btn-light">New Message</button>
                    </li>
                </ul>
                <ul className="list-unstyled">
                    <p>Messages</p>
                    {this.state.conversations.map(this.renderConversations)}
                </ul>
                </nav>

            {/* <!-- Page Content  --> */}
            <div id="content">
               <Navbar/>
               WELCOME
                {this.state.messagesSent.map(this.renderSentMessages)}
                {this.state.messagesReceived.map(this.renderReceivedMessages)}
            </div>
        </div>
        )
    }
}

export default Messages;