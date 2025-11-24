import Header from './Header';
import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchAllStudentsThunk, fetchAllCampusesThunk, editStudentThunk } from '../../store/thunks';
import EnrollStudentView from '../views/EnrollStudentView';
import { useToast } from '../ui/ToastProvider';
import { useConfirm } from '../ui/ConfirmDialog';

const EnrollStudentContainer = ({ match, history, students = [], campuses = [], fetchAllStudents, fetchAllCampuses, editStudent }) => {
  const toast = useToast();
  const confirm = useConfirm();

  useEffect(() => {
    if (fetchAllStudents) fetchAllStudents();
    if (fetchAllCampuses) fetchAllCampuses();
  }, [fetchAllStudents, fetchAllCampuses]);

  const campusId = match && match.params ? match.params.id : null;

  const campusName = (campuses.find(c => String(c.id) === String(campusId)) || {}).name;

  // students available to enroll: those with no campusId
  const available = useMemo(() => students.filter(s => s.campusId === null || s.campusId === undefined), [students]);

  const handleEnroll = async (studentId) => {
    const ok = await confirm.confirm({ title: 'Enroll student', message: 'Enroll this student to the campus?', confirmText: 'Enroll', cancelText: 'Cancel', confirmClass: 'btn-primary' });
    if (!ok) return;
    // find student in state to include required fields (backend requires email when enrolling)
    const student = (students || []).find(s => String(s.id) === String(studentId));
    if (!student) {
      toast.push('Student not found');
      return;
    }
    if (!student.email || !String(student.email).trim()) {
      // backend requires a valid email to enroll; direct user to edit student
      toast.push('Student needs an email to enroll. Opening edit page.');
      history.push(`/student/${studentId}/edit`);
      return;
    }

    try {
      // include email when updating to satisfy server validation
      await editStudent({ id: studentId, campusId: parseInt(campusId), email: student.email });
      toast.push('Student enrolled');
      history.push(`/campus/${campusId}`);
    } catch (err) {
      console.error(err);
      toast.push('Failed to enroll student');
    }
  };

  return (
    <div>
      <Header />
      <EnrollStudentView campusName={campusName} campusId={campusId} students={available} onEnroll={handleEnroll} />
    </div>
  );
};

const mapState = (state) => ({
  students: state.allStudents || [],
  campuses: state.allCampuses || []
});

const mapDispatch = (dispatch) => ({
  fetchAllStudents: () => dispatch(fetchAllStudentsThunk()),
  fetchAllCampuses: () => dispatch(fetchAllCampusesThunk()),
  editStudent: (student) => dispatch(editStudentThunk(student))
});

EnrollStudentContainer.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
  students: PropTypes.array,
  campuses: PropTypes.array,
  fetchAllStudents: PropTypes.func,
  fetchAllCampuses: PropTypes.func,
  editStudent: PropTypes.func
};

export default connect(mapState, mapDispatch)(EnrollStudentContainer);
