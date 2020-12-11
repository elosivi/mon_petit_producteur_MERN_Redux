import React, { Component } from 'react';
import { connect } from "react-redux";
import { Login_as_Producer, disableRedirection } from "../actions/request";
import { Redirect } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Card } from 'react-bootstrap';
import '../style.css';
import '../loginStyle.css';

/**
 * This component handles the producer login process
 */
class LoginProducer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login: '',
      password: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  /**
  * Updates local state object when a key is pressed
  * @param {*} event
  */
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  // ============================================== L o c a l      L o g i n  ==============================================

  /**
  * Handles form submit button click :
  * mainly, check login authorization
  * @param {*} event
  */
  handleSubmit = (event) => {
    event.preventDefault();
    this.props.Login_as_Producer(this.state.login, this.state.password);
  }

  // ============================================== R e n d e r  ==============================================
  render() {
    if (this.props.redirection) {
      this.props.disableRedirection();
      return <Redirect to='/Home' />;
    }
    return (
      <div className="mainContainer center myContainer">
        <h2>Toujours ravis de revoir un de nos producteurs favoris !</h2>

        {/***************************** login form ************************************/}
        <Card className="login bigShadow">
          <Card.Body>
            <Form onSubmit={this.handleSubmit}>

              <Form.Group controlId="formBasicEmail">
                <Form.Control
                  type="text"
                  name="login"
                  placeholder="identifiant"
                  value={this.state.login}
                  onChange={this.handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="mot de passe"
                  value={this.state.password}
                  onChange={this.handleChange}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="log">Se connecter</Button>
            </Form>
            <p className="error">{this.props.error}</p>
          </Card.Body>
        </Card>
        <br></br>

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
    data: state.data,
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
    Login_as_Producer: (name, email) => dispatch(Login_as_Producer(name, email)),
    disableRedirection: () => dispatch(disableRedirection())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginProducer);