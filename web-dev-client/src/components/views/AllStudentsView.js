/*==================================================
AllStudentsView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display the all students view page.
================================================== */
import { Link } from "react-router-dom";

const AllStudentsView = (props) => {
  const {students, deleteStudent} = props;
  // If there is no student, display a message
  if (!students.length) {
    return (
    <div>
      <p>There are no students.</p>
      <Link to={`newstudent`}>
        <button>Add New Student</button>
      </Link>
    </div>
    );
  }
  
  // If there is at least one student, render All Students view 
  return (
    <div className="container fade-in">
      <h1>All Students</h1>

      <div className="list">
        {students.map((student) => {
          let name = (student.firstname || '') + " " + (student.lastname || '');
          const email = student.email || '';
          const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
          const emailValid = email && emailRegex.test(email);
          const publicUrl = process.env.PUBLIC_URL || '';
          let src = `${publicUrl}/logo192.png`;
          if (student && student.imageUrl) {
            if (student.imageUrl.startsWith('http')) src = student.imageUrl;
            else if (student.imageUrl.startsWith('/')) src = student.imageUrl;
            else src = `${publicUrl}/${student.imageUrl}`;
          } else {
            const n = encodeURIComponent(name.trim() || 'Student');
            src = `https://ui-avatars.com/api/?name=${n}&size=256&background=5A67D8&color=fff`;
          }

          return (
            <div key={student.id} className="card list-item">
              <img src={src} className="avatar-sm" alt={`${name} avatar`} />
              <div style={{flex:1}}>
                <Link to={`/student/${student.id}`} style={{textDecoration:'none', color:'inherit'}}>
                  <h2>{name}</h2>
                </Link>
                <div><strong>Email:</strong> {email ? email : <span style={{color:'red'}}>Missing</span>} {email && !emailValid ? <span style={{color:'orange'}}> (Invalid)</span> : null}</div>
                <div>
                  <strong>Campus:</strong>{' '}
                  {student && student.campus ? (
                    <Link className="campus-link" to={`/campus/${student.campus.id}`}>{student.campus.name}</Link>
                  ) : (
                    <span style={{color:'grey'}}>Not enrolled</span>
                  )}
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                <button className="btn btn-danger" onClick={() => deleteStudent(student.id)}>Delete</button>
                <Link to={`/student/${student.id}/edit`}>
                  <button className="btn btn-ghost">Edit</button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{marginTop:18}}>
        <Link to={`/newstudent`}>
          <button className="btn btn-primary">Add New Student</button>
        </Link>
      </div>
    </div>
  );
};


export default AllStudentsView;