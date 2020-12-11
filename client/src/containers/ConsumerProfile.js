
import React, { Component } from 'react';
import { connect } from "react-redux";
import {ModalFooter,CardTitle, CardText,Card, CardImg, CardGroup, Jumbotron, Container} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Row, Col, Button,CardDeck} from 'react-bootstrap';
import '../style.css';
import ConsumerUpdateForm from './ConsumerUpdateForm';
import ConsumerFavoris from './ConsumerFavoris';
import { GetAllArticlesFollowed } from "../actions/request";
import Footer from "./footer"

class MyProfile extends Component {

    /**
     * This method is called after the component gets mounted on the DOM.
     * @param  {*}
     */

    componentDidMount() {
        this.props.GetAllArticlesFollowed(this.props.data._id);
    }

    render() {
        const ArticlesFollowedData = this.props.ArticlesFollowed.length ? (
            this.props.ArticlesFollowed.map(post => {
              return (
                <div key={post._id} className="packCard">
                    <Card className="presentationCard">
                        <CardTitle className="cardTitle"><a style={{color:' #028090ff'}} href={`/public-profile/${post.author_id}`}>@{post.author} : </a>{post.title}</CardTitle>
                        <CardText>{post.content}</CardText>
                    </Card>
                </div>
              );
            })
          ) : (
            <p>Aucun article pour le moment!</p>
          );
        return (
            <div className="mainContainer center producer-profile">
                <div>
                    <Jumbotron className="jumbotron" fluid>
                        <Container fluid>
                            <h1 className="display-3" text-center> Bonjour {this.props.data.login} ,</h1>
                            <p className="lead" text-center >Gérer votre profil et retrouvez dans cette rubrique vos produits et producteurs favoris.  </p>
                        </Container>
                    </Jumbotron>
                </div>
            <div>

                <Row>
            {/* LEFT COLUMN ... */}
                    <Col>
                    {/* data and update form */}
                        <div className="ConsumerUpdateDataAndForm">
                            <h2 className="h2Consumer">{this.props.data.login}</h2>
                            <ConsumerUpdateForm
                            />
                        </div>
                    </Col>
            {/* MAIN COLUMN ... */}
                    <Col xs={9}>
                    <div className="ConsumerFavoris">
                            <ConsumerFavoris
                            />
                        </div>
                        <div className="postConsumer">
                            <h2 className="h2Consumer">Les articles de vos producteurs </h2>
                            {ArticlesFollowedData}
                        </div>
                    </Col>
                </Row>
                <ModalFooter>

                </ModalFooter>
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
    data: state.data,
    ArticlesFollowed: state.ArticlesFollowed,
    error: state.error,
    loading: state.loading,
  };
}

/**
 * Component actions are dispatched to Redux Store.
 * @param  {*} dispatch
 */

const mapDispatchToProps = dispatch => {
  return {
    GetAllArticlesFollowed: (_id) => dispatch(GetAllArticlesFollowed(_id))
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);
