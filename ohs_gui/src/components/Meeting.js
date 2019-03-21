import React, { Component } from 'react';
import MeetingNote from './meeting/MeetingNote';
import MeetingComment from './meeting/MeetingComment';
import MeetingInfo from './meeting/MeetingInfo';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';
import { Button, FormGroup, FormControl, Modal } from 'react-bootstrap';

import "./Meeting.css"

class Meeting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meeting: null,
      notes: [],
      comments: [],
      show: false,
      showNotes: this.props.user && this.props.user.role === "PROFESSOR"
    }

    this.getMeeting = this.getMeeting.bind(this);
    this.getNotes = this.getNotes.bind(this);
    this.getComments = this.getComments.bind(this);
    this.createComment = this.createComment.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.addNote = this.addNote.bind(this);
    this.removeNote = this.removeNote.bind(this);
    this.cancelMeeting = this.cancelMeeting.bind(this);
    this.postponeMeeting = this.postponeMeeting.bind(this);
  }

  componentDidMount() {
    const isProf = this.props.user && this.props.user.role === "PROFESSOR";

    this.getMeeting();
    this.getComments();
    if (isProf) {
      this.getNotes();
    }
    setTimeout(this.scrollToBottom, 0);
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  getMeeting() {
    // TODO: dummy json
    // fetch meeting using this.props.match.params.id
    const meeting = {
      time: "2019-11-17T17:15:00.000Z",
      room: "BA1234",
      courseCode: "CSC302H1S",
      student: "Pika Chu",
      professor: "Alec Gibson",
      id: 11
    }
    this.setState({ meeting: meeting })
  }

  getNotes() {
    // TODO: dummy json
    const notes = [
      {
        time: "2019-11-17T17:15:00.000Z",
        contents: "I choose you, Pikachu"
      },
      {
        time: "2019-11-17T17:18:00.000Z",
        contents: "haha this student is a fat electric mouse"
      }
    ]
    this.setState({ notes: notes })
  }

  getComments() {
    // TODO: dummy json
    const comments = [
      {
        time: "2019-11-17T17:15:00.000Z",
        contents: "Hello, Pikachu",
        author: "Alec Gibson"
      },
      {
        time: "2019-11-17T17:16:00.000Z",
        contents: "PIKA",
        author: "Pika Chu"
      },
      {
        time: "2019-11-17T17:16:30.000Z",
        contents: "Is that all you can say?",
        author: "Alec Gibson"
      },
      {
        time: "2019-11-17T17:18:00.000Z",
        contents: "PIKA",
        author: "Pika Chu"
      },
      {
        time: "2019-11-17T17:20:00.000Z",
        contents: "Well this is gonna be an eventful meeting...",
        author: "Alec Gibson"
      }
    ]
    this.setState({ comments: comments })
  }

  createComment() {
    // TODO: add comment to backend
    if (ReactDOM.findDOMNode(this.refs.commentInput).value === "") {
      return;
    }
    const comment = {
      time: new Date().toISOString(),
      contents: ReactDOM.findDOMNode(this.refs.commentInput).value,
      author: this.props.user.first_name + this.props.user.last_name
    }
    const comments = this.state.comments;
    comments.push(comment)
    this.setState({ comments: comments })
    ReactDOM.findDOMNode(this.refs.commentInput).value = "";
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  scrollToBottom() {
    this.bottom.scrollIntoView({ behavior: 'smooth' });
  }

  addNote() {
    // TODO: add note to backend
    const note = {
      time: new Date().toISOString(),
      contents: ReactDOM.findDOMNode(this.refs.noteInput).value
    }
    const notes = this.state.notes;
    notes.push(note)
    this.setState({ notes: notes })
    ReactDOM.findDOMNode(this.refs.noteInput).value = "";
    this.setState({ show: false });
  }

  removeNote(time) {
    return () => {
      if (window.confirm("Are you sure you want to delete this note?")) {
        // TODO: remove note from backend
        let notes = this.state.notes;
        notes = notes.filter(n => n.time !== time);
        this.setState({ notes: notes })
      }
    }
  }

  cancelMeeting() {
    // TODO: remove meeting from backend
    if (window.confirm("Are you sure you want to cancel this meeting?")) {
      this.props.history.push("/")
    }
  }

  postponeMeeting() {
    // TODO: delay meeting in backend
    if (window.confirm("Are you sure you want to postpone this meeting?")) {
      const meeting = this.state.meeting;
      const time = new Date(meeting.time);
      time.setTime(time.getTime() + 1000 * 60 * 60);
      meeting.time = time.toISOString();
      this.setState({meeting: meeting})
    }
  }

  render() {
    const isProf = this.props.user && this.props.user.role === "PROFESSOR";
    const { meeting, notes, comments, show, showNotes } = this.state;
    const dateFormat = require("dateformat")

    return (
      <>
        <div className={showNotes ? "meeting-main" : "meeting-main-full"}>
          <MeetingInfo meeting={meeting} isProf={isProf} cancelMeeting={this.cancelMeeting} postponeMeeting={this.postponeMeeting} />
          <div className="meeting-comments">
            <h2>Comments</h2>
            {comments.map(c => (
              <MeetingComment key={c.time + c.author} comment={c} user={this.props.user} />
            ))}
            <div ref={bottom => { this.bottom = bottom; }} />
          </div>
          <div className="new-comment">
            <FormGroup role="form">
              <FormControl ref="commentInput"
                placeholder="New comment"
                aria-label="Comment"
                aria-describedby="basic-addon2"
              />
              <Button variant="primary" onClick={this.createComment}>Submit</Button>
            </FormGroup>
          </div>
        </div>
        {isProf && showNotes &&
          <div className="meeting-notes">
            <h2>Notes</h2>
            {notes.map(n => (
              <MeetingNote key={n.time} note={n} removeNote={this.removeNote} />
            ))}
            <Button variant="primary" onClick={this.handleShow}>
              Add Note
            </Button>
          </div>
        }
        <Modal show={show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Note</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <textarea className="note-input" ref="noteInput"></textarea>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.addNote}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default withRouter(Meeting);
