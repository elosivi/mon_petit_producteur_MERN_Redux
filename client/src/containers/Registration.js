import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style.css';
import '../loginStyle.css';

/**
 * This component role is to guide consumer or producer to the correct register page
 */
class Registration extends Component {
  render() {
    return (
      <div className="login">
        <div className="myContainer">

          <Row className="justify-content-center align-middle">
            <h2 className="turquoise">Je veux rejoindre l'aventure !</h2>
          </Row>

          <Row className="justify-content-center">
            <h2 className="taupe">... en tant que ...</h2>
          </Row>

          <Row className="justify-content-center">
          <Link className="link consumer" to="/registration/consumer" title="Consommateur">Consommateur</Link>
          <Link className="link producer" to="/registration/producer" title="Producteur">Producteur</Link>
          </Row>

        </div>
      </div>
    );
  }
}

export default Registration;
