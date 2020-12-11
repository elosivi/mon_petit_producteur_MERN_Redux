import React, { Component } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Breadcrumb, Card, Button, CardTitle, CardText, CardImg, Row, Col,} from 'reactstrap';
import { Link,} from "react-router-dom";
import '../style.css';
import {connect} from "react-redux";
import {GetAllProducersData, HowManyProducers, HowManyConsumers} from "../actions/request";
import { SERVER_URL , CLIENT_URL } from "./BaseUrl";
import Footer from "./footer"
import {IoIosArrowDown} from 'react-icons/io';
import {GiDirectionSigns} from 'react-icons/gi';

const baseUrl = SERVER_URL + "public/"
const producers_pres_dir = "producer-presentation/"

class Home extends Component {

    /**
     * This method is called after the component gets mounted on the DOM.
     * @param  {*}
     */

  componentDidMount() {
    this.props.GetAllProducersData();
    this.props.HowManyConsumers() ;
    this.props.HowManyProducers();
  }

  render() {
   let settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 3
  };

    return (
      <div>
        <div className="home body">

            {/* -------------------  page link / anchors  -------------- */}

              <Breadcrumb className="navProducerProfile" tag="nav" listTag="div">
              <IoIosArrowDown/>
                <a href="http://localhost:3000/home#quisommesnous"> Qui sommes nous ? </a>
                <a href="http://localhost:3000/home#commentcamarche"> Comment ça marche ? </a>
                <a href="http://localhost:3000/home#selection"> Nos engagements </a>
                <a href="http://localhost:3000/home#portraits"> Portraits de producteurs </a>
                <a href="http://localhost:3000/home#info"> Contact </a>
                <IoIosArrowDown/>
              </Breadcrumb>



            {/* -------------------  Qui sommes nous ?  -------------- */}

              <div className="presentationCard QuiSommesNous" >
                <Row className="title">
                  <Col xs={2}></Col>
                  <Col  xs={7}>
                    <h3 className="Article_title" id="quisommesnous"  >Qui sommes-nous ? ... </h3>
                  </Col>
                  <Col className="laurier">
                    <img src={require('../img/laurier.png')}/>
                  </Col>
                </Row>
                <Row className="text">
                    <Col xs={3}></Col>
                    <Col>
                      <p>L’équipe est composée de quatre fondateurs, Anthony, François, Elodie et Marie.
                          Après quelques voyages lointains et nos différentes expériences professionnelles dans le domaine de l’informatique,
                          nous avons souhaité développer un projet qui pouvait être un lieu unique qui mélangerait nos expériences, nos sensibilités et nos envies.
                          Après un confinement difficile pour certains, nous avons décidé de créer cette plateforme de mise en relation afin de favoriser un rapport juste et direct entre le consommateur et  les petits producteurs d’Occitanie.

                      </p>
                    </Col>
                    <Col xs={3}></Col>
                 </Row>
              </div>

            {/* -------------------  steps -------------- */}

              <div className="steps" id="commentcamarche">
                <Row>
                  <Col>
                    <h3>... Ici c'est simple et rapide !...</h3>
                  </Col>

                </Row>
                <Row>
                  <Col xs={2}></Col>

                  <Col className="step-text">
                    <img className="number" src={require('../img/un.png')}/>
                    <div className="step-height">
                      <p> Je <span><Link title="Trouver un producteur" to= "/findProducers">cherche un producteur</Link> </span> proche de chez moi, je consulte sa présentation et ses lieux de «pick up» </p>
                      <p>ou ...
                      Je consulte les <span><Link to="/Wall">nouveautés !</Link></span></p>
                    </div>
                    <img className="picto" src={require('../img/loupe.png')}/>
                  </Col>

                  <Col className="step-text">
                    <img className="number" src={require('../img/deux.png')}/>
                    <div className="step-height">
                      <p> Je <span><Link to="/findProducers">choisis les produits</Link></span>  en stock qui m’interressent, je les réserve</p>
                    </div>
                    <img className="picto biggest-one" src={require('../img/paniermixte.png')}/>
                  </Col>

                  <Col className="step-text">
                    <img className="number" src={require('../img/trois.png')}/>
                    <div className="step-height">
                      <p> Je <span><Link to="/findProducers">contacte le producteur</Link></span> pour organiser la récupération de ma commande</p>
                    </div>
                    <img className="picto biggest-two" src={require('../img/contact.png')}/>
                  </Col>

                  <Col className="step-text">
                    <img className="number" src={require('../img/quatre.png')}/>
                    <div className="step-height">
                      {
                        this.props.data.type !== "producer" ?
                        <p> Je peux mettre le producteur et ses produits dans mes <Link to="/myprofile"><span>favoris </span></Link> pour les suivre. 
                        Je peux aussi <Link to="/findProducers"><span>noter</span></Link> mon experience.</p> 
                        :
                        <p> Je peux mettre le producteur et ses produits dans mes favoris pour les suivre. 
                        Je peux aussi <Link to="/findProducers"><span>noter</span></Link> mon experience.</p>
                      } 
                    </div>
                    <img className="picto biggest-three" src={require('../img/grade.png')}/>
                  </Col>

                  <Col xs={2}></Col>
                </Row>
              </div>


            {/* -------------------  quelques chiffres -------------- */}

              <div className="communaute">
                <h3>...Notre belle communauté s'aggrandie !</h3>
                <Row>
                  <Col xs={2}></Col>
                  <Col>
                    <h4>{this.props.nbrProducers && this.props.nbrProducers.number} </h4>
                    <p> producteurs</p>
                  </Col>
                  <Col>
                    <h4>{this.props.nbrConsumers && this.props.nbrConsumers.number} </h4>
                    <p> consommateurs</p>
                  </Col>
                  <Col xs={2}></Col>

                </Row>

                <div className="separator">
                  <img  src={require('../img/bandeau_aliments_turquoise.png')}/>
                </div>

              </div>

              {/* -------------------  trio -------------- */}
            <div className="trio" id="selection">
              <Row>
                <Col xs={2}></Col>
                <Col><img className="presentation" src={require('../img/producteurs_texte.jpg')}/></Col>
                <Col>
                  <div className="flex">
                    <h4>Sélection des producteurs...</h4> <img className="little" src={require('../img/laurier.png')}/>
                  </div>
                  <p>
                      Nos Producteurs sont avant tout des partenaires avec qui nous avons tissé des liens de confiance au fil du temps.
                      Le choix de nos producteurs, c’est toujours l’histoire d’une rencontre autour de valeurs communes : des agriculteurs de qualité privilégiant le goût, la fraîcheur et le respect de l’environnement.
                      Tous nos producteurs sont avant tout passionnés et sont certifiés agriculture biologique ou biodynamique.
                      Nous privilégions les circuits les plus courts avec des échanges commerciaux éthiques et équitables, des produits pour une consommation la plus locavore possible.
                  </p>
                </Col>
                <Col xs={2}></Col>
              </Row>

              <Row>
                <Col xs={2}></Col>
                <Col>
                  <div className="flex">
                    <h4> Des produits en circuit court... </h4> <img className="little" src={require('../img/laurier.png')}/>
                  </div>
                  <p> Mon Petit Producteur Occitan favorise les circuits cours. Les circuits courts ont de nombreux avantages et conséquences sur le quotidien des consommateurs et des agriculteurs.
                      Tout d'abord il renforce le lien entre consommateurs et producteurs : les consommateurs n'ont jamais été aussi proches de leurs voisins agriculteurs ! Avec eux, ils partagent valeurs et conseils autour de produits sains, frais et issus de l'agriculture bio pour la plupart.
                      Il privilégie également les produits français : faire ses courses dans une ferme près de la maison, sur un marché ou chez le producteur du coin signifie consommer local donc privilégier l'agriculture française à celles d'autres pays voisins.
                      De plus, il permet aux consommateurs de faire des économies en consommant local : en réduisant les intermédiaires, les emballages et certains maillons de la chaîne de distribution, des économies se font ressentir auprès des consommateurs comme des producteurs.
                      Grâce à lui, les agriculteurs n'ont pas d'intermédiaire et vendent au juste prix, celui qui lui permettra de ne pas vendre à perte comme c'est souvent le cas lorsqu'ils vendent aux groupes de grande distribution pour être toujours plus compétitifs. Ainsi, ils gagnent plus en produisant mieux.
                      Issus de l'agriculture bio ou dite raisonnée, les produits vendus en circuit court sont souvent dénués de pesticides et sont vendus avec moins d'emballage que dans d'autres magasins. De plus, il limite les déplacements en assurant une consommation responsable.
                  </p>
                </Col>
                <Col><img className="presentation" src={require('../img/produits_texte.jpg')}/></Col>
                <Col xs={2}></Col>
              </Row>

              <Row>
                <Col xs={2}></Col>
                <Col><img className="presentation" src={require('../img/map.jpg')}/></Col>
                <Col>
                  <div className="flex">
                    <h4>Une map interactive...</h4> <img className="little" src={require('../img/laurier.png')}/>
                  </div>
                  <p>Notre map interactive vous permets de trouver en un clic les produits que vous recherchez.
                      Il vous est également possible d’ajuster la distance que vous souhaitez parcourir.
                      Mon petit producteur Occitan favorise une mise en relation sur des distances courtes.
                      Appuyer sur le champignon ne le fera pas pousser plus vite, nous vous incitons donc à utiliser cette échelle afin de réduire vos déplacements.
                  </p>
                </Col>
                <Col xs={2}></Col>
              </Row>
            </div>


            {/* -------------------  portraits -------------- */}

            <div className="portraits" id="portraits">
              <h3  className="cardTitle"> Portraits de nos Producteurs </h3>
              {/* <Row> */}
              <Slider {...settings}>

                  <Col xs={1}></Col>

                  {this.props.allProducers.map(producer => {
                    return(
                        <Col xs={2} className="One-portrait">
                            <Card body>
                            <CardTitle> {producer.login}</CardTitle>
                            <CardText> {producer.farmName}</CardText>
                            <CardImg top width="100%" src={baseUrl + producers_pres_dir + producer.producerPicture} alt="Card image presentation" />
                            { 
                              this.props.data.type === 'consumer' ||  this.props.data.type === 'producer' ?
                              <Link to={`/public-profile/${producer._id}`}><GiDirectionSigns/>Profile</Link> 
                              :
                              null
                            }
                            
                          </Card>
                        </Col>
                    );
                  })}

                  <Col xs={1}></Col>

              </Slider>
              {/* </Row> */}
            </div>
          </div>

          <div className="footer">
          <Footer/>
          </div>

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
    allProducers: state.allProducers,
    isLoggedIn:state.isLoggedIn,
    data: state.data,
    error: state.error,
    loading: state.loading,
    nbrProducers: state.nbrProducers,
    nbrConsumers: state.nbrConsumers,


  };
}

/**
 * Component actions are dispatched to Redux Store.
 * @param  {*} dispatch
 */

const mapDispatchToProps = dispatch => {
  return {
    GetAllProducersData: () => dispatch(GetAllProducersData()),
    HowManyConsumers: () => dispatch(HowManyConsumers()),
    HowManyProducers: () => dispatch(HowManyProducers()),
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(Home) ;
