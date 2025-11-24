import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from './Header';
import EditCampusView from '../views/EditCampusView';
import { fetchCampusThunk, editCampusThunk } from '../../store/thunks';

class EditCampusContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { form: {}, errors: {} };
  }

  async componentDidMount() {
    await this.props.fetchCampus(this.props.match.params.id);
    this.setState({ form: { ...this.props.campus } });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.campus !== this.props.campus) {
      this.setState({ form: { ...this.props.campus } });
    }
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((s) => ({ form: { ...s.form, [name]: value } }), () => {
      const errors = { ...this.state.errors };
      if (name === 'name') {
        if (!this.state.form.name || !this.state.form.name.trim()) errors.name = 'Campus name is required.';
        else delete errors.name;
      }
      if (name === 'address') {
        if (!this.state.form.address || !this.state.form.address.trim()) errors.address = 'Address is required.';
        else delete errors.address;
      }
      this.setState({ errors });
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!this.state.form.name || !this.state.form.name.trim()) errors.name = 'Campus name is required.';
    if (!this.state.form.address || !this.state.form.address.trim()) errors.address = 'Address is required.';
    if (Object.keys(errors).length) return this.setState({ errors });
    const updated = await this.props.editCampus(this.state.form);
    if (updated && updated.id) {
      this.props.history.push(`/campus/${updated.id}`);
    }
  };

  handleCancel = () => {
    this.props.history.goBack();
  };

  render() {
    return (
      <div>
        <Header />
        <EditCampusView
          form={this.state.form}
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
          onCancel={this.handleCancel}
          errors={this.state.errors}
        />
      </div>
    );
  }
}

const mapState = (state) => ({ campus: state.campus });
const mapDispatch = (dispatch) => ({
  fetchCampus: (id) => dispatch(fetchCampusThunk(id)),
  editCampus: (campus) => dispatch(editCampusThunk(campus)),
});

export default connect(mapState, mapDispatch)(EditCampusContainer);
