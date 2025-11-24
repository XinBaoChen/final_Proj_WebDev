/*==================================================
NewStudentContainer.js

The Container component is responsible for stateful logic and data fetching, and
passes data (if any) as props to the corresponding View component.
If needed, it also defines the component's "connect" function.
================================================== */
import Header from './Header';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import NewStudentView from '../views/NewStudentView';
import { addStudentThunk, fetchAllCampusesThunk } from '../../store/thunks';

class NewStudentContainer extends Component {
  // Initialize state
  constructor(props){
    super(props);
    this.state = {
      firstname: "", 
      lastname: "", 
      campusId: null, 
      email: '',
      gpa: '',
      redirect: false, 
      redirectId: null,
      errors: {}
    };
  }

  // Capture input data when it is entered
  handleChange = event => {
    const { name, value } = event.target;
    this.setState((s) => ({ ...s, [name]: value }), () => {
      // run field-level validation
      const errors = { ...this.state.errors };
      const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
      if (name === 'email') {
        const v = (value || '').trim();
        if (v && !emailRegex.test(v)) errors.email = 'Please provide a valid email address.';
        else delete errors.email;
      }
      if (name === 'gpa') {
        if (value !== '') {
          const g = parseFloat(value);
          if (Number.isNaN(g) || g < 0 || g > 4) errors.gpa = 'GPA must be a number between 0.0 and 4.0';
          else delete errors.gpa;
        } else delete errors.gpa;
      }
      if (name === 'campusId') {
        // if campus selected, ensure email exists and valid
        if (value && value !== '') {
          const e = (this.state.email || '').trim();
          if (!e) errors.email = 'Email is required to enroll to a campus.';
          else if (!emailRegex.test(e)) errors.email = 'Please provide a valid email address.';
          else delete errors.email;
        } else {
          // no campus selected; email optional but if present validate
          const e = (this.state.email || '').trim();
          if (e && !emailRegex.test(e)) errors.email = 'Please provide a valid email address.';
          else delete errors.email;
        }
      }
      if (name === 'firstname') {
        if (!value || !value.trim()) errors.firstname = 'First name is required.';
        else delete errors.firstname;
      }
      if (name === 'lastname') {
        if (!value || !value.trim()) errors.lastname = 'Last name is required.';
        else delete errors.lastname;
      }
      this.setState({ errors });
    });
  }

  // Take action after user click the submit button
  handleSubmit = async event => {
    event.preventDefault();  // Prevent browser reload/refresh after submit.

    let student = {
        firstname: this.state.firstname,
        lastname: this.state.lastname
    };

    if (this.state.email) student.email = this.state.email;
    if (this.state.gpa) student.gpa = parseFloat(this.state.gpa);

    // Normalize campusId: send number only when provided
    if (this.state.campusId && this.state.campusId !== '') {
      const parsed = parseInt(this.state.campusId);
      if (!Number.isNaN(parsed)) student.campusId = parsed;
    }

    // Validate inputs and collect errors
    const errors = {};
    if (!this.state.firstname || !this.state.firstname.trim()) errors.firstname = 'First name is required.';
    if (!this.state.lastname || !this.state.lastname.trim()) errors.lastname = 'Last name is required.';
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (student.campusId) {
      const email = (this.state.email || '').trim();
      if (!email) errors.email = 'Email is required to enroll to a campus.';
      else if (!emailRegex.test(email)) errors.email = 'Please provide a valid email address.';
      else student.email = email;
    } else if (this.state.email) {
      const email = this.state.email.trim();
      if (!emailRegex.test(email)) errors.email = 'Please provide a valid email address.';
      else student.email = email;
    }
    if (this.state.gpa) {
      const g = parseFloat(this.state.gpa);
      if (Number.isNaN(g) || g < 0 || g > 4) errors.gpa = 'GPA must be a number between 0.0 and 4.0';
      else student.gpa = g;
    }

    if (Object.keys(errors).length) {
      this.setState({ errors });
      return;
    }

    // Add new student in back-end database
    let newStudent = await this.props.addStudent(student);

    // If server returned the created student, redirect to its page
    if (newStudent && newStudent.id) {
      this.setState({
        firstname: "", 
        lastname: "", 
        campusId: null, 
        redirect: true, 
        redirectId: newStudent.id,
        errors: {}
      });
    } else {
      // Show a simple error to the user (server likely returned validation error)
      this.setState({ errors: { form: 'Failed to create student. Please check input and try again.' } });
    }
  }

  // Unmount when the component is being removed from the DOM:
  componentWillUnmount() {
      this.setState({redirect: false, redirectId: null});
  }

  componentDidMount() {
    // Fetch campuses for the campus dropdown
    if (this.props.fetchAllCampuses) this.props.fetchAllCampuses();

    // If a campusId was provided in query params (e.g. /newstudent?campusId=2), preselect it
    try {
      const search = this.props.location ? this.props.location.search : '';
      const params = new URLSearchParams(search);
      const campusId = params.get('campusId');
      if (campusId) {
        this.setState({ campusId: String(campusId) });
      }
    } catch (e) {
      // ignore if URLSearchParams is not available or parsing fails
    }
  }

  // Render new student input form
  render() {
    // Redirect to new student's page after submit
    if(this.state.redirect) {
      return (<Redirect to={`/student/${this.state.redirectId}`}/>)
    }

    // Display the input form via the corresponding View component
    return (
      <div>
        <Header />
        <NewStudentView 
          handleChange = {this.handleChange} 
          handleSubmit={this.handleSubmit}
          campuses={this.props.campuses}
          firstname={this.state.firstname}
          lastname={this.state.lastname}
          campusId={this.state.campusId}
          email={this.state.email}
          gpa={this.state.gpa}
          errors={this.state.errors}
        />
      </div>          
    );
  }
}

// The following input argument is passed to the "connect" function used by "NewStudentContainer" component to connect to Redux Store.
// The "mapDispatch" argument is used to dispatch Action (Redux Thunk) to Redux Store.
// The "mapDispatch" calls the specific Thunk to dispatch its action. The "dispatch" is a function of Redux Store.
const mapState = (state) => ({
  campuses: state.allCampuses || []
});

const mapDispatch = (dispatch) => {
  return({
    addStudent: (student) => dispatch(addStudentThunk(student)),
    fetchAllCampuses: () => dispatch(fetchAllCampusesThunk())
  })
}

// Export store-connected container by default
// NewStudentContainer uses "connect" function to connect to Redux Store and to read values from the Store 
// (and re-read the values when the Store State updates).
export default connect(mapState, mapDispatch)(NewStudentContainer);