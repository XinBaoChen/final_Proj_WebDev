/*==================================================
NewStudentView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display the new student page.
================================================== */
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const NewStudentView = (props) => {
  const { handleChange, handleSubmit, campuses = [], errors = {}, firstname = '', lastname = '', campusId = '', email = '', gpa = '' } = props;

  // Render a New Student view with an input form
  return (
    <div className="container fade-in">
      <div className="card" style={{maxWidth:700,margin:'0 auto'}}>
        <div style={{marginBottom:12}}>
          <Typography style={{fontWeight: 'bold', fontFamily: 'Courier, sans-serif', fontSize: '20px', color: '#11153e'}}>
            Add a Student
          </Typography>
        </div>

        <form onSubmit={(e) => handleSubmit(e)}>
          {errors.form && <div className="form-error">{errors.form}</div>}
          <div className="form-row">
            <div className="form-field">
              <label>First Name</label>
              <input type="text" name="firstname" value={firstname} onChange ={(e) => handleChange(e)} />
              {errors.firstname && <div className="form-error">{errors.firstname}</div>}
            </div>
            <div className="form-field">
              <label>Last Name</label>
              <input type="text" name="lastname" value={lastname} onChange={(e) => handleChange(e)} />
              {errors.lastname && <div className="form-error">{errors.lastname}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Campus</label>
              <select name="campusId" value={campusId || ''} onChange={(e) => handleChange(e)}>
                <option value="">-- No Campus --</option>
                {campuses.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} (id: {c.id})</option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label>Email</label>
              <input type="email" name="email" value={email} onChange={(e) => handleChange(e)} />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>GPA</label>
              <input type="number" name="gpa" value={gpa} min="0" max="4" step="0.1" onChange={(e) => handleChange(e)} />
              {errors.gpa && <div className="form-error">{errors.gpa}</div>}
            </div>
          </div>

          <div style={{marginTop:12}}>
            <Button variant="contained" color="primary" type="submit" className="btn btn-primary">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewStudentView;