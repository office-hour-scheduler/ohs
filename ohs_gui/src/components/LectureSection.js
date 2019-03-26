import React, { Component } from 'react';
import OHContainer from "./OHContainer"
import { Button } from 'react-bootstrap';
import ReactDOM from 'react-dom';


class LectureSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slotNum: 4,
      ohrtable: null
    }
console.log(this.state.slotNum)
    this.addSlots = this.addSlots.bind(this);
}

addSlots() {
//TODO Add slots to backend as well
/*const ohtable = document.getElementById("ohrcontainer");
const trow = document.createElement("tr");
const newslot = document.createElement("div");
newslot.className= "book-button";
trow.appendChild(newslot);
ohtable.appendChild(trow);*/
const nslotNum = this.state.slotNum + 4;
this.setState({slotNum : nslotNum});
console.log(nslotNum);
}

  render() {

    //const { ohslots } = this.state;
    let params = new URLSearchParams(this.props.location.search);
    const isProf = this.props.user && this.props.user.role === "PROFESSOR";
    const { slotNum } = this.state;
    if (isProf){
    return (
    <>
      <div>
        LectureSection for {params.get("course")}
        {params.get("year") && (
          <div>
            year: {params.get("year")}
            <br />
            semester: {params.get("semester")}
            <br />
            section_code: {params.get("section_code")}
          </div>
        )}
          <Button variant="primary" onClick={this.addSlots}>
              Add Slots
            </Button>
         <table id="ohrcontainer">
          <tr>
            <OHContainer slotNum={slotNum}>
            </OHContainer>
           </tr>
         </table>
      </div>
      </>
      );
      }else{
          return (
          <>
      <div>
        LectureSection for {params.get("course")}
        {params.get("year") && (
          <div>
            year: {params.get("year")}
            <br />
            semester: {params.get("semester")}
            <br />
            section_code: {params.get("section_code")}
          </div>
        )}
         <table id="ohrcontainer">
          <tr>
            <OHContainer slotNum={slotNum}>
            </OHContainer>
           </tr>
         </table>
      </div>
      </>
      );
      }
    }
  }


export default LectureSection;
