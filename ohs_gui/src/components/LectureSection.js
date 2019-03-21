import React, { Component } from 'react';
import OHContainer from "./OHContainer";
import './LectureSection.css';

class LectureSection extends Component {
  render() {
    let params = new URLSearchParams(this.props.location.search);
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const times = ["8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm"]

    return (
      <>
        {/*LectureSection for {params.get("course")}
        {params.get("year") && (
          <div>
            year: {params.get("year")}
            <br />
            semester: {params.get("semester")}
            <br />
            section_code: {params.get("section_code")}
          </div>
        )}*/}

        <div className="section-info">
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
        </div>
        <div className="section-agenda">
          Select Day: <select className="section-day" ref="daySelect" onChange={this.dayPicked}>
            {daysOfWeek.map(d => (
              <option value={d}>{d}</option>
            ))}
          </select>
          <div className="section-times">
          {times.map(t => (<div>{t}</div>))}
          </div>
          <OHContainer slotNum={14} />
        </div>
      </>
    );
  }
}

export default LectureSection;
