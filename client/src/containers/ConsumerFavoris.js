import React, { Component } from 'react';
import { connect } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { GetfavoritesProducers, RemoveAFavoriteProducer, GetfavoritesProducts, RemoveAFavoriteProduct } from "../actions/request";
import { SERVER_URL } from "./BaseUrl";

const baseUrl = SERVER_URL + "public/"
const producers_pres_dir = "producer-presentation/"//ajouter le nom de sous dossier
// const products_pres_dir = "products-presentation/"//ajouter le nom de sous dossier
// const farm_pres_dir = "farm-presentation/"//ajouter le nom de sous dossier
const product_dir = "product/"//ajouter le nom de sous dossier


class ConsumerFavoris extends Component {

    /**
     * This method is called after the component gets mounted on the DOM.
     * @param  {*}
     */

    componentDidMount(){
        this.props.GetfavoritesProducers();
        this.props.GetfavoritesProducts();
    }

    /**
     * This method is called to remove producer from favorite list on consumer side.
     * @param  {ObjectId} producer_id producer Id found in BDD.
     */


    handleRemoveProducer= (producer_id)=> {
        console.log("---------------------Remove A favorite Producer : ",producer_id,"---------------    [client][consumerFavoris.js]")
        this.props.RemoveAFavoriteProducer(producer_id);
        this.props.GetfavoritesProducers();
    }

    /**
     * This method is called to go to producer profile when key is being pressed.
     * @param  {ObjectId} producer_id producer Id found in BDD.
     */

    ProfilProducer = (producer_id) => {
        window.location = "http://localhost:3000/public-profile/" + producer_id
    }

    /**
     * This method is called to remove product from favorite list on consumer side.
     * @param  {ObjectId} product_id producer Id found in BDD.
     */

    handleRemoveProduct= (product_id)=> {
        console.log("---------------------Remove A favorite Producer : ",product_id,"---------------    [client][consumerFavoris.js]")
        this.props.RemoveAFavoriteProduct(product_id);
        this.props.GetfavoritesProducts();
    }

    render() {

        // -----------  MY PRODUCERS...   --------
        let myProducers = this.props.favoritesProducers
        console.log(" *  this.props.favoritesProducers -> ", this.props.favoritesProducers)
        let myCompleteFavoritesProducers = "";
        if(!myProducers){
            myCompleteFavoritesProducers = "Vous n'avez séléctionné aucun producteur favoris !";
        }else{
            myCompleteFavoritesProducers = myProducers.map(
                (producer) =>
                <Col xs={4} key={producer._id} >
                    <Card style={{ width: '18rem'}}>
                        <Card.Img variant="top" src={baseUrl + producers_pres_dir + producer.producerPicture} />
                        <Card.Header style={{color: ' #028090ff'}}>{producer.farmName}</Card.Header>
                        <Card.Body>
                            <Card.Text>Adresse: {producer.zipCode} {producer.city}</Card.Text>
                            <Card.Text>Tel: {producer.phone}</Card.Text>
                            <Card.Footer >Points de retrait : {producer.pickupPoint}</Card.Footer >
                            <Button className='buttonConsumerProfile' variant="outline-info" onClick={() => this.ProfilProducer(producer._id)}>Profil</Button>
                            <Button className='buttonConsumerProfile' variant="outline-danger" onClick={() => this.handleRemoveProducer(producer._id)}> Supprimer </Button>
                        </Card.Body>
                    </Card>
                </Col>
            )
        }

        //-----------  MY PRODUCTS...   --------
        let myProducts = this.props.favoritesProducts
        console.log(" *  this.props.favoritesProducts -> ", myProducts)
        let myCompleteFavoritesProducts = "";
        if(!myProducts){
            myCompleteFavoritesProducts = "Vous n'avez séléctionné aucun produit favoris ! ";
        }else{
            myCompleteFavoritesProducts = myProducts.map(
                (product) =>
                <Col xs={4} key={product._id}>
                    <Card style={{ width: '18rem', maxWidth:'18rem' }}>
                        <Card.Img variant="top" src={baseUrl + product_dir + product.pictureUrl} />
                        <Card.Header style={{color: ' #028090ff'}}>{product.name}</Card.Header>
                        <Card.Body>
                            <Card.Title >{product.category}</Card.Title>
                            <Card.Text> {product.description} </Card.Text>
                            <Card.Text> {product.zipCode} {product.city}</Card.Text>
                            <Card.Text> {product.stock}</Card.Text>
                            <Card.Text> Prix: {product.price} € / {product.conditioning}</Card.Text>
                            <Card.Footer > Proposé par: <a style={{color: ' #028090ff'}} href={`/public-profile/${product.author_id}`}>{product.author}</a></Card.Footer >
                            <Button className='buttonConsumerProfile' variant="outline-danger" onClick={() => this.handleRemoveProduct(product._id)}> Supprimer </Button>
                        </Card.Body>
                    </Card>
                </Col>
            )
        }

        return (
            <div className="mesFavoris ">
                <h2 className="h2Consumer">Mes producteurs favoris</h2>
                <div className="listProducteursFavoris ">
                {/* <button onClick={() => this.GetfavoritesProducers()}>
                    Clique ici
                </button> */}
                    <Row>
                        {myCompleteFavoritesProducers}
                    </Row>
                </div>

                <h2 style={{marginTop:'5%'}}className="h2Consumer">Mes produits favoris</h2>
                <div className="listProduitsFavoris ">
                {/* <button onClick={() => this.GetfavoritesProducts()}>
                    Clique ici
                </button> */}
                    <Row>
                        {myCompleteFavoritesProducts}
                    </Row>
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
      data: state.data,
      favoritesProducers : state.favoritesProducers,
      favoritesProducts : state.favoritesProducts,
      message : state.message,
    };
}

/**
 * Component actions are dispatched to Redux Store.
 * @param  {*} dispatch
 */

const mapDispatchToProps = dispatch => {
    return {
        GetfavoritesProducers : () => dispatch(GetfavoritesProducers()),
        RemoveAFavoriteProducer : (producer_id) => dispatch(RemoveAFavoriteProducer(producer_id)),
        GetfavoritesProducts : () => dispatch(GetfavoritesProducts()),
        RemoveAFavoriteProduct : (product_id) => dispatch(RemoveAFavoriteProduct(product_id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConsumerFavoris);
