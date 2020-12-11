import React from 'react';
import { connect } from "react-redux";
import {
  SetActiveProducer,
}
  from "../actions/request";
import { 
  Map, 
  Marker, 
  Popup, 
  TileLayer,
  Circle,
  ScaleControl
} from 'react-leaflet';

const TOULOUSE_GPS = {
  lat: 43.6089,
  lng: 1.4368
}

/**
 * This component handles the producers map :
 * it is based on OpenStreetMap
 */
class ProducerMap extends React.Component {
  constructor() {
    super()
    this.state = {
      lat: TOULOUSE_GPS.lat,
      lng: TOULOUSE_GPS.lng,
      zoom: 7,
      activeProducer: null,
    }
    this.handleEnableProducer = this.handleEnableProducer.bind(this);
    this.handleDisableProducer = this.handleDisableProducer.bind(this);
  }

  /**
   * When the user clicks on a producer marker, the producer._id is stored in Redux Store
   * @param {*} producer 
   */
  handleEnableProducer(producer) {
    this.setState({
      activeProducer: producer
    })
    this.props.SetActiveProducer(producer._id)
  }

  /**
   * When marker popup is closed, the producer._id is removed from Redux Store
   */
  handleDisableProducer() {
    this.setState({
      activeProducer: null
    })
    this.props.SetActiveProducer(null)
  }

  render() {

    // Initial position marker
    let initialPosition = [this.state.lat, this.state.lng];
    if (this.props.chosenCity) {
      initialPosition = [this.props.chosenCity[0], this.props.chosenCity[1]];
    }
    const initialPositionPopup = <div>Ma position</div>

    // Producers markers
    const producers = this.props.producers;
    const producerMarkers = producers.map(producer => (
      <Marker
        key={producer._id}
        position={[
          producer.gpsCoordinates[0],
          producer.gpsCoordinates[1],
        ]}
        content={producer.login}
        onClick={() => this.handleEnableProducer(producer)}

      />)
    );

    // Producer popup
    let activeProducerPopup = null;
    if (this.state.activeProducer) {
      activeProducerPopup = (
        <Popup
          position={[
            this.state.activeProducer.gpsCoordinates[0],
            this.state.activeProducer.gpsCoordinates[1],
          ]}
          onClose={() => this.handleDisableProducer()}
        >
          <div>
            {this.state.activeProducer.login}<br/>
            {this.state.activeProducer.address}<br/>
            {this.state.activeProducer.city} ({this.state.activeProducer.zipCode})
          </div>
        </Popup>
      )
    }

    // Circle options
    let circleRadius = this.props.circleRadius * 1000;
    if (!circleRadius) {
      circleRadius = 10 * 1000;
    }    
    const circleOptions = {
      radius: circleRadius,
      color: 'green',
      weight: 1,
    }

    // Map scale options
    const scaleOptions = {
      showImperial: false,
    }
    
    return (
      <Map center={initialPosition} zoom={this.state.zoom}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
        />
        <Marker position={initialPosition}>
          <Popup>
            {initialPositionPopup}
          </Popup>
        </Marker>

        <Circle 
          center={initialPosition}
          radius={circleOptions.radius}
          color={circleOptions.color}
          weight={circleOptions.weight}
        >
        
        </Circle>

        <ScaleControl
          imperial={scaleOptions.showImperial}
        >
        </ScaleControl>

        {producerMarkers}

        {this.state.activeProducer && activeProducerPopup}

      </Map>
    );
  }
}

/**
 * Data are extracted from Redux Store and passed as props to component
 * @param {*} state 
 */
const mapStateToProps = state => {
  return {
    producers: state.producers,
    chosenCity: state.chosenCity,
    circleRadius: state.circleRadius
  };
}

/**
 * Component actions are dispatched to Redux Store
 * @param {*} dispatch 
 */
const mapDispatchToProps = dispatch => {
  return {
    SetActiveProducer: (id) => dispatch(SetActiveProducer(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProducerMap);