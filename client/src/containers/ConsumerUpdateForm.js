import React, { Component } from 'react';
import { connect } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Card } from 'react-bootstrap';
import {UpdateConsumer, DeleteConsumer, CheckAuth} from '../actions/request'


class MyInformations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login:"",
            email:"",
            zip_code:"",
            password:"",
            password_confirmation:"",
            askForUpdate: false,
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    /**
     * Update local state object when a key is being pressed
     * @param  {*} event
     */

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    /**
     * Open the update form when being pressed
     * @param  {*} event
     */

    handleClick(event) {
        this.setState({
            askForUpdate: true
        })
    }

    /**
     * This method make sure to submit form
     * @param  {*} event
     */

    handleSubmit(event) {
        event.preventDefault();
        console.log("this.state sended to update: ",this.state)// test dev phase
        this.props.UpdateConsumer(
            this.state.login,
            this.state.email,
            this.state.zip_code,
            this.state.password,
            this.state.password_confirmation,
        );
        console.log( " * handleSubmit -> this.props.updateSuccess ", this.props.updateSuccess)
        console.log( " * handleSubmit -> this.props.updateError ", this.props.updateError)
    }

    /**
     * Close the update form when being pressed and takes no parameter
     * @param  {*}
     */

    handleCancel() {
        this.setState({
            askForUpdate: false,
            // message :" Pour mettre à jour votre profil, reconnectez vous s'il vous plait"
        })
        this.props.CheckAuth();
    }

    /**
     * This method handle the action of deleting one consumer profile when being pressed.
     * @param  {*}
     */


    handleDelete(){
        console.log(" * delete my profile !:", this.props.data._id ," in consumerUpdateForm.js")
        this.props.DeleteConsumer(this.props.data._id)
    }

    render() {
        const askForUpdate = this.state.askForUpdate;
        console.log(" * askForUpdate", askForUpdate);
        console.log(" * error: ", this.props.updateError);
        console.log(" * success: ",this.props.updateSuccess);

        return (
            <div>
                {askForUpdate
                ?
                <div>
                    <h3 className="modifyProfile">Modifier mon profil : </h3>
                    <Card className="center" body outline color="info">
                        <Card.Body className="">
                            <Form onSubmit={this.handleSubmit}>

                                <Form.Group controlId="formBasicLogin">
                                    <Form.Control
                                        type="text"
                                        name="login"
                                        placeholder="modifier mon login"
                                        value={this.state.login}
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formBasicEmail">
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        placeholder="modifier mon email"
                                        value={this.state.email}
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formBasicZipCode">
                                    <Form.Control
                                        type="text"
                                        name="zip_code"
                                        placeholder="modifier mon code postal"
                                        value={this.state.zip_code}
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword">
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        placeholder="modifier mon mot de passe"
                                        value={this.state.password}
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formBasicPasswordConf">
                                <Form.Control
                                    type="password"
                                    name="password_confirmation"
                                    placeholder="confirmer le password"
                                    value={this.state.password_confirmation}
                                    onChange={this.handleChange}
                                />
                                <p className="error">{this.props.updateError}</p>
                                <p className="success">{this.props.updateSuccess}</p>

                                </Form.Group>
                                    <Button variant="outline-info" type="submit">Modifier</Button>
                                <Button style={{marginLeft:'2%'}} variant="outline-danger" onClick={this.handleCancel}>Fermer</Button>
                            </Form>

                        </Card.Body>
                    </Card>
                </div>
                :
                <div>
                    <div>
                        <p>Login : {this.props.data.login} </p>

                    </div>
                    <div>
                       <p>Email : {this.props.data.email}</p>
                    </div>
                    <div>
                       <p>Zip code : {this.props.data.zip_code}</p>
                    </div>
                    <p className="error">{this.state.message}</p>

                    <div >
                        <Button variant="outline-info" onClick={() => this.handleClick()}> Mettre à jour mon profil</Button>
                    </div>
                    <div style={{marginTop:'2%'}}>
                        <Button variant="outline-danger" onClick={() => this.handleDelete()}> Supprimer mon profil</Button>
                    </div>

                </div>
                }


            </div>
        )
    }
}

/**
 * Data are extracted from Redux Store and passed as props to component.
 * @param  {*} state
 */

const mapStateToProps = state => {
    return {
      data: state.data,
      error:state.error,
      loading: state.loading,
      message:state.message,
      updateSuccess:state.updateSuccess,
      updateError: state.updateError,
    };
  }

/**
 * Component actions are dispatched to Redux Store.
 * @param  {*} dispatch
 */

const mapDispatchToProps = dispatch => {
    return {
        UpdateConsumer : (login, email, password, zip_code) => dispatch(UpdateConsumer(login, email, password, zip_code)),
        DeleteConsumer : (id) => dispatch(DeleteConsumer(id)),
        CheckAuth : () => dispatch(CheckAuth()),
    };
  };

  export default connect(mapStateToProps, mapDispatchToProps)(MyInformations);
