import React, { Component } from 'react';
import { connect } from "react-redux";
import { LocalLogin, SaveGoogleData, disableRedirection } from "../actions/request";
import { GoogleLogin } from 'react-google-login';
import { Redirect } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Card } from 'react-bootstrap';
import '../style.css';
import '../loginStyle.css';

/**
 * This component handles the two methods of login (own check and via Google OAuth)
 */
class LoginConsumer extends Component {
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
    this.props.LocalLogin(this.state.login, this.state.password);
  }
  // ============================================== G o o g l e      L o g i n  ==============================================

  /**
   * Callback function handling both Google Login success and failure
   * @param {*} response
   */
  responseGoogle = (response) => {
    if (response.error) {
      return;
    }
    console.log(response);
    console.log(response.profileObj);
    this.props.SaveGoogleData(response.profileObj.name, response.profileObj.email);
  }

  // ============================================== R e n d e r  ==============================================
  render() {
    if (this.props.redirection) {
      this.props.disableRedirection();
      return <Redirect to='/Home' />;
    }
    return (
      <div className="mainContainer center myContainer loginC">
        <h2>Enchantés de vous revoir ! </h2>
        <p className="subtitle">( ... en plus... les producteurs ont posté un panier rempli de nouveautés, toutes fraiches, qui n'attendent que votre palais!)</p>

        {/***************************** login form ************************************/}
        <Card className=" bigShadow  login ">
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
        {/* </Card> */}
        <br></br>

        {/***************************** with google ************************************/}

        {/* <Card className="login bigShadow"> */}
          <GoogleLogin
              className="google"
              clientId="187935886903-cpfl4c742hbg66u48vs063aqoh5p01bk.apps.googleusercontent.com"
              buttonText="Se connecter avec Google"
              onSuccess={this.responseGoogle}
              onFailure={this.responseGoogle}
              cookiePolicy={'single_host_origin'} />
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
    LocalLogin: (name, email) => dispatch(LocalLogin(name, email)),
    SaveGoogleData: (name, email) => dispatch(SaveGoogleData(name, email)),
    disableRedirection: () => dispatch(disableRedirection())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginConsumer);