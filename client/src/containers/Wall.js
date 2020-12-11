import React, { Component } from 'react';
import Popup from "reactjs-popup";
import Dropzone from 'react-dropzone';
import { connect } from "react-redux";
import { ModalFooter, CardTitle, CardText, CardGroup, CardBody  } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style.css';
import { Form, Button, Card, Col, Row,CardImg } from 'react-bootstrap';
import { BsPencilSquare, BsFillTrashFill } from "react-icons/bs";
import { PostArticles, GetAllArticles, GetAllArticlesByAuthor, DeleteArticle, UpdateArticle, UploadPicture, } from '../actions/request';
import { SERVER_URL } from "./BaseUrl";
import Moment from 'moment';
import * as moment from 'moment';
import 'moment/locale/fr';
import Footer from "./footer"

const baseUrl = SERVER_URL + "public/article/"
const MAX_SIZE_FILE_UPLOAD_KO = 300;

class Wall extends Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [],
      title: '',
      content: '',
      content_update: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * This method is called after the component gets mounted on the DOM.
   * @param  {*}
   */
  componentDidMount() {
    this.props.GetAllArticles();
  }

  /**
   * This method is called to check if files is autorized or not
   * @param  {*} files
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
   * This method is called to show all existing articles when key is pressed.
   * @param  {*} event
   */
  allPosts = (event) => {
    event.preventDefault();
    this.props.GetAllArticles();
  }

    /**
     * This method is called to show all existing articles when key is pressed.
     * @param  {*} event
     */

  postsByAuthorId = (event) => {
    event.preventDefault();
    this.props.GetAllArticlesByAuthor(this.props.data._id);
  }

    /**
     * Update local state object when a key is being pressed
     * @param  {*} event
     */

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

   /**
     * This method is called to update and upload an article picture
     * @param  {*} files
     * @param  {*} id
     */

  updateArticlePicture = (files, id) => {
    const url = 'article'
    const login = this.props.data.login
    this.onDrop(files);
    this.props.UploadPicture(url, id, files[0], login);
  }
    /**
     * This method make sure to submit form
     * @param  {*} event
     */

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.PostArticles(this.props.data.login, this.props.data._id, this.state.title, this.state.content);
  }


  render() {

    //test
    if(this.props.error){
      console.log(" ----- * error->", this.props.error.message)
    }

    if(this.props.createMessage){
      console.log(" ----- * message create ",this.props.createMessage)
    }

    if(this.props.createError){
      console.log(" ------ * createError * ",this.props.createError)
    }

    //test end
    const producer = (this.props.data.type === "producer");
    const allArticlesData = this.props.allArticles.length ? (
      this.props.allArticles.map(post => {
        return (
          <Col xs={4}>{/*  elo */}
          <div key={post._id} className="divWall">
            <Card>
              <CardBody className="CardWall individualPost">
                {/* <div className="left"> */}
                <CardImg className = "presImage" height="47%" src={baseUrl + post.picture} alt="Card image presentation" />
                {/* </div> */}

                {/* <div className="right"> */}
                  <CardText><h4 className="TitleCardWall">{post.title}</h4></CardText>
                  {
                    this.props.data._id === post.author_id ?
                      <Dropzone onDropAccepted={(files) => this.updateArticlePicture(files, post._id)}>
                        {({ getRootProps, getInputProps }) => (
                          <div {...getRootProps({ className: 'dropzone' })}>
                            <input {...getInputProps()} />
                            <Button className="BtnCardWall2 BtnCardWall">Ajouter une image</Button>
                          </div>
                        )}
                      </Dropzone>
                      :
                      null
                  }
                  <CardText>Posté par <a className="LinkCardWall" href={`/public-profile/${post.author_id}`}>{post.author}</a> </CardText>
                  <CardText className="content">{post.content}</CardText>
                  <CardText className="date">{moment(post.created_at, "YYYYMMDD").fromNow()} <small>( le: {moment(post.created_at).format('DD/MM/YY')} à {moment(post.created_at).format('hh:mm')})</small></CardText>


                  {
                    this.props.data._id === post.author_id ?
                      <div>
                        <img className="wall-picto" src={require('../img/picto_white.png')}/>
                      <Button className="BtnCardWall" onClick={() => this.props.DeleteArticle(post._id, this.props.data._id)}><BsFillTrashFill /></Button>
                      <Popup trigger={<Button className="BtnCardWall"><BsPencilSquare /></Button>} modal>
                        <div>
                          <div>
                            <Card className="login bigShadow">
                              <Card.Body>
                              <Form onSubmit={(event) => {this.props.UpdateArticle(post._id, this.props.data._id, this.state.content_update); event.preventDefault();}}>

                                <Form.Group controlId="formBasicContent">
                                  <Form.Control
                                  as="textarea"
                                  rows="3"
                                  name="content_update"
                                  placeholder="Contenu"
                                  value={this.state.content_update}
                                  onChange={this.handleChange}
                                  />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="log">Modifier !</Button>
                              </Form>
                              <p className="error">{this.props.createError && this.props.createError}</p>
                              </Card.Body>
                            </Card>
                          </div>
                        </div>
                      </Popup>
                      </div>
                      :
                      null
                  }
                {/* </div> */}
              </CardBody>
            </Card>
          </div>
          </Col>
        );
      })
    ) : (
      <p>Aucun article pour le moment!</p>
    );
    return (
      <div>
      <div className="mainContainer center PostWall">
        <h2> Le coin des saisons </h2>
          {
            producer ?
                <div>
                <Button className="BtnMessWall" onClick={this.allPosts}>Afficher <span>tous</span> les messages</Button>
                <Button className="BtnMessWall" onClick={this.postsByAuthorId}>Afficher uniquement <span>mes messages</span></Button>
                <Card className="login bigShadow">
                <Card.Body className="CardWall">
                  <h4>Poster un nouvel article</h4>       {/* elo */}
                  <Form onSubmit={this.handleSubmit}>

                    <Form.Group controlId="formBasicTitle">
                        <Form.Control
                        type="text"
                        name="title"
                        placeholder="Titre"
                        value={this.state.title}
                        onChange={this.handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicContent">
                        <Form.Control
                        as="textarea"
                        rows="4"
                        name="content"
                        placeholder="Contenu"
                        value={this.state.content}
                        onChange={this.handleChange}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="log SubmitPostWall">Envoyer !</Button>
                  </Form>
                  <p className="error">{this.props.createError && this.props.createError}</p>
                </Card.Body>
                </Card>
                </div>
                :
                null
          }
          <br></br>
                  {/* <img className="ImgWall" src={require('../img/bandeau_aliments_turquoise3.png')}/> */}
          <ModalFooter >
            <Row>{/*  elo */}
              <div className="divWall">
                <CardGroup>
                  {allArticlesData}
                </CardGroup>
              </div>
            </Row>
          </ModalFooter>
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
        data: state.data,
        allArticles: state.allArticles,
        isLoggedIn: state.isLoggedIn,
        error: state.error,
        loading: state.loading,
        createMessage : state.createMessage,
        createError: state.createError
    };
}

/**
 * Component actions are dispatched to Redux Store.
 * @param  {*} dispatch
 */

const mapDispatchToProps = dispatch => {
    return {
        PostArticles: (author, author_id, title, content) => dispatch(PostArticles(author, author_id, title, content)),
        GetAllArticles: () => dispatch(GetAllArticles()),
        GetAllArticlesByAuthor: (author_id) => dispatch(GetAllArticlesByAuthor(author_id)),
        DeleteArticle: (post_id, author_id) => dispatch(DeleteArticle(post_id, author_id)),
        UpdateArticle: (post_id, author_id, content) => dispatch(UpdateArticle(post_id, author_id, content)),
        UploadPicture: (url, producer_id, imagePath, login) => dispatch(UploadPicture(url, producer_id, imagePath, login)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Wall);
