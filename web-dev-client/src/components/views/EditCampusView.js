import React from 'react';
import PropTypes from 'prop-types';

const EditCampusView = ({ form, onChange, onSubmit, onCancel }) => {
  return (
    <div>
      <h1>Edit Campus</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label>Name:</label>
          <input name="name" value={form.name || ''} onChange={onChange} required />
        </div>
        <div>
          <label>Address:</label>
          <input name="address" value={form.address || ''} onChange={onChange} required />
        </div>
        <div>
          <label>Description:</label>
          <input name="description" value={form.description || ''} onChange={onChange} />
        </div>
        <div>
          <label>Image URL:</label>
          <input name="imageUrl" value={form.imageUrl || ''} onChange={onChange} />
        </div>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

EditCampusView.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default EditCampusView;
