import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CardText, CardBody, Row, Col} from 'reactstrap';
import '../style.css';


class Footer extends Component {


  render() {
    return (
      
        <Row className="footer-module">

          <Col xs={1}></Col>

          <Col xs={3}>
                <h4  text-center>Un peu de lecture...</h4>
                <CardBody>
                  <CardText><a href={`/mentions_legales.html`} target="_blank">Mentions Legales</a></CardText>
                  <CardText><a href={`/cgv.html`} target="_blank">CGV</a></CardText>
                  <CardText><a href={`/rgpd.html`} target="_blank">RGPD</a> </CardText>
                </CardBody>
              
          </Col>

          <Col xs={4}>
            
            <h4  text-center>Contactez-nous !</h4>
            
            <div id="info">
                  
              <CardBody id="contact">
                <CardText>La bande des 4 </CardText>
                <CardText>F.A (R) M.E </CardText>
                <CardText>6 rue de la petite ferme</CardText>
                <CardText>31 000 TOULOUSE</CardText>
                <a href="mailto:monPetitProducteur@gmail.com" target="_blank">monPetitProducteur@gmail.com</a>
              </CardBody>
                
            </div>

          </Col>

          <Col xs={3}>
            <h4  text-center>A partager sans modération ...</h4>

            <div className="flex socMed" >
            <a href={`https://www.facebook.com/`} target="_blank"><img className="socialMedia" src={require('../img/facebook.png')}/></a>
            <a href={`https://www.instagram.com/`} target="_blank"> <img className="socialMedia" src={require('../img/insta.png')}/></a>
            <a href={`https://twitter.com/`}  target="_blank"> <img className="socialMedia" src={require('../img/tweeter.png')}/></a>
            </div>
          </Col>
          
          <Col xs={1}></Col>       
        </Row>

    );
  }
}

export default Footer;
