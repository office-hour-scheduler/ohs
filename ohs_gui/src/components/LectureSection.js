import React, { Component } from 'react';
import OHContainer from "./OHContainer"

class LectureSection extends Component {
  render() {
    //const { ohslots } = this.state;
    let params = new URLSearchParams(this.props.location.search);

    return (
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
            <OHContainer>
            </OHContainer>
                        <OHContainer>
            </OHContainer>
                        <OHContainer>
            </OHContainer>
           </tr>
         </table>
      </div>
    );
  }
}

export default LectureSection;
