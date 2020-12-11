import React, { Component } from 'react';
import { connect } from "react-redux";
import { RegisterProducer, disableRedirection, SearchForCoordinates, GetCityFromList, ResetError } from "../actions/request";
import { Redirect } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Card } from 'react-bootstrap';
import '../style.css';
import '../loginStyle.css';

// ============================================== C o n s u m e r     R e g i s t r a t i o n   ==============================================
/**
 * This component handles the register process for producer
 */
class RegistrationProducer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login: "",
      farmName: "",
      email: "",
      phone: "0659458596",
      producerPresentation: "Salut c'est moi ! Bon pour la suite je ne sais pas quoi mettre, j'essaye juste d'avoir les 50 characters, est-ce que c'est bon avec ça en plus ?",
      farmPresentation: "C'est chez moi ici ! Bon pour la suite je ne sais pas quoi mettre, j'essaye juste d'avoir les 50 characters, est-ce que c'est bon avec ça en plus ?",
      productsPresentation: "C'est mes produits là ! Bon pour la suite je ne sais pas quoi mettre, j'essaye juste d'avoir les 50 characters, est-ce que c'est bon avec ça en plus ?",
      address: "",
      zipCode: "",
      city: "Maville",
      gpsCoordinates: [],
      password: "",
      password_confirmation: "",
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleZipCodeChange = this.handleZipCodeChange.bind(this);
    this.handleSelectCityChange = this.handleSelectCityChange.bind(this);
  }

  /**
  * Handles form submit button click :
  * mainly, requests the register producer route with form informations
  * @param {*} event
  */
  handleSubmit(event) {
    event.preventDefault();
    this.props.RegisterProducer(
      this.state.login,
      this.state.farmName,
      this.state.email,
      this.state.phone,
      this.state.producerPresentation,
      this.state.farmPresentation,
      this.state.productsPresentation,
      this.state.address,
      this.state.zipCode,
      this.state.city,
      this.state.gpsCoordinates,
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

  /**
  * Updates local state object zipCode property when a key is pressed
  * Requests all cities corresponding to zipCode
  * @param {*} event
  */
  handleZipCodeChange(event) {
    const zipCodeContent = event.currentTarget.value;
    this.setState({
      zipCode: zipCodeContent
    })
    if (zipCodeContent.length === 5) {
      this.props.SearchForCoordinates(zipCodeContent);
    }
  }

  /**
  * Updates local state object gpsCoordinates and
  * city name when a city name is selected
  * @param {*} event
  */
  handleSelectCityChange(event) {
    this.props.ResetError();
    const GPSCoordinates = event.target.value;
    if (GPSCoordinates === "default") {
      return;
    }
    const infosCity = GPSCoordinates.split(";")
    const LatLng = [infosCity[0], infosCity[1]];
    const cityName = infosCity[2]
    this.setState({
      gpsCoordinates: LatLng,
      city: cityName
    })
  }

  render() {

    // Cities list from zip code
    let citiesInSelect = null;
    const cities = this.props.cities;
    if (cities.length > 0) {
      const listCities = cities.map((city) => {
        return <option 
                  key={city.code}
                  value={city.centre.coordinates[1] + ';' + city.centre.coordinates[0] + ';' + city.nom}>
                  {city.nom}
                </option>;
      })
      citiesInSelect = 
        <select onChange={this.handleSelectCityChange}>
          <option value="default">Précisez votre commune</option>
          {listCities}
        </select>;
    }

    if (this.props.redirection) {
      this.props.disableRedirection();
      return <Redirect to='/login' />;
    }

    return (
      <div className="mainContainer center myContainer" >
        <h2>Inscription en tant que producteur</h2>
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

              <Form.Group controlId="formBasicFarmName">
                <Form.Control
                  type="text"
                  name="farmName"
                  placeholder="nom de la ferme"
                  value={this.state.farmName}
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

              <Form.Group controlId="formBasicAddress">
                <Form.Control
                  type="text"
                  name="address"
                  placeholder="adresse"
                  value={this.state.address}
                  onChange={this.handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formBasicZipCode">
                <Form.Control
                  type="text"
                  name="zipCode"
                  placeholder="Code postal"
                  value={this.state.zipCode}
                  onChange={this.handleZipCodeChange}
                />
              </Form.Group>

              {citiesInSelect}

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
      cities: state.cities,
      redirection: state.redirection
  };
}

/**
 * Component actions are dispatched to Redux Store
 * @param {*} dispatch 
 */
const mapDispatchToProps = dispatch => {
  return {
      RegisterProducer: (login, farmName, email, phone, producerPresentation, farmPresentation, productsPresentation, address, zipCode, city, gpsCoordinates, password, password_confirmation) => dispatch(RegisterProducer(login, farmName, email, phone, producerPresentation, farmPresentation, productsPresentation, address, zipCode, city, gpsCoordinates, password, password_confirmation)),
      disableRedirection: () => dispatch(disableRedirection()),
      SearchForCoordinates: (zipCode) => dispatch(SearchForCoordinates(zipCode)),
      ResetError: () => dispatch(ResetError())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationProducer);