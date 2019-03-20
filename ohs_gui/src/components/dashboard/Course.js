import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class Course extends Component {
  render() {
    return (
      <Link to={`/course/${this.props.course.id}`}>
        <div className="course card-element">
          {this.props.course.name}
        </div>
      </Link>
    );
  }
}

export default Course;
