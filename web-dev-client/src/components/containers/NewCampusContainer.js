import Header from './Header';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import NewCampusView from '../views/NewCampusView';
import { addCampusThunk, fetchAllCampusesThunk } from '../../store/thunks';

class NewCampusContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      address: '',
      description: '',
      redirect: false,
      redirectId: null
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const campus = {
      name: this.state.name,
      address: this.state.address,
      description: this.state.description
    };
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
        />
      </div>
    );
  }
}

const mapDispatch = (dispatch) => ({
  addCampus: (campus) => dispatch(addCampusThunk(campus)),
});

export default connect(null, mapDispatch)(NewCampusContainer);
