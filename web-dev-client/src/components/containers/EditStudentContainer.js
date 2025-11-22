import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from './Header';
import EditStudentView from '../views/EditStudentView';
import { fetchStudentThunk, editStudentThunk, fetchAllCampusesThunk } from '../../store/thunks';

class EditStudentContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { form: {}, errors: {} };
  }

  async componentDidMount() {
    await this.props.fetchStudent(this.props.match.params.id);
    await this.props.fetchAllCampuses();
    this.setState({ form: { ...this.props.student, campusId: this.props.student.campusId || (this.props.campuses[0] && this.props.campuses[0].id) } });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.student !== this.props.student) {
      this.setState({ form: { ...this.props.student, campusId: this.props.student.campusId } });
    }
    if (prevProps.campuses !== this.props.campuses && !this.state.form.campusId && this.props.campuses.length) {
      this.setState((s) => ({ form: { ...s.form, campusId: this.props.campuses[0].id } }));
    }
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((s) => ({ form: { ...s.form, [name]: value } }));
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    // client-side validation similar to NewStudentContainer
    const payload = { ...this.state.form };
    const errors = {};
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (payload.campusId) {
      const email = (payload.email || '').trim();
      if (!email) errors.email = 'Email is required to enroll to a campus.';
      else if (!emailRegex.test(email)) errors.email = 'Please provide a valid email address.';
      else payload.email = email;
    } else if (payload.email) {
      if (!emailRegex.test(payload.email)) errors.email = 'Please provide a valid email address.';
    }
    if (payload.gpa) {
      const g = parseFloat(payload.gpa);
      if (Number.isNaN(g) || g < 0 || g > 4) errors.gpa = 'GPA must be a number between 0.0 and 4.0';
      else payload.gpa = g;
    }
    if (Object.keys(errors).length) {
      this.setState({ errors });
      return;
    }
    const updated = await this.props.editStudent(payload);
    if (updated && updated.id) {
      this.props.history.push(`/student/${updated.id}`);
    } else if (!updated) {
      this.setState({ errors: { form: 'Failed to update student' } });
    }
  };

  handleCancel = () => {
    this.props.history.goBack();
  };

  render() {
    return (
      <div>
        <Header />
        <EditStudentView
          form={this.state.form}
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
          onCancel={this.handleCancel}
          errors={this.state.errors}
          campuses={this.props.campuses}
        />
      </div>
    );
  }
}

const mapState = (state) => ({
  student: state.student,
  campuses: state.allCampuses,
});

const mapDispatch = (dispatch) => ({
  fetchStudent: (id) => dispatch(fetchStudentThunk(id)),
  editStudent: (s) => dispatch(editStudentThunk(s)),
  fetchAllCampuses: () => dispatch(fetchAllCampusesThunk()),
});

export default connect(mapState, mapDispatch)(EditStudentContainer);
