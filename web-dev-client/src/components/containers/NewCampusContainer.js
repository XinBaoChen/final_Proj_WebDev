import Header from './Header';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import NewCampusView from '../views/NewCampusView';
import { addCampusThunk } from '../../store/thunks';

class NewCampusContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      address: '',
      description: '',
      errors: {},
      redirect: false,
      redirectId: null
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((s) => ({ ...s, [name]: value }), () => {
      const errors = { ...this.state.errors };
      if (name === 'name') {
        if (!this.state.name || !this.state.name.trim()) errors.name = 'Campus name is required.';
        else delete errors.name;
      }
      if (name === 'address') {
        if (!this.state.address || !this.state.address.trim()) errors.address = 'Address is required.';
        else delete errors.address;
      }
      this.setState({ errors });
    });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const campus = {
      name: this.state.name,
      address: this.state.address,
      description: this.state.description
    };
    const errors = {};
    if (!campus.name || !campus.name.trim()) errors.name = 'Campus name is required.';
    if (!campus.address || !campus.address.trim()) errors.address = 'Address is required.';
    if (Object.keys(errors).length) return this.setState({ errors });
    const created = await this.props.addCampus(campus);
    if (created && created.id) {
      this.setState({ redirect: true, redirectId: created.id });
    } else {
      alert('Failed to create campus');
    }
  }

  render() {
    if (this.state.redirect) return <Redirect to={`/campus/${this.state.redirectId}`} />;
    return (
      <div>
        <Header />
        <NewCampusView
          name={this.state.name}
          address={this.state.address}
          description={this.state.description}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
          errors={this.state.errors}
        />
      </div>
    );
  }
}

const mapDispatch = (dispatch) => ({
  addCampus: (campus) => dispatch(addCampusThunk(campus)),
});

export default connect(null, mapDispatch)(NewCampusContainer);
