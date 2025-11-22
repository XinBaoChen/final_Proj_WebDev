/*==================================================
AllStudentsContainer.js

The Container component is responsible for stateful logic and data fetching, and
passes data (if any) as props to the corresponding View component.
If needed, it also defines the component's "connect" function.
================================================== */
import Header from './Header';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import { 
  fetchAllStudentsThunk,
  deleteStudentThunk
} from '../../store/thunks';

import AllStudentsView from '../views/AllStudentsView';
import { useToast } from '../ui/ToastProvider';
import { useConfirm } from '../ui/ConfirmDialog';

const AllStudentsContainer = ({ allStudents, fetchAllStudents, deleteStudent }) => {
  const toast = useToast();
  const confirm = useConfirm();

  useEffect(() => {
    fetchAllStudents();
  }, [fetchAllStudents]);

  const handleDelete = async (id) => {
    const ok = await confirm.confirm({ title: 'Delete student', message: 'Delete this student? This action cannot be undone.' });
    if (!ok) return;
    try {
      await deleteStudent(id);
      toast.push('Student deleted');
    } catch (err) {
      toast.push('Failed to delete student');
    }
  };

  return (
    <div>
      <Header />
      <AllStudentsView 
        students={allStudents}
        deleteStudent={handleDelete}   
      />
    </div>
  );
};

// The following 2 input arguments are passed to the "connect" function used by "AllStudentsContainer" component to connect to Redux Store.
// 1. The "mapState" argument specifies the data from Redux Store that the component needs.
// The "mapState" is called when the Store State changes, and it returns a data object of "allStudents".
const mapState = (state) => {
  return {
    allStudents: state.allStudents,  // Get the State object from Reducer "allStudents"
  };
};
// 2. The "mapDispatch" argument is used to dispatch Action (Redux Thunk) to Redux Store.
// The "mapDispatch" calls the specific Thunk to dispatch its action. The "dispatch" is a function of Redux Store.
const mapDispatch = (dispatch) => {
  return {
    fetchAllStudents: () => dispatch(fetchAllStudentsThunk()),
    deleteStudent: (studentId) => dispatch(deleteStudentThunk(studentId)),
  };
};

// Export store-connected container by default
// AllStudentsContainer uses "connect" function to connect to Redux Store and to read values from the Store 
// (and re-read the values when the Store State updates).
export default withRouter(connect(mapState, mapDispatch)(AllStudentsContainer));