import React, { Component } from 'react';
import './OHSlot.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

library.add(faPlus)

class OHSlot extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      booked: this.props.booked,
      //TODO (Replace with individual slot values)
      time: "12:00",
      student: "Charizard"
    }
  }

  componentWillReceiveProps(nextProps) {
    let booked = nextProps.booked;
    this.setState({booked: booked});
  }

  render() {
    const slotClass = this.state.booked ? "book-button booked" : "book-button";
    return (
      <div className={slotClass} onClick={e => this.props.toggleBooking(this.props.id)}>
      <div className="slotinfo">
      Time : {this.state.time}
      <br/>
      Student : {this.state.student}
      </div>
        {this.state.booked ? null : <FontAwesomeIcon className="fa-plus slot-info" icon="plus"/>}
        {this.state.booked ? <h2 className="slot-info">Booked!</h2> : null}
      </div>
    );
  }
}

export default OHSlot;
