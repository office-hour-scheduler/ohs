import React, { PureComponent } from 'react';
import { Button } from 'react-bootstrap';
import { Redirect } from 'react-router'


// TO DO - Change this to import to be consistent
const dateFormat = require('dateformat');

class MeetingInfo extends PureComponent {
  render() {
    console.log(this.props);
    const { meeting, isProf, postponeMeeting, cancelMeeting } = this.props;

    return (
      <div className="meeting-info">
        {meeting && (
          <>
            <h2>Meeting with {isProf ? `${meeting.instructor.firstName} ${meeting.instructor.lastName}` : `${meeting.student.firstName} ${meeting.student.lastName}`}</h2>
            {dateFormat(new Date(meeting.startTime), 'mmmm dS, yyyy, h:MM TT')}
            <Button
              className="postpone-meeting"
              variant="warning"
              onClick={()=>postponeMeeting}
            >
              I&apos;m Running Late
            </Button>
            <Button
              className="cancel-meeting"
              variant="danger"
              onClick={()=>{
               if (window.confirm('Are you sure you want to cancel this meeting?')) {
               return( //Delete meeting and return to dashboard
                    <Mutation mutation={DELETE_MEETING} variables={{meetingId}}
                    onCompleted={ () => {
                        <Redirect to='/'/>;
                    }}
                    />
                );
                }
             }}
            >
              Cancel Meeting
            </Button>
          </>
        )}
      </div>
    );
  }
}

export default MeetingInfo;
