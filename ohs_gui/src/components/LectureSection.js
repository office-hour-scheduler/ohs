import React, { Component } from 'react';
import OHContainer from "./OHContainer"
import { Button } from 'react-bootstrap';
import ReactDOM from 'react-dom';


class LectureSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
    //TODO: Get rows and nrows from backend
      nrows: 0,
      rows: [],
      slotNum: 4
    }
console.log(this.state.slotNum)
    this.addSlots = this.addSlots.bind(this);
    this.addRows = this.addRows.bind(this)
    this.removeRows = this.removeRows.bind(this)
}

addSlots() {
//TODO Add slots to backend as well...may not be implemented at the end
    const nslotNum = this.state.slotNum + 4;
    this.setState({slotNum : nslotNum});
    console.log(nslotNum);
}
//TODO Add/Remove from backend persistence
addRows(){
    const addRows = this.state.rows;
    const nRows = this.state.nrows + 1;
    addRows.push(<OHContainer slotNum={this.state.slotNum}/>);
    this.setState({rows : addRows});
    this.setState({nrows : nRows});
}

removeRows(){
    const removeRows = this.state.rows;
    const nRows = this.state.nrows - 1;
    removeRows.pop();
    this.setState({rows : removeRows});
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
          <Button variant="primary" onClick={this.removeRows}>
              Remove Slots
          </Button>
         <table id="ohrcontainer">
          <tr>
            {rows}
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
            {rows}
           </tr>
         </table>
      </div>
      </>
      );
      }
    }
  }


export default LectureSection;
