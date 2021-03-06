import { Redirect } from "react-router-dom";
import React, { Component } from "react";
import {Navbar, Button} from 'react-bootstrap';
import logo from'../img/logo.png';
import Login from './login';
import Signup from './signup';
import './navbar.css';
import Search from './search';

class NYUNavBar extends Component {
    constructor(props) {
        super(props);
		this._isMounted = false;
		this.state = {loggedIn : true}
		this.signoutHandler = this.signoutHandler.bind(this);
	}
	
	signoutHandler(){
		this.setState({loggedIn:false});
		localStorage.setItem('jwtToken',null);
		localStorage.setItem('userID',null);
		localStorage.setItem('role',null);
	}

    render () {
		if (!this.state.loggedIn) {
            return <Redirect to='/'/>;
        }
		if ((localStorage.getItem('jwtToken') + "") != "null") {
			return (
				<Navbar bg="nyu" variant="dark">
					<Navbar.Brand href="/">
						<img src={logo} height="42" width="200" alt="ez-nyu-logo">
						</img>
					</Navbar.Brand>
					<Search/>
					<Button href={`/userprofile/${localStorage.getItem('userID')}`} variant="outline-light">My Profile</Button>
					<Button variant="outline-light" onClick={this.signoutHandler}>Sign Out</Button>
				</Navbar>
			)
		} else {
			return (
				<Navbar bg="nyu" variant="dark">
					<Navbar.Brand href="/">
						<img src={logo} height="42" width="200" alt="ez-nyu-logo">
						</img>
					</Navbar.Brand>
					<Search/>
					<Login buttonLocation="navbar"/>
					<Signup buttonLocation="navbar"/>
				</Navbar>
			)
		}
	}
}
  
export default NYUNavBar;

