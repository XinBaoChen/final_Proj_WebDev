/*==================================================
HomePageContainer.js

The Container component is responsible for stateful logic and data fetching, and
passes data (if any) as props to the corresponding View component.
If needed, it also defines the component's "connect" function.
================================================== */
import Header from './Header';
import React, { Component } from 'react';
import HomePageView from '../views/HomePageView';
import { connect } from 'react-redux';
import { fetchAllCampusesThunk, fetchAllStudentsThunk } from '../../store/thunks';

class HomePageContainer extends Component {
  componentDidMount() {
    this.props.fetchAllCampuses();
    this.props.fetchAllStudents();
  }

  render() {
    return (
      <div>
        <Header />
        <HomePageView campusCount={this.props.campuses.length} studentCount={this.props.students.length} />
      </div>
    );
  }
}

const mapState = (state) => ({
  campuses: state.allCampuses || [],
  students: state.allStudents || []
});

const mapDispatch = (dispatch) => ({
  fetchAllCampuses: () => dispatch(fetchAllCampusesThunk()),
  fetchAllStudents: () => dispatch(fetchAllStudentsThunk())
});

export default connect(mapState, mapDispatch)(HomePageContainer);