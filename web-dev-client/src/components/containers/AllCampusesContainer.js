/*==================================================
/src/components/containers\AllCampusesContainer.js

The Container component is responsible for stateful logic and data fetching, and
passes data (if any) as props to the corresponding View component.
If needed, it also defines the component's "connect" function.
================================================== */
import Header from './Header';
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { fetchAllCampusesThunk, deleteCampusThunk } from "../../store/thunks";
import { AllCampusesView } from "../views";
import { useToast } from '../ui/ToastProvider';
import { useConfirm } from '../ui/ConfirmDialog';

const AllCampusesContainer = ({ allCampuses, fetchAllCampuses, deleteCampus }) => {
  const toast = useToast();
  const confirm = useConfirm();

  useEffect(() => {
    fetchAllCampuses();
  }, [fetchAllCampuses]);

  const handleDelete = async (id) => {
    const ok = await confirm.confirm({ title: 'Delete campus', message: 'Delete this campus? This action cannot be undone.' });
    if (!ok) return;
    try {
      await deleteCampus(id);
      toast.push('Campus deleted');
    } catch (err) {
      toast.push('Failed to delete campus');
    }
  };

  return (
    <div>
      <Header />
      <AllCampusesView
        allCampuses={allCampuses}
        deleteCampus={handleDelete}
      />
    </div>
  );
};

// 1. The "mapState" argument specifies the data from Redux Store that the component needs.
// The "mapState" is called when the Store State changes, and it returns a data object of "allCampuses".
// The following 2 input arguments are passed to the "connect" function used by "AllCampusesContainer" component to connect to Redux Store.
const mapState = (state) => {
  return {
    allCampuses: state.allCampuses,  // Get the State object from Reducer "allCampuses"
  };
};  
// 2. The "mapDispatch" argument is used to dispatch Action (Redux Thunk) to Redux Store.
// The "mapDispatch" calls the specific Thunk to dispatch its action. The "dispatch" is a function of Redux Store.
const mapDispatch = (dispatch) => {
  return {
    fetchAllCampuses: () => dispatch(fetchAllCampusesThunk()),
    deleteCampus: (campusId) => dispatch(deleteCampusThunk(campusId)),
  };
};

// Type check props;
AllCampusesContainer.propTypes = {
  allCampuses: PropTypes.array.isRequired,
  fetchAllCampuses: PropTypes.func.isRequired,
  deleteCampus: PropTypes.func.isRequired,
};

// Export store-connected container by default
// AllCampusesContainer uses "connect" function to connect to Redux Store and to read values from the Store 
// (and re-read the values when the Store State updates).
export default connect(mapState, mapDispatch)(AllCampusesContainer);