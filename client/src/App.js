import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AiOutlineArrowUp } from 'react-icons/ai';
import MyNav from './containers/MyNav';
import './style.css';
import {
  Row,
  Col,
 } from 'reactstrap';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_visible: false,
    }
  }

  /**
   * This method is called after the component gets mounted on the DOM.
   * @param  {*}
   */

  componentDidMount() {
    var scrollComponent = this;
    document.addEventListener("scroll", function (e) {
      scrollComponent.toggleVisibility();
    });
  }

  /**
   * This method is called and triggered to Toggle visibility of a content tab
   * @param  {*}
   */

  toggleVisibility() {
    if (window.pageYOffset > 150) {
      this.setState({
        is_visible: true
      });
    } else {
      this.setState({
        is_visible: false
      });
    }
  }

  /**
   * This method is called and triggered when user want to go to the top of the page in a click.
   * @param  {*}
   */

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  render() {
    return (
      <div>
        <div fluid className="Master-Header fluid">
          <Row>
              <Col><img src={require('./img/logo.png')}/></Col>
          </Row>
          {/* <h1>Mon petit producteur occitan</h1> */}
        </div>

        <div>
          <MyNav />
        </div>

        <div className="scroll-to-top">
          {this.state.is_visible && (
            <button onClick={() => this.scrollToTop()} className="buttonTop">
              Top <AiOutlineArrowUp />
            </button>
          )}
        </div>

      </div>
    );
  }
}

export default App;
