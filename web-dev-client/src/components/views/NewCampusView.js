import React from 'react';

const NewCampusView = (props) => {
  const { name, address, description, handleChange, handleSubmit, errors = {} } = props;

  return (
    <div className="container fade-in">
      <div className="card" style={{maxWidth:700, margin:'0 auto'}}>
        <h1>Add Campus</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field">
              <label>Name</label>
              <input type="text" name="name" value={name} onChange={handleChange} />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Address</label>
              <input type="text" name="address" value={address} onChange={handleChange} />
              {errors.address && <div className="form-error">{errors.address}</div>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Description</label>
              <textarea name="description" value={description} onChange={handleChange} />
            </div>
          </div>
          <div style={{marginTop:12}}>
            <button type="submit" className="btn btn-primary">Create Campus</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCampusView;
