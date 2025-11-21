import React from 'react';

const NewCampusView = (props) => {
  const { name, address, description, handleChange, handleSubmit } = props;

  return (
    <div style={{width: '600px', margin: 'auto'}}>
      <h1>Add Campus</h1>
      <form onSubmit={handleSubmit} style={{textAlign: 'center'}}>
        <label style={{fontWeight: 'bold'}}>Name: </label>
        <input type="text" name="name" value={name} onChange={handleChange} required />
        <br/><br/>
        <label style={{fontWeight: 'bold'}}>Address: </label>
        <input type="text" name="address" value={address} onChange={handleChange} required />
        <br/><br/>
        <label style={{fontWeight: 'bold'}}>Description: </label>
        <textarea name="description" value={description} onChange={handleChange} />
        <br/><br/>
        <button type="submit">Create Campus</button>
      </form>
    </div>
  );
};

export default NewCampusView;
