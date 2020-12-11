import React, { Component } from 'react';
import { connect } from "react-redux";
import {
  GetCategories,
  GetProducerFromCategory,
  GetProducerFromProduct,
  ResetError,
  ResetActiveProducer,
  SearchForCoordinates,
  GetCityFromList,
  updateCityCoordinates,
  updateCircleRadius
}
  from "../actions/request";
import LeafletMap from "./Map";
import { Card, Button, Row, Col } from 'react-bootstrap';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
// import "../style.css";
// import "../search-producer.css";
import "../mapStyle.css";
import Footer from "./footer"
import { SERVER_URL } from "./BaseUrl";

const baseUrl = SERVER_URL + "public/"
const producers_pres_dir = "producer-presentation/"//ajouter le nom de sous dossier
// const products_pres_dir = "products-presentation/"//ajouter le nom de sous dossier
// const farm_pres_dir = "farm-presentation/"//ajouter le nom de sous dossier
// const product_dir = "product/"//ajouter le nom de sous dossier

/**
 * This component embeds all controls to find producers + producers location
 * with search based on categories and products
 */
class ProducersSearch extends Component {

  constructor(props) {
    super(props);

    this.state = {
      inputText: "",
      inputZipCode: "",
      selectedOption: null,
      values: [50]
    };

    this.handleSelectCategoryChange = this.handleSelectCategoryChange.bind(this);
    this.handleSelectCityChange = this.handleSelectCityChange.bind(this);
    this.handleInputTextChange = this.handleInputTextChange.bind(this);
    this.handleZipCodeChange = this.handleZipCodeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
  }

  /**
   * Get all product categories to fill the category select options
   */
  componentDidMount() {
    this.props.GetCategories();
  }

  /**
   * Updates circle radius in Redux Store when slider is moved 
   * @param {*} distance
   */
  handleSliderChange(distance) {
    this.props.updateCircleRadius(distance)
  }

  /**
   * Handles category select change : 
   * mainly, get all producers from the selected category
   * @param {*} event 
   */
  handleSelectCategoryChange(event) {
    this.props.ResetError();
    const selectedCategory = event.target.value;
    if (selectedCategory === "default") {
      return;
    }
    this.props.GetProducerFromCategory(event.target.value);
    this.props.ResetActiveProducer();
  }

  /**
   * Handles city select change : 
   * mainly, updates city GPS coordinates in Redux Store
   * @param {*} event 
   */
  handleSelectCityChange(event) {
    this.props.ResetError();
    const GPSCoordinates = event.target.value;
    if (GPSCoordinates === "default") {
      return;
    }
    const LatLng = GPSCoordinates.split(";")
    this.props.updateCityCoordinates(LatLng);
  }

  /**
   * Updates text input when a key is pressed
   * @param {*} event 
   */
  handleInputTextChange(event) {
    const textContent = event.currentTarget.value;
    this.setState({
      inputText: textContent
    })
  }

  /**
   * Updates zip code text input when a key is pressed
   * @param {*} event 
   */
  handleZipCodeChange(event) {
    const zipCodeContent = event.currentTarget.value;
    this.setState({
      inputZipCode: zipCodeContent
    })
    if (zipCodeContent.length === 5) {
      this.props.SearchForCoordinates(zipCodeContent);
    }
  }

  /**
   * Handles form submit button click : 
   * mainly, get all producers that produce the product requested by the user
   * @param {*} event 
   */
  handleSubmit(event) {
    event.preventDefault();
    this.props.ResetError();
    const productToFind = this.state.inputText;
    if (productToFind === '') {
      return;
    }
    this.props.GetProducerFromProduct(productToFind);
  }

  render() {
    // Categories
    const categories = this.props.categories.data;
    let selectCategory = <select className='categorySelect'>
                   <option>Loading...</option>
                 </select>;

    if (categories) {
      const listCategories = categories.map((categorie) => {
        return <option 
                  key={categorie._id}
                  value={categorie.name}>
                  {categorie.name}
                </option>;
      })
      selectCategory = <select className='categorySelect' onChange={this.handleSelectCategoryChange}>
                 <option value="default">Catégorie...</option>
                 {listCategories}
               </select>;
    }

    // Input search text form
    const productForm = 
      <form onSubmit={this.handleSubmit}>
        <input
          className="input"
          type="text" 
          placeholder="Produit..." 
          name="product"
          onChange={this.handleInputTextChange} />
          <br></br>
        <button className="userControl" type="submit">Confirmer</button>
      </form>

    // Input zip code form
    const zipCodeForm = 
      <form className="zipCodeForm" onSubmit={e => e.preventDefault()}>
        <input 
          className="input"
          type="text" 
          placeholder="Code postal..."
          name="zipCode"
          onChange={this.handleZipCodeChange} />
      </form>

    // Producers list
    let producersList = null;
    const producers = this.props.producers;

    if (producers) {
      const list = producers.map((producer) => {
        return (
          <Col xs={4}>
          <Card  className="bigShadow producerCard">
            <Card.Img className="bigShadow producerPicture" variant="top" src={baseUrl + producers_pres_dir + producer.producerPicture} />
            <Card.Body>
              <div className="cardHeader">             
                <Card.Title><a href={`/public-profile/${producer._id}`}>{producer.farmName}</a></Card.Title>
                <Button className="cardButton"><a href={`/public-profile/${producer._id}`}>J'y vais !</a></Button>
              </div>
              <Card.Text>
                {/* {producer.email}<br /> */}
                {producer.producerPresentation}
              </Card.Text>
            </Card.Body>
          </Card>
          </Col>
        )
          })
      producersList = 
      <Row className="gridContainer">
          {list}
      </Row>
    }

    // Cities list from zip code
    let citiesInSelect = null;
    const cities = this.props.cities;
    if (cities.length > 0) {
      const listCities = cities.map((city) => {
        return <option 
                  key={city.code}
                  value={city.centre.coordinates[1] + ';' + city.centre.coordinates[0]}>
                  {city.nom}
                </option>;
      })
      citiesInSelect = 
        <select className='myBlue' onChange={this.handleSelectCityChange}>
          <option value="default">Précisez votre commune</option>
          {listCities}
        </select>;
    }

    // Slider
    const marks = {
      10: '10 km',
      20: '20 km',
      30: '30 km',
      40: '40 km',
      50: '50 km',
      60: '60 km',
      70: '70 km',
      80: '80 km',
      90: '90 km',
      100: '100 km',
    }
    const slider = 
      <Slider className='slider'
        min={10}
        max={100}
        step={10}
        dots={true}
        onChange={this.handleSliderChange}
        marks={marks}
        // marks={{number: ReactNode}}
      />

    // Circle radius
    const radius =  this.props.circleRadius;
 
    return (
      <div>
        <h2>Trouvez votre producteur !</h2>

        <h3>1 - Je cherche...</h3>
        <div className="flex"> 
          <div className='search '>
            Je cherche des :
            <div className='userControl'>
              {selectCategory}
            </div>
          </div>

          <div className='search '>
            ,  plus précisément j'aimerai du/des :
            <div className='userControl'>
            {productForm}
            </div>
          </div>

        </div>
        
        <div className='current-position '>
        
          <h3>2 - J'habite...</h3>
            <div className="city">
              <p>...du côté de : </p>
              {zipCodeForm}
              {citiesInSelect}
            </div>

          <h3>3 - Je me déplace...</h3>
            <div className="radius">
              ... dans un rayon de :<span> {radius}  km </span> autour de ma position
            
            </div>
            {slider}
        </div>

        <h3>. . . résultat . . .</h3>
        <div className="mapTitle">
          
          <h2>Vos producteurs locaux</h2>
        </div>

        {this.props.error}
        <div className="shadow map">
          <LeafletMap />
        </div>
        
        {producersList}

        
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    data: state.data,
    error: state.error,
    loading: state.loading,
    categories: state.categories,
    producers: state.producers,
    activeProducer: state.activeProducer,
    cities: state.cities,
    circleRadius: state.circleRadius
  };
}

const mapDispatchToProps = dispatch => {
  return {
    GetCategories: () => dispatch(GetCategories()),
    GetProducerFromCategory: (category) => dispatch(GetProducerFromCategory(category)),
    GetProducerFromProduct: (product) => dispatch(GetProducerFromProduct(product)),
    ResetError: () => dispatch(ResetError()),
    ResetActiveProducer: () => dispatch(ResetActiveProducer()),
    SearchForCoordinates: (zipCode) => dispatch(SearchForCoordinates(zipCode)),
    GetCityFromList: (cityCode) => dispatch(GetCityFromList(cityCode)),
    updateCityCoordinates: (coordinates) => dispatch(updateCityCoordinates(coordinates)),
    updateCircleRadius: (distance) => dispatch(updateCircleRadius(distance))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProducersSearch);



