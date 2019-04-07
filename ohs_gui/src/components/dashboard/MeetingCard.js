import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const dateFormat = require('dateformat');

class MeetingCard extends PureComponent {
  render() {
    const { meeting, isProf } = this.props;
    return (
      <Link to={`/meeting/${meeting.meetingId}`}>
        <div className="meeting card-element">
          {meeting.courseCode}
          <br />
          {meeting.time && dateFormat(new Date(meeting.time), 'mmmm dS, yyyy, h:MM TT')}
          <br />
          {meeting.room}
          <br />
          {isProf ? meeting.student.firstName + " " + meeting.student.lastName : meeting.instructor.firstName + " " + meeting.instructor.lastName}
        </div>
      </Link>
    );
  }
}

MeetingCard.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  meeting: PropTypes.object.isRequired,
  isProf: PropTypes.bool.isRequired
};

export default MeetingCard;
