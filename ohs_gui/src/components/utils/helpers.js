import { roles } from './constants';

function userIsProf(user) {
  return user && user.role === roles.PROFESSOR;
}

function getSemesterCode(sem) {
  // assumption: summer courses are assumed to be full session
  switch (sem) {
    case 'SUMMER':
    case 'FULL_YEAR':
      return 'Y';
    case 'WINTER':
      return 'S';
    case 'FALL':
      return 'F';
    default:
      return '';
  }
}

function getFormattedSectionName(section) {
  return `${section.course.courseCode}H1${getSemesterCode(
    section.semester
  )} - ${section.sectionCode} - ${section.year}`;
}

function numberToDayOfWeek(dayNumber) {
  switch(dayNumber) {
    case 0:
      return "SUNDAY";
    case 1:
      return "MONDAY";
    case 2:
      return "TUESDAY";
    case 3:
      return "WEDNESDAY";
    case 4:
      return "THURSDAY";
    case 5:
      return "FRIDAY";
    case 6:
      return "SATRUDAY";
    default:
      return '';
  }
}

export { userIsProf, getSemesterCode, getFormattedSectionName, numberToDayOfWeek };
