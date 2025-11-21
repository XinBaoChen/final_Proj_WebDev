import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from './Header';
import EditCampusView from '../views/EditCampusView';
import { fetchCampusThunk, editCampusThunk } from '../../store/thunks';

class EditCampusContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { form: {} };
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
    this.setState((s) => ({ form: { ...s.form, [name]: value } }));
  };

  handleSubmit = async (e) => {
    e.preventDefault();
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
