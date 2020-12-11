import React, { Component } from 'react';
import ProducersSearch from './ProducersSearch'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style.css';
import "../mapStyle.css";
import Footer from "./footer"

export default class FindProducer extends Component {
  render() {
    return (
    <div>
      <div className="mainContainer center myContainer">
        <ProducersSearch />
      </div>
      <div className="footer">
        <Footer/>
      </div>
    </div>
      
    );
  }
}
