import React, { useRef, useState } from "react";
import axios from "../axios";
import { Navbar, Button, Nav, NavDropdown, Container } from "react-bootstrap";
import "../CSS/Navigation.css";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/userSlice";
import { useNavigate } from "react-router-dom";

function Navigation() {
  const history = useNavigate();
  const user = useSelector((state) => state.user);


  const dispatch = useDispatch();

  function handleLogout() {
    history("/");
    dispatch(logout());
  }
  const unreadNotifications = user?.notifications?.reduce((acc, current) => {
    if (current.status == "unread") return acc + 1;
    return acc;
}, 0);


  return (
    <Navbar bg="light" expand="lg">
      <Container>
      

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* if no user*/}

            {!user && (
              <LinkContainer to="/">
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>
            )}
               
    

            {/* if user*/}
            {user && (
              <>
            
              <NavDropdown title={`${user.email}`} id="basic-nav-dropdown">
                {user.isAdmin ? (
                  <>
                     <LinkContainer to="/feedbacks">
                      <NavDropdown.Item>Feedbacks</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/feedbacks/add">
                      <NavDropdown.Item>Post Feedback to Forum</NavDropdown.Item>
                    </LinkContainer>
                   </>
                ) : (
                  <>
                    <LinkContainer to="/feedbacks">
                      <NavDropdown.Item>Forums</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/feedbacks/add">
                      <NavDropdown.Item>Post Feedback to Forum</NavDropdown.Item>
                    </LinkContainer>
                   
                  </>
                )}

                <NavDropdown.Divider />
                <Button
                  variant="danger"
                  onClick={handleLogout}
                  className="logout-btn"
                >
                  Logout
                </Button>
              </NavDropdown>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
     
    </Navbar>
  );
}

export default Navigation;
