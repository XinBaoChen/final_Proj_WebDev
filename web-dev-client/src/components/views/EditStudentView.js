import React from 'react';
import PropTypes from 'prop-types';

const EditStudentView = ({ form, onChange, onSubmit, onCancel, campuses, errors = {} }) => {
  return (
    <div>
      <h1>Edit Student</h1>
      <form onSubmit={onSubmit}>
        {errors.form && <div style={{color:'red'}}>{errors.form}</div>}
        <div>
          <label>First name:</label>
          <input name="firstname" value={form.firstname || ''} onChange={onChange} required />
        </div>
        <div>
          <label>Last name:</label>
          <input name="lastname" value={form.lastname || ''} onChange={onChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input name="email" value={form.email || ''} onChange={onChange} />
        </div>
        <div>
          <label>Image URL:</label>
          <input name="imageUrl" value={form.imageUrl || ''} onChange={onChange} />
        </div>
        <div>
          <label>GPA:</label>
          <input name="gpa" type="number" min="0" max="4" step="0.1" value={form.gpa || ''} onChange={onChange} />
          {errors.gpa && <div style={{color:'red'}}>{errors.gpa}</div>}
        </div>
        <div>
          <label>Campus:</label>
          <select name="campusId" value={form.campusId || ''} onChange={onChange}>
            <option value="">-- Select campus --</option>
            {campuses.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.email && <div style={{color:'red'}}>{errors.email}</div>}
        </div>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

EditStudentView.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  campuses: PropTypes.array.isRequired,
};

export default EditStudentView;
