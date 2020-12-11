import React, { Component } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {
    Breadcrumb,
    ModalFooter,
    CardTitle,
    CardText,
    Jumbotron,
    Container,
    CardImg,
    CardBody,
    Col, 
    CardDeck,
    Row,
} from 'reactstrap';
import {Card} from 'react-bootstrap';
import '../style.css';
import {connect} from "react-redux";
import Popup from "reactjs-popup";
import { Button } from 'react-bootstrap';
import {
    GetProducerDataById,
    SubscribeProducers,
    GetProductsByProducerId,
    SubscribeProducts,
    GetPickUpPoint,
    GetGrade,
    SendMyVote,
} from "../actions/request";
import {IoIosArrowDown} from 'react-icons/io';
import { SERVER_URL } from "./BaseUrl";
import Footer from "./footer"

const MAX_SIZE_FILE_UPLOAD_KO = 300;

const baseUrl = SERVER_URL + "public/"
const producers_pres_dir = "producer-presentation/"//ajouter le nom de sous dossier
const products_pres_dir = "products-presentation/"//ajouter le nom de sous dossier
const farm_pres_dir = "farm-presentation/"//ajouter le nom de sous dossier
const product_dir = "product/"//ajouter le nom de sous dossier

class PublicProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id : this.props.match.params.id,
            vote:'',
        }
    }

    /**
     * This method is called after the component gets mounted on the DOM.
     * @param  {*}
     */


    componentDidMount() {
        let id = this.state.id;
        this.props.GetProducerDataById(id);
        this.props.GetProductsByProducerId(id);
        this.props.GetGrade(id);

    }

    /**
     * This method is called to force the update on PickUpPoint data.
     * The GetPickUpPoint methods use parameter who need to be treated in the ComponentDidMount method in the first place.
     * @param  {*}
     */

    componentDidUpdate() {
        let author = this.props.producerById.login;
        this.props.GetPickUpPoint(author);
    }

    /**
     * Allow consumers to subscribe to producer when a key is being pressed
     * @param  {*} event
     */

    Subscribe = (event) => {
        event.preventDefault();
        this.props.SubscribeProducers(this.state.id);
    }

    /**
     * Allow consumers to subscribe to producer when a key is being pressed
     * @param  {*} event
     * @param  {String} Every single time someone vote, a new value is attributed (+1)
     */

    sendVote = (event, newValue) => {
        this.setState({ vote: newValue })
        let consumer_id = this.props.data._id;
        let producer_id= this.state.id;
        console.log(" * TEST BEFORE SEND* new value: ",newValue," / new vote:",  this.state.vote," / consumerid: ", consumer_id, " producer id: ", producer_id)
        this.props.SendMyVote(newValue,producer_id,consumer_id)
    }

    //=============================================================================
    //                       R E N D E R ...
    //=============================================================================


    render()

    {

        const consumer = (this.props.data.type === "consumer");

        let settings = {
            dots: true,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 3
        };


        //------------------Grade...------------------------
        
        // ----------- test for dev----------
        // if(this.props.voteError){
        //     console.log(" * !!!!!!!!!!!!! vote error: ", this.props.voteError)
        // }
        // if(this.props.vote){
        //     console.log(" * !!!!!!!!!!!!! vote : ", this.props.vote)
        // }
        // if(this.props.grade){
        //     console.log(" * !!!!!!!!!!!!! grade : ", this.props.grade)
        // }
        // ----------- end test-------


        // --------- to vote -----------
        let value = null
        const max= 5

        if(this.props.grade){
            value= this.props.grade.avgGrades
            console.log("  -------- >* this.props.grade.avgGrades: ", this.props.grade.avgGrades)
        }else{
            value = null;
        }

        const vote =
            <div className="vote">
                <Box component="fieldset" mb={max} borderColor="transparent">
                    <Typography component="legend" className="average-grade jevote">Je vote</Typography>
                    <Rating
                        name="half-rating"
                        size="large"
                        defaultValue={0}
                        precision={0.5}
                        value={value}
                        onChange={(event, newValue) => {
                            this.setState({ vote: newValue })
                            console.log(" * new value: ",newValue)
                            this.sendVote(event, newValue)
                            }
                        }
                    />
                </Box>
            </div>
        

        // --------- to get the average grade of producer -----------
        let note="";
        if(value==0){
             note="Ce producteur n'a pas encore été évalué";
        }else{
             note = "Note moyenne des consommateurs: "+value+"/5";
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

        // ---------- error message & message  from button follow
        let subscribe_message = null
        let error= null

        if(this.props.subscribe_message){
            subscribe_message =  <p className="error">{this.props.subscribe_message}</p>
        }
        if(this.props.error){
            error = <p className="error">{this.props.error}</p>
        }


        // ------------------------------------------------------------------------------------------------------------------
        //                          R e t u r n 
        // ------------------------------------------------------------------------------------------------------------------
        return (
            <div>
                <div className="mainContainer center producer-profile">
                    <div>
                        <Jumbotron className="jumbotron" fluid>
                            <Container fluid>
                                <h1 className="display-3" text-center>{this.props.producerById.farmName}</h1>
                                <p className="lead" text-center >Bienvenue sur le profil de  {this.props.producerById.login}, notre petit producteur occitan! </p>
                                
                                {/*--------- abonnement-------- */}
                                {
                                    consumer ?
                                    <Button variant="outline-light" style={{marginBottom:'2%'}} onClick={this.Subscribe}>S'abonner</Button>
                                    :
                                    null
                                }
                                {subscribe_message}{error}
                                {/* <p className="error">{this.props.subscribe_message}</p>
                                <p className="error">{this.props.error}</p> */}

                                {/* -----------grades--------------- */}
                                <Row className="note flex">
                                    <Col xs={6}>
                                        <p className="grade"> {this.props.grade && grade} </p>
                                    </Col>

                                    <Col xs={6}>
                                        <p>{vote}</p>
                                        <p>{this.props.vote &&this.props.vote}</p>
                                        <p className="error">{this.props.voteError &&this.props.voteError.mess}</p>
                                    </Col>
                                </Row>


                            </Container>
                        </Jumbotron>
                    </div>

                    <div>
                        <div>
                            <Breadcrumb className="navProducerProfile" tag="nav" listTag="div">
                                <IoIosArrowDown/>
                                <a href={`/public-profile/${this.props.match.params.id}#ferme`}> Ma Ferme </a>
                                <a href={`/public-profile/${this.props.match.params.id}#produits`}> Mes Produits </a>
                                <a href={`/public-profile/${this.props.match.params.id}#info`}> Infos Pratiques </a>
                                <IoIosArrowDown/>
                            </Breadcrumb>
                        </div>
                        <div className="packCard">
                            <Card className="presentationCard" body outline color="info">
                                <CardImg className = "presImage" top width="1000%" src={baseUrl + producers_pres_dir + this.props.producerById.producerPicture} alt="Card image presentation" />
                                {this.state.error && this.state.error}
                                {/* <CardImg top width="100%" src="/assets/318x180.svg" alt="Card image presentation" /> */}
                                <CardTitle className="cardTitle">Qui suis-je ? </CardTitle>
                                <CardText className="textCard">{this.props.producerById.producerPresentation}</CardText>

                            </Card>
                            <div id="ferme">
                                <Card className="presentationCard" body outline color="info">
                                    {/* <CardImg top width="100%" src="/assets/318x180.svg" alt="Card image farm" /> */}
                                    <CardImg  className = "presImageLeft" top width="100%" src={baseUrl + farm_pres_dir + this.props.producerById.farmPicture} alt="Card image ferme" />
                                    <CardTitle className="cardTitle">Ma Ferme </CardTitle>
                                    <CardText className="textCardLeft">{this.props.producerById.farmPresentation}</CardText>
                                </Card>
                            </div>
                            <Card className="presentationCard" body outline color="info">
                                <CardImg  className = "presImage" top width="100%" src={baseUrl + products_pres_dir + this.props.producerById.productsPicture} alt="Card image produits" />
                                {/* <CardImg top width="100%" src="/assets/318x180.svg" alt="Card image produit" /> */}
                                <CardTitle className="cardTitle">Mes produits </CardTitle>
                                <CardText className="textCard">{this.props.producerById.productsPresentation}</CardText>

                            </Card>
                        </div>
                    <div className="produits" id="produits">
                        <CardTitle  className="cardTitle"> Produits à la vente:  </CardTitle>
                        <Slider {...settings}>
                            {this.props.productsByProducerId.map(id => {
                                return(
                                    <Col>
                                    {
                                        id.stock === "En Stock" ?
                                            <CardDeck>
                                                <Card style={{ margin: '3%'}}>
                                                    <CardImg style={{ width: '80%', marginLeft:'10%'}} top width="100%" src={baseUrl + product_dir + id.pictureUrl} alt="Image Produit" />
                                                    {this.state.error && this.state.error}
                                                    <Card.Body>
                                                        <CardTitle className="cardTitle">{id.name}</CardTitle>
                                                        <Card.Text>
                                                            <CardText>{id.category}</CardText>
                                                            <CardText>{id.price} € / vendu par {id.conditioning} </CardText>
                                                        </Card.Text>
                                                    </Card.Body>
                                                    <Popup trigger={<Button variant="outline-info" style={{margin:'2%'}}>Contacter le Producteur</Button>}>
                                                        <div>
                                                            <p>Tel : {this.props.producerById.phone}</p>
                                                            <p>Email :<a href={`mailto:${this.props.producerById.email}`}> {this.props.producerById.email} </a></p>
                                                        </div>
                                                    </Popup>
                                                    {
                                                        consumer ?
                                                            <Button variant="outline-info" style={{margin:'2%'}} onClick={() => this.props.SubscribeProducts(id._id)}>Ajouter ce produit aux favoris</Button>
                                                            :
                                                            null
                                                    }
                                                    <Card.Footer>
                                                        <small className="text-muted"> {id.stock}</small>
                                                    </Card.Footer>
                                                </Card>
                                            </CardDeck>
                                        :
                                        null
                                    }
                                    </Col>
                                );
                            })}
                        </Slider>

                        <p className="error">{this.props.subscribe_product_message}</p>
                    </div>
                    <ModalFooter>
                        <Container fluid>
                            <Container fluid>
                                <div className="cardTitle" id='infoG' text-center>Informations Générales</div>
                            </Container>
                        </Container>
                        <div id="info">
                            <CardDeck className="cardInfo">
                                <Card className="cardFooter">
                                    <CardBody>
                                        <CardTitle className="cardTitle">Contact : </CardTitle>
                                        <CardText>{this.props.producerById.farmName}</CardText>
                                        <CardText>{this.props.producerById.address}</CardText>
                                        <CardText>{this.props.producerById.zipCode}</CardText>
                                        <CardText>{this.props.producerById.city}</CardText>
                                        <CardText>Tel : {this.props.producerById.phone}</CardText>
                                        <Button variant="outline-info" href={`mailto:${this.props.producerById.email}`}>Send an Email</Button>
                                    </CardBody>
                                </Card>
                                <Card className="cardFooter">
                                    {
                                        this.props.pickupPoint ?
                                            <CardBody>
                                                <CardTitle className="cardTitle">Lieux de Collecte: </CardTitle>
                                                <CardText>Vous pouvez retrouver les produits de {this.props.producerById.farmName} à cette adresse :</CardText>
                                                <CardText>{this.props.pickupPoint.pick_up_name}</CardText>
                                                <CardText>{this.props.pickupPoint.address}</CardText>
                                                <CardText>{this.props.pickupPoint.zip_code}</CardText>
                                                <CardText>{this.props.pickupPoint.city}</CardText>
                                                <CardText>Tel : {this.props.pickupPoint.phone}</CardText>
                                                <CardText>{this.props.pickupPoint.opening_hours}</CardText>
                                            </CardBody>
                                            :
                                            <CardBody>
                                                <CardTitle className="cardTitle">Lieux de Collecte : </CardTitle>
                                                <CardText>{this.props.producerById.farmName} n'a pas encore de lieux de collecte disponible</CardText>
                                            </CardBody>
                                    }
                                </Card>
                                <Card className="cardFooter">
                                    <CardBody>
                                        <CardTitle className="cardTitle">A savoir : </CardTitle>
                                        <CardText>{this.props.producerById.toKnow}</CardText>
                                    </CardBody>
                                </Card>
                            </CardDeck>
                        </div>
                    </ModalFooter>
                </div>
            </div>
                <div className="footer">
                    <Footer/>
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
        productsByProducerId: state.productsByProducerId,
        producerById: state.producerById,
        pickupPoint:state.pickupPoint,
        isLoggedIn:state.isLoggedIn,
        data: state.data,
        subscribe_message: state.subscribe_message,
        subscribe_product_message: state.subscribe_product_message,
        error: state.error,
        loading: state.loading,
        grade:state.grade,
        vote:state.vote.message,
        voteError:state.voteError,
    };
}

/**
 * Component actions are dispatched to Redux Store.
 * @param  {*} dispatch
 */


const mapDispatchToProps = dispatch => {
    return {
        GetProducerDataById: (id) => dispatch(GetProducerDataById(id)),
        GetPickUpPoint:(author)=> dispatch(GetPickUpPoint(author)),
        SubscribeProducers: (my_producers) => dispatch(SubscribeProducers(my_producers)),
        GetProductsByProducerId: (id) => dispatch(GetProductsByProducerId(id)),
        SubscribeProducts: (my_categories) => dispatch(SubscribeProducts(my_categories)),
        GetGrade: (producer_id) => dispatch(GetGrade(producer_id)),
        SendMyVote : (newValue, producer_id, consumer_id) => dispatch( SendMyVote(newValue, producer_id, consumer_id)),
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(PublicProfile) ;
