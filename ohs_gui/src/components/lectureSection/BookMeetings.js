import React, { Component } from 'react';
import * as Datetime from 'react-datetime';
import * as moment from 'moment';
import OHContainer from '../officeHours/OHContainer';
import gql from 'graphql-tag';
import {GET_MEETINGS_BY_OFFICE_HOUR_AND_TIME, GET_OFFICE_HOURS_BY_SECTION_AND_WEEKDAY} from '../utils/queries';
import { toast } from 'react-toastify';
import { Query, Mutation } from 'react-apollo';
import {numberToDayOfWeek} from '../utils/helpers';

const CREATE_MEETING = gql`
mutation createMeeting($index: Int!, $instructor: String!, $OHSID: UUID!, $startTime: Int!) {
 createMeeting(index: $index, instructor: $instructor, officeHourId: $OHSID, startTime: $startTime) {
   meetingId
   officeHourId
   index
   instructor {
     firstName
     lastName
     userName
   }
   student {
     firstName
     lastName
     studentNumber
   }
   notes {
     noteId
     meetingId
     timeStamp
     contentText
   }
   comments {
     commentId
     meetingId
     author {
       ... on Student {
         studentNumber
         firstName
         lastName
       }
       ... on Instructor {
         userName
         firstName
         lastName
       }
     }
     timeStamp
     contentText
   }
   startTime
 }
}
`;

class BookMeetings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: '',
      newMeetingIndex: null,
      newMeetingInstructor: null,
      newMeetingHourId: null,
      newMeetingStartTime: null
    };

    this.dateChange = this.dateChange.bind(this);
    this.toggleBooking = this.toggleBooking.bind(this);
  }

  dateChange(date) {
    this.setState({ date });
  }

  toggleBooking(instructor, officeHourId, startTime) {
    return function(index, booked) {
      if (!booked) {
        if (window.confirm(
          'Are you sure you want to book a meeting in this slot?'
        )) {
          this.setState({
            newMeetingIndex: index,
            newMeetingInstructor: instructor.userName,
            newMeetingHourId: officeHourId,
            newMeetingStartTime: startTime
          });
        }
      } 
    }.bind(this);
  }

  render() {
    const { date, newMeetingIndex,
            newMeetingInstructor,
            newMeetingHourId,
            newMeetingStartTime } = this.state;
    const {section} = this.props;
    const variables = date ? {
      "sectionInput": {
        "course": {"courseCode": section["course"]["courseCode"]},
        "year": section["year"],
        "semester": section["semester"],
        "sectionCode": section["sectionCode"],
        "numStudents": section["numStudents"],
        "taughtBy": section["taughtBy"]["userName"]
      },
      "weekday": numberToDayOfWeek(date.isoWeekday() % 7)
    } : null;
    return (
        
      <Mutation
        mutation={CREATE_MEETING}
        variables={{
            "index": newMeetingIndex,
            "instructor": newMeetingInstructor,
            "OHSID": newMeetingHourId,
            "startTime": newMeetingStartTime
        }}
        update={(cache, response) => {
          const addr = { query: GET_MEETINGS_BY_OFFICE_HOUR_AND_TIME, variables: {
              "officeHourId": newMeetingHourId,
              "startTime": newMeetingStartTime,
              "endTime": newMeetingStartTime + (1000 * 60 * 60),
              "index": newMeetingIndex
          } };
          const data = cache.readQuery(addr);
          data.meetings.push({
              "__typename": response.data.createMeeting.__typename,
              "index": response.data.createMeeting.index,
              "meetingId": response.data.createMeeting.meetingId
          })
          cache.writeQuery({...addr, data});
        }}
        onCompleted={() => {
          toast('Created Meeting', {
            type: toast.TYPE.SUCCESS
          });
        }}
        onError={() => {
          toast('Unknown Error - Could not create meeting', {
            type: toast.TYPE.ERROR
          });
        }}
      >
        {(mut, { loading }) => {
          if(newMeetingIndex !== null){
            this.setState({             
            newMeetingIndex: null,
            newMeetingInstructor: null,
            newMeetingHourId: null,
            newMeetingStartTime: null
                
            });
            mut();
          }
          return (
        
      <div className="section-agenda">
        Date:{' '}
        <Datetime
          inputProps={{ placeholder: 'Select a date' }}
          dateFormat="MM-DD-YYYY"
          timeFormat={false}
          onChange={this.dateChange}
        />
        <br />
        <br />
        {date !== '' && date.isoWeekday() <= 5 && (
            <>
          <h2>Book a meeting on {date.format('MMMM Do')}</h2>
        <div className="office-hours">
          <Query
            query={GET_OFFICE_HOURS_BY_SECTION_AND_WEEKDAY}
            variables={variables}
            onError={() => {
              toast('Unknown Error - Could not get office hours', {
                type: toast.TYPE.ERROR
              });
            }}
          >
            {({ data }) => {
              const { officehours } = data;
              if (officehours) {
                  function compare(a, b){
                    if (a.startingHour > b.startingHour) return 1;
                    if (b.startingHour > a.startingHour) return -1;
                  
                    return 0;
                  }
                officehours.sort(compare)
                return (
                    <>
                    {
                    officehours.map(oh => {
                        return (
                    <div className="office-hour" key={oh.startingHour}>
                      <p className="start-time">{oh.startingHour + ":00"}</p>
                      <div className="slots">
                        <Query
                          query={GET_MEETINGS_BY_OFFICE_HOUR_AND_TIME}
                          variables={{
                            "officeHourId": oh.officeHourId,
                            "startTime": date.unix() + (oh.startingHour * 1000 * 60 * 60),
                            "endTime": date.unix() + (oh.startingHour * 1000 * 60 * 60) + (1000 * 60 * 60)
                          }}
                          onError={() => {
                            toast('Unknown Error - Could not get meetings', {
                              type: toast.TYPE.ERROR
                            });
                          }}
                        >
                        {({ data }) => { 
                            const {meetings} = data
                            if(meetings !== undefined) {
                            const bookedSlots = new Array(6);
                            for (let i = 0; i < bookedSlots.length; i += 1) {
                              bookedSlots[i] = false;
                            }
                            meetings.forEach((elem, i) => {
                              bookedSlots[elem.index] = true;
                            });
                            return (
                              <OHContainer
                                bookedSlots={bookedSlots}
                                toggleBooking={this.toggleBooking(section.taughtBy, oh.officeHourId, date.unix() + (oh.startingHour * 1000 * 60 * 60))}
                                showBooked
                              />
                            );
                            } else {
                                return '';
                            }
                        }}
                        </Query>
                      </div>
                    </div>
                  )})
                    }
                  </>
                );
              }
              return null;
              }}
            </Query>
        </div>
        </>
        )}
      </div>
    )}}
      </Mutation>
    );
  }
}

export default BookMeetings;
