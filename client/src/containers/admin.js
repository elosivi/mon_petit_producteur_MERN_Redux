import React, { Component } from 'react';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Jumbotron, Container, Table} from 'reactstrap';
import '../style.css';
import {connect} from "react-redux";
import {
    GetAllProducersData,
    DeleteProducerFromAdminList,
    UpdateGPSProducer,
    UpdateStatusProducer
} from "../actions/request";
import Popup from "reactjs-popup";
import {Form,Button} from "react-bootstrap";


class Admin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            gps_Coordinates:'',
            status:'',
        }
    }

    /**
     * Updates local state object when a key is being pressed
     * @param  {*} event
     */

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    /**
     * This method is called after the component gets mounted on the DOM.
     * @param  {*}
     */

    componentDidMount() {
        this.props.GetAllProducersData();
    }

    render() {
        return (
            <div className="mainContainer center producer-profile">
                <div>
                    <Jumbotron className="jumbotron" fluid>
                        <Container fluid>
                            <h1 className="display-3" text-center>Espace Administrateur</h1>
                            <p className="lead" text-center> Bienvenue sur l'espace administrateur ! Merci de traiter <span style={{textDecoration: 'underline'}} >les profils en attente de validation </span> </p>
                        </Container>
                    </Jumbotron>
                </div>
                    <div className="portrait" id="portrait">
                        <Table striped>
                            <thead>
                            <tr>
                                <th>Login</th>
                                <th>Farm Name</th>
                                <th>Addresse</th>
                                <th>Zip_Code</th>
                                <th>City</th>
                                <th>Contact</th>
                                <th>GPS state</th>
                                <th>Status</th>
                                <th>Delete</th>
                            </tr>
                            </thead>
                            {this.props.allProducers.map(id => {
                                return(
                                    <tbody>
                                    <tr>
                                        <td>{id.login}</td>
                                        <td>{id.farmName}</td>
                                        <td>{id.address}</td>
                                        <td>{id.zipCode}</td>
                                        <td>{id.city}</td>
                                        <td><a style={{color:'black'}} href={`mailto:${id.email}`}>{id.email}</a></td>
                                        <td>
                                            <Popup trigger={<Button variant="outline-info">{id.gpsCoordinates}</Button>} position="bottom center">
                                            <Form onSubmit={(event) => {this.props.UpdateGPSProducer(id._id, this.state.gps_Coordinates); event.preventDefault();}}>
                                                <Form.Group controlId="formBasicContent">
                                                    <label>
                                                        Please enter valid GPS Coordinates :
                                                        <Form.Control
                                                            name="gps_Coordinates"
                                                            placeholder="GPS Coordinates"
                                                            value={this.state.gps_Coordinates}
                                                            onChange={this.handleChange}
                                                        />
                                                    </label>
                                                    <Button variant="primary" type="submit" className="log">Submit </Button>
                                                </Form.Group>
                                            </Form>
                                        </Popup>
                                        </td>
                                        <td>
                                            <Popup trigger={<Button variant="outline-success">{id.status}</Button>} position="bottom center">
                                            <Form onSubmit={(event) => {this.props.UpdateStatusProducer(id._id, this.state.status); event.preventDefault();}}>
                                                <Form.Group controlId="formBasicContent">
                                                    <label>
                                                        Please select a status:
                                                         <Form.Control
                                                            as="select"
                                                            name="status"
                                                            value={this.state.status}
                                                            onChange={this.handleChange}>
                                                            <option>---SELECT---</option>
                                                            <option>waiting</option>
                                                            <option>accepted</option>
                                                             <option>refused</option>
                                                            </Form.Control>
                                                    </label>
                                                <Button variant="primary" type="submit" className="log">Submit </Button>
                                            </Form.Group>
                                        </Form>
                                        </Popup>
                                        </td>
                                        <td> <Button variant="outline-danger" onClick={() => this.props.DeleteProducerFromAdminList(id._id)}>Delete</Button></td>
                                    </tr>
                                    </tbody>
                                );
                            })}
                        </Table>
                    </div>
                </div>
        );
    }
}

/**
 * Data are extracted from Redux Store and passed as props to component.
 * @param  {*} state
 */

const mapStateToProps = state => {
    return {
        allProducers: state.allProducers,
        isLoggedIn:state.isLoggedIn,
        data: state.data,
        error: state.error,
        loading: state.loading
    };
}

/**
 * Component actions are dispatched to Redux Store.
 * @param  {*} dispatch
 */

const mapDispatchToProps = dispatch => {
    return {
        GetAllProducersData: () => dispatch(GetAllProducersData()),
        DeleteProducerFromAdminList:(producer_id) => dispatch(DeleteProducerFromAdminList(producer_id)),
        UpdateGPSProducer: (producer_id, gps_Coordinates)=>dispatch(UpdateGPSProducer(producer_id, gps_Coordinates)),
        UpdateStatusProducer: (producer_id, producer_status)=>dispatch(UpdateStatusProducer(producer_id, producer_status))
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(Admin) ;
