import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style.css';
import { connect } from "react-redux";
import Slider from "react-slick";
import 'bootstrap/dist/css/bootstrap.min.css';
import Popup from "reactjs-popup";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { BsPen } from "react-icons/bs";
import Footer from "./footer"


import {
  GetProducerData,
  GetProductsByProducer,
  GetCategories,
  DeleteProductFromProducerList,
  UpdateProductFromProducerList,
  CreateProductFromProducerList,
  CreatePickUpPoint,
  UpdatePickUpPoint,
  DeletePickUpPoint,
  UpdateProducerData,
  UpdateProducerContact,
  UploadPicture,
  GetConsumersInfos,
  GetGrade, UpdateProducerToKnow,
} from "../actions/request";

import {
  Form,
  Button,
  Card,
  InputGroup,
  Col,
  Label
} from 'react-bootstrap';


import {
  Breadcrumb,
  ModalFooter,
  BreadcrumbItem,
  CardDeck,
  CardTitle,
  CardText,
  CardGroup,
  CardBody,
  Jumbotron,
  Container,
  CardImg,
  Row,
  Input
} from 'reactstrap';

import { SERVER_URL } from "./BaseUrl";

const MAX_SIZE_FILE_UPLOAD_KO = 300;

const baseUrl = SERVER_URL + "public/"
const producers_pres_dir = "producer-presentation/"//ajouter le nom de sous dossier
const products_pres_dir = "products-presentation/"//ajouter le nom de sous dossier
const farm_pres_dir = "farm-presentation/"//ajouter le nom de sous dossier
const product_dir = "product/"//ajouter le nom de sous dossier

class ProducerProfile extends Component {

  constructor(props) {
    super(props);

    this.state = {
      files: [],
      error: '',
      name_product: '',
      category_product: '',
      conditioning_product: '',
      stock_product: '',
      price_product: '',
      pick_up_name: '',
      address: '',
      zip_code: '',
      toKnow: '',
      city: '',
      phone: '',
      opening_hours: '',
      payment_methods: '',
      farmName: '',
      producerPresentation: '',
      farmPresentation: '',
      productsPresentation: '',
      zipCode: '',
      vote: '',
    }
    this.handleSubmitPickUp = this.handleSubmitPickUp.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectCategoryChange = this.handleSelectCategoryChange.bind(this);
  }

  /**
   * Get all informations needed to fill the page
   */
  componentDidMount() {
    let login = this.props.data.login;
    let producer_id = this.props.data._id;
    this.props.GetProducerData();
    this.props.GetConsumersInfos();
    this.props.GetProductsByProducer(login);
    this.props.GetCategories();
    this.props.GetGrade(producer_id);
  }

  /**
   * Method fired when a file (picture) is dropped on the Drop zone
   * @param {file} files - picture to upload
   */
  onDrop = (files) => {
    if (files.length > 1) {
      this.setState({
        error: 'Une seule image autorisée'
      });
      console.log('Erreur : une seule image autorisée')
      return;
    }
    if (files[0].size > MAX_SIZE_FILE_UPLOAD_KO * 1024) {
      this.setState({
        error: `La taille de l'image dépasse les ${MAX_SIZE_FILE_UPLOAD_KO} ko autorisés`
      });
      console.log(`La taille de l'image dépasse les ${MAX_SIZE_FILE_UPLOAD_KO} ko autorisés`)
      return;
    }
    this.setState({
      files,
      error: ''
    })
  };

  /**
   * Method used to trigger the producer picture upload to the server
   * @param {file} files - picture to upload
   */
  updateProducerPicture = (files) => {
    const url = 'producer-presentation'
    const id = this.props.producer._id;
    this.onDrop(files);
    this.props.UploadPicture(url, id, files[0]);
  }

  /**
   * Method used to trigger the farm picture upload to the server
   * @param {file} files - picture to upload
   */
  updateFarmPicture = (files) => {
    const url = 'farm-presentation'
    const id = this.props.producer._id;
    this.onDrop(files);
    this.props.UploadPicture(url, id, files[0]);
  }

  /**
   * Method used to trigger the products presentation picture upload to the server
   * @param {file} files - picture to upload
   */
  updateProductsPresentationPicture = (files) => {
    const url = 'products-presentation'
    const id = this.props.producer._id;
    this.onDrop(files);
    this.props.UploadPicture(url, id, files[0]);
  }

  /**
   * Method used to trigger the product picture upload to the server
   * @param {file} files - picture to upload
   */
  updateProductPicture = (files, id) => {
    const url = 'product'
    const login = this.props.producer.login
    this.onDrop(files);
    this.props.UploadPicture(url, id, files[0], login);
  }

  /**
   * Updates producer profile
   */
  updateProfile = () => {
    this.props.GetProducerData();
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

  /**
   * Handles form submit button click : 
   * mainly, triggers product creation for producer
   * @param {*} event
   */
  handleSubmit = (event) => {
    event.preventDefault();
    this.props.CreateProductFromProducerList(this.props.data.login, this.props.data._id, this.state.name_product, this.state.category_product, this.state.conditioning_product, this.state.stock_product, this.state.price_product);
  }

  /**
   * Handles form submit button click : 
   * mainly, triggers pick-up point creation for producer
   * @param {*} event
   */  
  handleSubmitPickUp = (event) => {
    event.preventDefault();
    this.props.CreatePickUpPoint(this.props.data.login, this.state.pick_up_name, this.state.address, this.state.zip_code, this.state.city, this.state.phone, this.state.opening_hours, this.state.payment_methods)
  }

  /**
   * Handles category select change and update local state object
   * @param {*} event 
   */
  handleSelectCategoryChange(event) {
    // this.props.ResetError();
    const selectedCategory = event.target.value;
    if (selectedCategory === "default") {
      return;
    }
    this.setState({
      category_product: selectedCategory
    })
  }

  //=============================================================================
  //                       R E N D E R ...
  //=============================================================================

  render() {
    let settingsfollowers = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: this.props.followers.length,
      slidesToScroll: 0,
    };
    let settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 3,
    };

    // ---------- Dropzones ----------
    const files = this.state.files.map(file => (
      <li key={file.name}>
        {file.name} - {file.size} bytes
      </li>
    ));

    const dropzoneProducer =
      <Dropzone onDrop={this.updateProducerPicture}>
        {({ getRootProps, getInputProps }) => (
          <section className="container">
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              <Button style={{ marginLeft: '25%' }} variant="outline-info">Cliquez ici pour ajouter votre image</Button>
            </div>
            <aside>
              {/* <p>Image</p> */}
              <ul>{files}</ul>
            </aside>
          </section>
        )}
      </Dropzone>

    const dropzoneFarm =
      <Dropzone onDrop={this.updateFarmPicture}>
        {({ getRootProps, getInputProps }) => (
          <section className="container">
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              <Button variant="outline-info">Cliquez ici pour ajouter votre image</Button>
            </div>
            <aside>
              {/* <p>Image</p> */}
              <ul>{files}</ul>
            </aside>
          </section>
        )}
      </Dropzone>

    const dropzoneProductPresentation =
      <Dropzone onDrop={this.updateProductsPresentationPicture}>
        {({ getRootProps, getInputProps }) => (
          <section className="container">
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              <Button variant="outline-info" style={{ marginLeft: '25%' }} >Cliquez ici pour ajouter votre image</Button>
            </div>
            <aside>
              {/* <p>Image</p> */}
              <ul>{files}</ul>
            </aside>
          </section>
        )}
      </Dropzone>

    const followersdata = this.props.followers.length ? (
      this.props.followers.map(follower => {
        return (
          <div key={follower._id}>
            <Col>
              <Card body>
                <CardTitle>{follower.login}</CardTitle>
                <CardText>{follower.email}</CardText>
              </Card>
            </Col>
          </div>
        );
      })
    ) : (
        null
      );



    // ---------- Product categories ----------
    const categories = this.props.categories.data;

    let productCategory =
      <Form.Control
        as="select"
        name="category_product"
        placeholder="Catégorie"
        value={this.state.category_product}
        onChange={this.handleSelectCategoryChange}>
        <option>Loading...</option>
      </Form.Control>

    if (categories) {
      const listCategories = categories.map((categorie) => {
        return <option
          key={categorie._id}
          value={categorie.name}>
          {categorie.name}
        </option>;
      })
      productCategory =
        <Form.Control
          as="select"
          name="category_product"
          placeholder="Catégorie"
          value={this.state.category_product}
          onChange={this.handleSelectCategoryChange}>
          <option value="default">Catégorie...</option>
          {listCategories}
        </Form.Control>
    }

    //------------------Grade...------------------------

    console.log("-------------------Grade tests ----------------")
    let value = null
    const max = 5
    if (this.props.grade) {
      // const value = this.props.grade.avgGrades;
      value = this.props.grade.avgGrades
      console.log("this.props.grade.avgGrades: ", this.props.grade.avgGrades)
    } else {
      value = null;
    }

    // --------- to get the average grade of producer -----------
    let note = "";
    if (value == 0) {
      note = "Ce producteur n'a pas encore été évalué";
    } else {
      note = "Note moyenne des consommateurs: " + value + "/5";
    }
    const grade =
      <div className="grade">
        <Box component="fieldset" mb={3} borderColor="transparent">
          <Typography component="legend" className="average-grade">{note}</Typography>
          <p> ( <span>{this.props.grade && this.props.grade.sumVoters} </span> consommateurs ont voté)</p>
          <Rating
            name="half-rating-read"
            value={value}
            readOnly
            defaultValue={0}
            precision={0.1}
          />
        </Box>
      </div>

    // console.log('+++ this.props.productsByProducer +++', this.props.productsByProducer)

    //=============================================================================
    //                       R E T U R N
    //=============================================================================

    return (
      <div>
        <div className="mainContainer center producer-profile">
          <div>
            {/* --------------------------------------------- HEADER ------------------------------------------*/}
            <Jumbotron className="jumbotron" fluid>
              <Container fluid>
                <img className="image-jumbotron" src={require('../img/panier_white.png')} />
                <h1 className="display-3" text-center>{this.props.producer.farmName}</h1>
                <p className="lead" text-center >Bienvenue sur le profil de  {this.props.producer.login}, notre petit producteur occitan ! </p>
              </Container>
              {grade}
              {/* --------------------------------------------- POP UP UPDATE DATA ------------------------------------------*/}
              <Popup trigger={<Button variant="outline-light"> Modifier la présentation de ma ferme</Button>} position="bottom center">
                <Form onSubmit={(event) => { this.props.UpdateProducerData(this.state.farmName, this.state.producerPresentation, this.state.farmPresentation, this.state.productsPresentation); event.preventDefault(); }}>
                  <Form.Group controlId="formBasicContent">
                    <label>
                      Nom de la Ferme :
                                          <Form.Control
                        name="farmName"
                        placeholder="Nom de la ferme"
                        value={this.state.farmName || this.props.producer.farmName}
                        onChange={this.handleChange}
                      />
                    </label>
                    <label>
                      Votre Présentation :
                                          <Form.Control
                        as="textarea"
                        rows="6"
                        name="producerPresentation"
                        placeholder="Un petit mot sur vous"
                        value={this.state.producerPresentation || this.props.producer.producerPresentation}
                        onChange={this.handleChange}
                      />
                    </label>
                    <label>
                      Présentation de votre ferme :
                                          <Form.Control
                        as="textarea"
                        rows="6"
                        name="farmPresentation"
                        placeholder="Un petit mot sur votre ferme"
                        value={this.state.farmPresentation || this.props.producer.farmPresentation}
                        onChange={this.handleChange}
                      />
                    </label>
                    <label>
                      Présentation des produits :
                                          <Form.Control
                        as="textarea"
                        rows="6"
                        name="productsPresentation"
                        placeholder="Un petit mot sur vos produits"
                        value={this.state.productsPresentation || this.props.producer.productsPresentation || ''}
                        onChange={this.handleChange}
                      />
                    </label>
                    <Button variant="primary" type="submit" className="log"> Confirmer </Button>
                  </Form.Group>
                </Form>
              </Popup>
            </Jumbotron>
          </div>

        {/* --------------------------------------------- BODY & PAGE NAV ------------------------------------------*/}


        <div>
          <div>
            <Breadcrumb className="navProducerProfile" tag="nav" listTag="div">
              <a className="prodAncre" href="http://localhost:3000/producer-profile#ferme"> Ma Ferme </a>
              <a className="prodAncre" href="http://localhost:3000/producer-profile#info"> Infos Pratiques </a>
            </Breadcrumb>
          </div>


          {/* --------------------------------------------- producer presentation ------------------------------------------*/}


          <div className="packCard">
            <Card className="presentationCard" body outline color="info">
              <CardImg className="presImage" top width="1000%" src={baseUrl + producers_pres_dir + this.props.producer.producerPicture} alt="Card image presentation" />
              {this.state.error && this.state.error}
              {/* <CardImg top width="100%" src="/assets/318x180.svg" alt="Card image presentation" /> */}
              <CardTitle className="cardTitle">Qui suis-je ? </CardTitle>
              <CardText className="textCard">{this.props.producer.producerPresentation}</CardText>
              {dropzoneProducer}
            </Card>
            {/* --------------------------------------------- farm presentation ------------------------------------------*/}


            <div id="ferme">
              <Card className="presentationCard" body outline color="info">
                {/* <CardImg top width="100%" src="/assets/318x180.svg" alt="Card image farm" /> */}
                <CardImg className="presImageLeft" top width="100%" src={baseUrl + farm_pres_dir + this.props.producer.farmPicture} alt="Card image ferme" />
                <CardTitle className="cardTitle">Ma Ferme </CardTitle>
                <CardText className="textCardLeft">{this.props.producer.farmPresentation}</CardText>
                {dropzoneFarm}
              </Card>
              {/* --------------------------------------------- product presentation ------------------------------------------*/}


            </div>
            <Card className="presentationCard" body outline color="info">
              <CardImg className="presImage" top width="100%" src={baseUrl + products_pres_dir + this.props.producer.productsPicture} alt="Card image produits" />
              {/* <CardImg top width="100%" src="/assets/318x180.svg" alt="Card image produit" /> */}
              <CardTitle className="cardTitle">Mes produits </CardTitle>
              <CardText className="textCard">{this.props.producer.productsPresentation}</CardText>
              {dropzoneProductPresentation}
            </Card>
          </div>


          {/* --------------------------------------------- ADD A PRODUCT ------------------------------------------*/}
          <Jumbotron className="jumbotronType2" fluid>
            <h3 className="display-3" text-center>Produits à la vente : </h3>
            <div className="produits" id="produits">
              <Popup trigger={<Button variant="outline-light" style={{ margin: '3%' }}> Créer un Produit: </Button>} position="right center">
                <Form onSubmit={this.handleSubmit}>
                  <Form.Group>
                    <label>
                      Nom du produit:
                                                <Form.Control
                        as="input"
                        rows="1"
                        name="name_product"
                        value={this.state.name_product}
                        onChange={this.handleChange}
                      />
                    </label>
                    <label>
                      Cathégorie:
                                            </label>
                    {productCategory}
                    <label>
                      Conditionnement:
                                                <Form.Control
                        as="input"
                        rows="1"
                        name="conditioning_product"
                        value={this.state.conditioning_product}
                        onChange={this.handleChange}
                      />
                    </label>
                    <label>
                      Stock:
                                                <Form.Control
                        as="select"
                        name="stock_product"
                        value={this.state.stock_product}
                        onChange={this.handleChange}>
                        <option>En Stock</option>
                        <option>Rupture de Stock</option>
                      </Form.Control>
                    </label>
                    <label>
                      Prix du produit:
                                                <Form.Control
                        as="input"
                        rows="1"
                        name="price_product"
                        value={this.state.price_product}
                        onChange={this.handleChange}
                      />
                    </label>
                    <Button variant="outline-light" type="submit" className="log">Créer un produit</Button>
                  </Form.Group>
                </Form>
              </Popup>
            </div>
          </Jumbotron>


          {/* --------------------------------------------- ALL MY RPODUCTS ------------------------------------------*/}
          {this.props.productsByProducer.map(id => {
            return (
              <Col>
                <Card body style={{ marginTop: '1%', marginBottom: '2%' }}>
                  <CardImg className="presImageProduct" top width="100%" src={baseUrl + product_dir + id.pictureUrl} alt="Image Produit" />
                  {this.state.error && this.state.error}
                  <CardText className="textCard">
                    <CardTitle className="cardTitle">{id.name}</CardTitle>
                    <CardText>{id.category}</CardText>
                    <CardText>{id.price} € / vendu par {id.conditioning} </CardText>
                    <CardText> {id.stock}</CardText>
                    <Button variant="outline-danger" style={{ marginRight: '1%' }} onClick={() => this.props.DeleteProductFromProducerList(id._id, this.props.data.login)}>Supprimer</Button>
                    <Popup trigger={<Button variant="outline-info"> Modifier</Button>} position="top center">
                      <Form onSubmit={(event) => { this.props.UpdateProductFromProducerList(id._id, this.props.data.login, this.state.name_product, this.state.category_product, this.state.conditioning_product, this.state.stock_product, this.state.price_product); event.preventDefault(); }}>
                        <Form.Group>
                          <label>
                            Nom du produit:
                                                            <Form.Control
                              as="input"
                              rows="1"
                              name="name_product"
                              value={this.state.name_product}
                              onChange={this.handleChange}
                            />
                          </label>
                          <label>
                            Cathégorie:
                                                        </label>
                          {productCategory}
                          <label>
                            Conditionnement:
                                                            <Form.Control
                              as="input"
                              rows="1"
                              name="conditioning_product"
                              value={this.state.conditioning_product}
                              onChange={this.handleChange}
                            />
                          </label>
                          <label>
                            Stock:
                                                            <Form.Control
                              as="select"
                              name="stock_product"
                              value={this.state.stock_product}
                              onChange={this.handleChange}>
                              <option>En Stock</option>
                              <option>Rupture de Stock</option>
                            </Form.Control>
                          </label>
                          <label>
                            Prix du produit:
                                                            <Form.Control
                              as="input"
                              rows="1"
                              name="price_product"
                              value={this.state.price_product}
                              onChange={this.handleChange}
                            />
                          </label>
                          <Button variant="outline-light" type="submit" className="log">Modifier</Button>
                        </Form.Group>
                      </Form>
                    </Popup>
                    <Dropzone onDropAccepted={(files) => this.updateProductPicture(files, id._id)}>
                      {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps({ className: 'dropzone' })}>
                          <input {...getInputProps()} />
                          <Button style={{ marginTop: '1%' }} variant="outline-success">Ajouter votre image</Button>
                        </div>
                      )}
                    </Dropzone>
                  </CardText>
                </Card>
              </Col>
            );
          })}
        </div>

          {/* --------------------------------------- GENERAL INFORMATIONS ------------------------------------*/}
          <ModalFooter>
            <Container fluid>
              <div className="cardTitle" text-center>Informations Générales</div>
            </Container>
            <div id="info">

              {/* --------------------------left : contact info --------------------*/}
              <CardDeck className="cardInfo">
                <Card className="cardFooter">
                  <CardBody>
                    <CardTitle className="cardTitle">Contact : </CardTitle>
                    <CardText>{this.props.producer.farmName}</CardText>
                    <CardText>{this.props.producer.address}</CardText>
                    <CardText>{this.props.producer.zipCode}</CardText>
                    <CardText>{this.props.producer.city}</CardText>
                    <CardText>Tel : {this.props.producer.phone}</CardText>
                    <Button variant="outline-info" href={`mailto:${this.props.producer.email}`}>Send an Email</Button>
                    <Popup trigger={<Button variant="outline-info" style={{ marginLeft: '3%' }}> Modifier le contact</Button>} position="top center">
                      <Form onSubmit={(event) => { this.props.UpdateProducerContact(this.state.address, this.state.city, this.state.zipCode, this.state.phone); event.preventDefault(); }}>
                        <Form.Group controlId="formBasicContent">
                          <label>
                            Adresse :
                                                          <Form.Control
                              as="input"
                              rows="1"
                              name="address"
                              placeholder="Adresse"
                              value={this.state.address || this.props.producer.address}
                              onChange={this.handleChange}
                            />
                          </label>
                          <label>
                            Ville :
                                                          <Form.Control
                              as="input"
                              rows="1"
                              name="city"
                              placeholder="Nom de la ville ou village "
                              value={this.state.city || this.props.producer.city}
                              onChange={this.handleChange}
                            />
                          </label>
                          <label>
                            CP :
                                                          <Form.Control
                              as="input"
                              rows="1"
                              name="zipCode"
                              placeholder="Code Postal"
                              value={this.state.zipCode || this.props.producer.zipCode}
                              onChange={this.handleChange}
                            />
                          </label>
                          <label>
                            Tel :
                                                          <Form.Control
                              as="input"
                              rows="1"
                              name="phone"
                              placeholder="n° de tel."
                              value={this.state.phone || this.props.producer.phone}
                              onChange={this.handleChange}
                            />
                          </label>
                          <div className="GPSAlert"> Si vous souhaitez mettre à jour vos coordonnnées GPS, merci de contacter un <a href="mailto:admin@MonPetitProducteur.fr">administateur</a><br /><br /> </div>
                          <Button variant="primary" type="submit" className="log"> Confirmer </Button>
                        </Form.Group>
                      </Form>
                    </Popup>


                  </CardBody>
                </Card>
                {/* -------------------------- center : pick up points--------------------*/}
                <Card className="cardFooter">
                  {
                    this.props.pickupPoint ?
                      <CardBody>
                        <CardTitle className="cardTitle">Lieu de Collecte: </CardTitle><CardText>Vous pouvez retrouver les produits de {this.props.producer.farmName} à cette adresse :</CardText>
                        <CardText>{this.props.pickupPoint.pick_up_name}</CardText>
                        <CardText>{this.props.pickupPoint.address}</CardText>
                        <CardText>{this.props.pickupPoint.zip_code}</CardText>
                        <CardText>{this.props.pickupPoint.city}</CardText>
                        <CardText>Tel : {this.props.pickupPoint.phone}</CardText>
                        <CardText>{this.props.pickupPoint.opening_hours}</CardText>
                        <CardText>{this.props.pickupPoint.payment_methods}</CardText>
                        <Button variant="outline-danger" style={{ margin: '2%' }} onClick={() => this.props.DeletePickUpPoint(this.props.pickupPoint._id, this.props.data.login)}>Supprimer PickUp</Button>

                        {/* --------------------------pop up update pickup points --------------------*/}
                        <Popup trigger={<Button variant="outline-info"> Modifier PickUp</Button>} position="top center">
                          <Form onSubmit={(event) => { this.props.UpdatePickUpPoint(this.props.pickupPoint._id, this.props.data.login, this.state.pick_up_name, this.state.address, this.state.zip_code, this.state.city, this.state.phone, this.state.opening_hours, this.state.payment_methods); event.preventDefault(); }}>
                            <Form.Group>
                              <label>
                                Nom du Point de collecte:
                                                                  <Form.Control
                                  as="input"
                                  rows="1"
                                  name="pick_up_name"
                                  value={this.state.pick_up_name}
                                  onChange={this.handleChange}
                                />
                              </label>
                              <label>
                                Adresse:
                                                                  <Form.Control
                                  as="input"
                                  rows="1"
                                  name="address"
                                  value={this.state.address}
                                  onChange={this.handleChange}
                                />
                              </label>
                              <label>
                                CP:
                                                                  <Form.Control
                                  as="input"
                                  rows="1"
                                  name="zip_code"
                                  value={this.state.zip_code}
                                  onChange={this.handleChange}
                                />
                              </label>
                              <label>
                                Ville:
                                                                  <Form.Control
                                  as="input"
                                  rows="1"
                                  name="city"
                                  value={this.state.city}
                                  onChange={this.handleChange}
                                />
                              </label>
                              <label>
                                Tel:
                                                                  <Form.Control
                                  as="input"
                                  rows="1"
                                  name="phone"
                                  value={this.state.phone}
                                  onChange={this.handleChange}
                                />
                              </label>
                              <label>
                                Horaires:
                                                                  <Form.Control
                                  as="input"
                                  rows="1"
                                  name="opening_hours"
                                  value={this.state.opening_hours}
                                  onChange={this.handleChange}
                                />
                              </label>
                              <label>
                                Méthodes de paiement:
                                                                  <Form.Control
                                  as="input"
                                  rows="1"
                                  name="payment_methods"
                                  value={this.state.payment_methods}
                                  onChange={this.handleChange}
                                />
                              </label>

                              <Button variant="primary" type="submit" className="log">Modifier</Button>
                            </Form.Group>
                          </Form>
                        </Popup>
                      </CardBody>
                      :
                      <CardBody>
                        <CardTitle className="cardTitle">Lieux de Collecte : </CardTitle>
                        <CardText>{this.props.producer.farmName} n'a pas encore de lieux de collecte disponible</CardText>
                        <Popup trigger={<Button Button variant="outline-info"> Ajouter un point de collecte</Button>} position="top center">
                          <Form onSubmit={this.handleSubmitPickUp}>
                            <Form.Group>
                              <label>
                                Nom du point de collecte:
                                                                  <Form.Control
                                  as="input"
                                  rows="1"
                                  name="pick_up_name"
                                  value={this.state.pick_up_name}
                                  onChange={this.handleChange}
                                />
                              </label>
                              <label>
                                Adresse:
                                                                  <Form.Control
                                  as="input"
                                  rows="1"
                                  name="address"
                                  value={this.state.address}
                                  onChange={this.handleChange}
                                />
                              </label>
                              <label>
                                CP:
                                                                  <Form.Control
                                  as="input"
                                  rows="1"
                                  name="zip_code"
                                  value={this.state.zip_code}
                                  onChange={this.handleChange}
                                />
                              </label>
                              <label>
                                Ville:
                                                                  <Form.Control
                                  as="input"
                                  rows="1"
                                  name="city"
                                  value={this.state.city}
                                  onChange={this.handleChange}
                                />
                              </label>
                              <label>
                                Tel:
                                                                  <Form.Control
                                  as="input"
                                  rows="1"
                                  name="phone"
                                  value={this.state.phone}
                                  onChange={this.handleChange}
                                />
                              </label>
                              <label>
                                Horaires:
                                                                  <Form.Control
                                  as="input"
                                  rows="1"
                                  name="opening_hours"
                                  value={this.state.opening_hours}
                                  onChange={this.handleChange}
                                />
                              </label>
                              <label>
                                Méthodes de paiement:
                                                                  <Form.Control
                                  as="input"
                                  rows="1"
                                  name="payment_methods"
                                  value={this.state.payment_methods}
                                  onChange={this.handleChange}
                                />
                              </label>

                              <Button variant="primary" type="submit" className="log">Modifier</Button>
                            </Form.Group>
                          </Form>
                        </Popup>
                      </CardBody>
                  }
                </Card>
                <Card className="cardFooter">
                  <CardBody>

                    {/* --------------------------right : to know--------------------*/}
                    <CardTitle className="cardTitle">A savoir : </CardTitle>
                    <CardText>{this.props.producer.toKnow}</CardText>
                    <Popup trigger={<Button Button variant="outline-info"> Modifier les choses à savoir</Button>} position="top center">
                      <Form onSubmit={(event) => { this.props.UpdateProducerToKnow(this.state.toKnow); event.preventDefault(); }}>
                        <Form.Group>
                          <Form.Control
                            as="textarea"
                            rows="6"
                            name="toKnow"
                            placeholder="Modifier les choses à savoir ..."
                            value={this.state.toKnow}
                            onChange={this.handleChange}
                          />
                          <Button style={{ marginTop: '2%' }} variant="info" type="submit" className="log">Modifier</Button>
                        </Form.Group>
                      </Form>
                    </Popup>
                  </CardBody>
                </Card>
              </CardDeck>
            </div>
          </ModalFooter>

          <div className="portrait" id="portrait">
            <CardTitle className="cardTitle"> Liste des consommateurs qui vous suivent : </CardTitle>
            <Slider {...settingsfollowers}>
              {followersdata}
            </Slider>
          </div>

        </div>

        <div className="footer">
          <Footer />
        </div>
        
      </div>
    );
  }
}


// ---------------------------------------------------------------------------------------------------------
//                                                     REDUX MANAGEMENT
// ---------------------------------------------------------------------------------------------------------
const mapStateToProps = state => {
  return {
    productsByProducer: state.productsByProducer,
    pickupPoint: state.pickupPoint,
    producer: state.producer,
    followers: state.followers,
    isLoggedIn: state.isLoggedIn,
    data: state.data,
    error: state.error,
    loading: state.loading,
    categories: state.categories,
    grade: state.grade,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    GetProducerData: () => dispatch(GetProducerData()),
    GetGrade: (producer_id) => dispatch(GetGrade(producer_id)),
    GetProductsByProducer: (login) => dispatch(GetProductsByProducer(login)),
    UploadPicture: (url, producer_id, imagePath, login) => dispatch(UploadPicture(url, producer_id, imagePath, login)),
    GetConsumersInfos: () => dispatch(GetConsumersInfos()),
    DeleteProductFromProducerList: (product_id, author_id) => dispatch(DeleteProductFromProducerList(product_id, author_id)),
    UpdateProductFromProducerList: (product_id, author_id, name_product, category_product, conditioning_product, stock_product, price_product) => dispatch(UpdateProductFromProducerList(product_id, author_id, name_product, category_product, conditioning_product, stock_product, price_product)),
    CreateProductFromProducerList: (author, author_id, name_product, category_product, conditioning_product, stock_product, price_product) => dispatch(CreateProductFromProducerList(author, author_id, name_product, category_product, conditioning_product, stock_product, price_product)),
    CreatePickUpPoint: (author, pick_up_name, address, zip_code, city, phone, opening_hours, payment_methods) => dispatch(CreatePickUpPoint(author, pick_up_name, address, zip_code, city, phone, opening_hours, payment_methods)),
    UpdatePickUpPoint: (id, author, pick_up_name, address, zip_code, city, phone, opening_hours, payment_method) => dispatch(UpdatePickUpPoint(id, author, pick_up_name, address, zip_code, city, phone, opening_hours, payment_method)),
    DeletePickUpPoint: (id, author) => dispatch(DeletePickUpPoint(id, author)),
    UpdateProducerData: (farmName, producerPresentation, farmPresentation, productsPresentation) => dispatch(UpdateProducerData(farmName, producerPresentation, farmPresentation, productsPresentation)),
    GetCategories: () => dispatch(GetCategories()),
    UpdateProducerContact: (address, city, zipCode, phone) => dispatch(UpdateProducerContact(address, city, zipCode, phone)),
    UpdateProducerToKnow: (producer_toKnow) => dispatch(UpdateProducerToKnow(producer_toKnow))
  };

}

export default connect(mapStateToProps, mapDispatchToProps)(ProducerProfile);
