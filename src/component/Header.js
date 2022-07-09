import React, { useState,useContext, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logoApp from "../assets/img/logo192.png"
import { Link, NavLink, useNavigate } from "react-router-dom";
import { UserContext } from '../context/UserContext'
import { useSelector, useDispatch } from 'react-redux';
import { handleLogoutRedux } from '../redux/actions/userAction'

const Header = (props) => {

    const user = useSelector(state => state.user.user)
    const dispatch = useDispatch() 

    let navigate = useNavigate();
    

    const handleLogOut = () => {
        dispatch(handleLogoutRedux())
    }

    useEffect(() => {
        if(user && user.auth === false) {
            navigate("/")
        }
    }, [user])

    return (
        <>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand>
                        <Link to="/" className="nav-link">
                            <img
                                src={logoApp}
                                width="30"
                                height="30"
                                className="d-inline-block align-top"
                            />
                            <span>Test Fresh</span>
                        </Link>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                    {
                        (user && user.auth || window.location.pathname === "/")  &&
                        <>
                            <Nav className="me-auto">
                                <NavLink to="/" className="nav-link">
                                    Home
                                </NavLink>
                                <NavLink to="/users" className="nav-link">
                                    Manages Users
                                </NavLink>
                            </Nav>
                            <Nav>
                                {
                                    user && user.email ? <span className='nav-link'>Hello {user.email}</span> : <></>
                                }
                                <NavDropdown title="Setting" id="basic-nav-dropdown" className="justify-content-end">
                                    {
                                        user && user.auth === true 
                                    ? 
                                        <NavDropdown.Item onClick={() => handleLogOut()}>
                                            LogOut
                                        </NavDropdown.Item>
                                    :
                                        <Link className="dropdown-item" to="/login">Login</Link>
                                    }
                                </NavDropdown>  
                            </Nav>
                        </>
                    }
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};

export default Header;