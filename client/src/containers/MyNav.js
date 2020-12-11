import React from "react";
import "../style.css";
import {
    Link,
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import { GiBeet, GiBeehive, GiGroundSprout,GiFarmTractor,GiFarmer,GiFruitBowl,GiWheat,GiBananaPeeled } from 'react-icons/gi';


import { connect } from "react-redux";
import { Logout, CheckAuth } from "../actions/request";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Button, Col, Row, } from 'react-bootstrap';
import Registration from './Registration'
import RegistrationConsumer from './Registration_C'
import RegistrationProducer from './Registration_P'
import Login from './Login'
import LoginConsumer from './Login_C'
import LoginProducer from './Login_P'
import MyProfile from './ConsumerProfile'
import Home from './Home'
import Wall from './Wall'
import FindProducer from './findProducers'
import ProducerProfile from "./ProducerProfile";
import PublicProfile from "./PublicProfile";
import Admin from "./admin";


class MyNav extends React.Component {

    /**
     * This method is called after the component gets mounted on the DOM.
     * @param  {*}
     */

    componentDidMount() {
        this.props.CheckAuth();
    }

    /**
     * Handle the logging out process when a key is being pressed
     * @param  {*}
     */

    handleLogout = () => {
        this.props.Logout();
    }

    render() {
        const admin =(this.props.data.is_admin === true)
        const loggedIn = (this.props.isLoggedIn === "LOGGED_IN");
        const consumer = (this.props.data.type === "consumer");
        const producer = (this.props.data.type === "producer");
        console.log("loggedIn: ", loggedIn);
        const redirToLogin = <Redirect to='/login' />;
        const redirToHome = <Redirect to='/Home' />;



        return (
            <Router >
                <div className="Navigation-site">
                    <Navbar variant="dark" className="myNav">
                        <Nav className="mr-auto">
                            <Row xs={12}>

{/* --------------- left side ----------------*/}
                                <Col xs={1}></Col>
                                <Col xs={2} className="left-side">
                                    
                                    {
                                        <Link to="/home" title="Accueil" className="flex">

                                            <img className="logoNav" src={require('../img/logo_cercles.png')}/>
                                        </Link>
                                    }
                                    {
                                        <Link to="/myprofile" title="Mon profil" className="flex">
                                            <div className="topNav">
                                                {
                                                    loggedIn ?
                                                        <Navbar.Brand>{this.props.data.login}</Navbar.Brand>
                                                        :
                                                        <Navbar.Brand>Visiteur</Navbar.Brand>
                                                }
                                            </div>
                                        </Link>
                                    }
                                </Col>

{/* --------------- right side ----------------*/}
                                <Col xs={1}></Col>
                                <Col xs={8} className="right-side">
                                <GiBeehive/>
                                {
                                    loggedIn && admin ?
                                        <Link className="special" to="/admin" title=" Admin Space">Admin</Link>
                                        :
                                        null
                                }
                               
                                {
                                    loggedIn ?
                                        null
                                        :
                                        <Link  to="/registration">S'enregistrer</Link> 
                                }
                                <GiFarmTractor />
                                 {
                                    loggedIn ?
                                        <Link to="/Wall" title="Les articles des producteurs">Nouveautés !</Link>
                                        :
                                        null
                                }
                                 <GiFruitBowl/>
                                {
                                    loggedIn ?
                                        <Link to="/findProducers" title="Trouver un producteur">Le coin des producteurs</Link>
                                        :
                                        null
                                }

                                {
                                    loggedIn && consumer  ?
                                        <Link to="/myprofile" title="Mon profil">Mon profil</Link>
                                        :
                                        null
                                }
                               
                                {
                                    loggedIn && producer ?                        
                                        <Link to="/producer-profile" title=" Profil producteur">Mon profil</Link>
                                        :
                                        null
                                }
                                <GiWheat/>
                                {
                                    loggedIn ?
                                    
                                        <Button className="special" onClick={this.handleLogout}>Se déconnecter</Button>
                                        :
                                        <Link to="/login">Se connecter</Link>
                                }
                             <GiBeet/> 
                                
                                </Col>
                                {/* <Col xs={1}></Col> */}
                            </Row>
                        </Nav>
                    </Navbar>
                </div>



                <Switch>
                    <div className="body">
                        <Route exact path="/">
                            <Home/>
                        </Route>
                        <Route exact path="/admin">
                            {admin ? <Admin />: redirToLogin}
                        </Route>

                        <Route exact path="/login">
                            <Login />
                        </Route>

                        <Route exact path="/Wall">
                            {loggedIn ? <Wall /> : redirToLogin}
                        </Route>

                        <Route exact path="/login/consumer">
                            <LoginConsumer />
                        </Route>

                        <Route exact path="/login/producer">
                            <LoginProducer />
                        </Route>

                        <Route exact path="/registration">
                            <Registration />
                        </Route>

                        <Route exact path="/registration/consumer">
                            <RegistrationConsumer />
                        </Route>

                        <Route exact path="/registration/producer">
                            <RegistrationProducer />
                        </Route>


                        <Route exact path="/producer-profile">
                            {loggedIn ? <ProducerProfile />: redirToLogin}
                        </Route>

                        <Route exact path="/public-profile/:id" component={PublicProfile}/>
{/* 
                        <Route path="/public-profile/:id">
                            {loggedIn ? <PublicProfile/> : redirToLogin}
                        </Route>  */}

                        <Route exact path="/myprofile">
                            {loggedIn ? <MyProfile /> : redirToLogin}
                        </Route>

                        <Route exact path={"/home"}>
                            <Home/>
                        </Route>

                        <Route exact path="/findProducers">
                            {loggedIn ? <FindProducer /> : redirToLogin}
                        </Route>
                    </div>
                </Switch>
            </Router>
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
        isLoggedIn: state.isLoggedIn,
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
        CheckAuth: () => dispatch(CheckAuth()),
        Logout: () => dispatch(Logout()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyNav);
