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
      booked: this.props.booked
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
        {this.state.booked ? null : <FontAwesomeIcon className="fa-plus slot-info" icon="plus"/>}
        {this.state.booked ? <h2 className="slot-info"></h2> : null}
      </div>
    );
  }
}

export default OHSlot;
