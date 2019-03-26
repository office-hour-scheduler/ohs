import React, { Component } from 'react';
import './OHContainer.css';
import OHSlot from "./OHSlot"
import shortid from 'shortid';

class OHContainer extends Component {
  constructor(props) {
    super(props);

    // TODO
    var bookedSlots = new Array(this.props.slotNum);
    //var bookedSlots = new Array(4);
    for (var i = 0; i < bookedSlots.length; ++i) { bookedSlots[i] = false; }

    this.state = { 
      slotNum : this.props.slotNum,
      bookedSlots: bookedSlots
     }
     console.log(this.props.slotNum);
     this.toggleBooking = this.toggleBooking.bind(this);
  }

  toggleBooking(idx) {
    var lst = this.state.bookedSlots.slice(0);
    lst[idx] = !lst[idx];
    this.setState({bookedSlots: lst});
  }

  render() {
    const slots = this.state.bookedSlots.map((d, i) => 
      <OHSlot key={shortid.generate()} id={i} toggleBooking={this.toggleBooking} booked={this.state.bookedSlots[i]}>{d} </OHSlot>);

    return (
      <div className="office-hour-cont">
        <div className="container">
            {slots}
        </div>
      </div>
    );
  }
}

export default OHContainer;