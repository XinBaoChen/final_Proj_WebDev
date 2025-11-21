import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from './Header';
import EditStudentView from '../views/EditStudentView';
import { fetchStudentThunk, editStudentThunk, fetchAllCampusesThunk } from '../../store/thunks';

class EditStudentContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { form: {} };
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
    const updated = await this.props.editStudent(this.state.form);
    if (updated && updated.id) {
      this.props.history.push(`/student/${updated.id}`);
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
