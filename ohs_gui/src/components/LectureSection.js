import React, { Component } from 'react';
import OHContainer from "./OHContainer"
import { Button } from 'react-bootstrap';
import ReactDOM from 'react-dom';


class LectureSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nrows: 0,
      rows: [],
      slotNum: 4,
      ohrtable: null
    }
console.log(this.state.slotNum)
    this.addSlots = this.addSlots.bind(this);
    this.addRows = this.addRows.bind(this)
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

addRows(){
const addRows = this.state.rows;
const nRows = this.state.nrows + 1;
addRows.push(<OHContainer slotNum={4}/>);
this.setState({rows : addRows});
this.setState({nrows : nRows});
}

  render() {

    //const { ohslots } = this.state;
    let params = new URLSearchParams(this.props.location.search);
    const isProf = this.props.user && this.props.user.role === "PROFESSOR";
    const { slotNum, rows, nrows } = this.state;
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
          <Button variant="primary" onClick={this.addRows}>
              Add Slots
            </Button>
         <table id="ohrcontainer">
          <tr>
            {this.state.rows}
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
            {this.state.rows}
           </tr>
         </table>
      </div>
      </>
      );
      }
    }
  }


export default LectureSection;
