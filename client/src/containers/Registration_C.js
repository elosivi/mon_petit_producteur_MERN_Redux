import React, { Component } from 'react';
import { connect } from "react-redux";
import { Register, disableRedirection } from "../actions/request";
import { Redirect } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Card } from 'react-bootstrap';
import '../style.css';
import '../loginStyle.css';

// ============================================== C o n s u m e r     R e g i s t r a t i o n   ==============================================
/**
 * This component handles the register process for consumer
 */
class RegistrationConsumer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login: "",
      email: "",
      password: "",
      password_confirmation: "",
      zip_code: ""
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  /**
  * Handles form submit button click :
  * mainly, requests the register route with form informations
  * @param {*} event
  */
  handleSubmit(event) {
    event.preventDefault();
    this.props.Register(
      this.state.login,
      this.state.email,
      this.state.zip_code,
      this.state.password,
      this.state.password_confirmation
    );   
  }

  /**
  * Updates local state object when a key is pressed
  * @param {*} event
  */
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  render() {
    if (this.props.redirection) {
      this.props.disableRedirection();
      return <Redirect to='/login' />;
    }
    return (
      <div className="mainContainer center myContainer" >
        <h2>Inscription</h2>
        <Card className="login center bigShadow">
          <Card.Body>
            <Form onSubmit={this.handleSubmit}>

              <Form.Group controlId="formBasicLogin">
                <Form.Control
                  type="text"
                  name="login"
                  placeholder="identifiant"
                  value={this.state.login}
                  onChange={this.handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formBasicEmail">
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="nom@email.com"
                  value={this.state.email}
                  onChange={this.handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formBasicZipcode">
                <Form.Control
                  type="text"
                  name="zip_code"
                  placeholder="31000"
                  value={this.state.zip_code}
                  onChange={this.handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="P4ssw0rd"
                  value={this.state.password}
                  onChange={this.handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formBasicPasswordConf">
                <Form.Control
                  type="password"
                  name="password_confirmation"
                  placeholder="P4ssw0rd"
                  value={this.state.password_confirmation}
                  onChange={this.handleChange}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="log">S'enregistrer</Button>
            </Form>
            <p class="error">{this.props.error}</p>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

/**
 * Data are extracted from Redux Store and passed as props to component
 * @param {*} state 
 */
const mapStateToProps = state => {
  return {
      error: state.error,
      loading: state.loading,
      redirection: state.redirection
  };
}

/**
 * Component actions are dispatched to Redux Store
 * @param {*} dispatch 
 */
const mapDispatchToProps = dispatch => {
  return {
      Register: (login, email, zip_code, password, password_confirmation) => dispatch(Register(login, email, zip_code, password, password_confirmation)),
      disableRedirection: () => dispatch(disableRedirection())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationConsumer);
