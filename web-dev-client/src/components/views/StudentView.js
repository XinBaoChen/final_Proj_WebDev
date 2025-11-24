/*==================================================
StudentView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display the single student view page.
================================================== */
import { Link } from 'react-router-dom';

const StudentView = (props) => {
  const { student } = props;

  // Render a single Student view 
  return (
    <div className="container fade-in">
      <div className="card" style={{display:'flex',gap:18,alignItems:'center'}}>
        {(() => {
          const publicUrl = process.env.PUBLIC_URL || '';
          let src = `${publicUrl}/logo192.png`;
          if (student && student.imageUrl) {
            if (student.imageUrl.startsWith('http')) src = student.imageUrl;
            else if (student.imageUrl.startsWith('/')) src = student.imageUrl;
            else src = `${publicUrl}/${student.imageUrl}`;
          } else if (student) {
            const name = encodeURIComponent((student.firstname || '') + ' ' + (student.lastname || ''));
            src = `https://ui-avatars.com/api/?name=${name}&size=256&background=5A67D8&color=fff`;
          }
          return <img src={src} alt={`${student && student.firstname} avatar`} className="avatar" />;
        })()}

        <div>
          <h1>{(student && student.firstname ? student.firstname : '') + " " + (student && student.lastname ? student.lastname : '')}</h1>
          <h3 className="muted">
            {student && student.campus ? (
              <Link className="campus-link" to={`/campus/${student.campus.id}`}>{student.campus.name}</Link>
            ) : (
              <span style={{color:'grey'}}>Not enrolled</span>
            )}
          </h3>
          <div><strong>Email:</strong> {student && student.email ? student.email : <span style={{color:'red'}}>Missing</span>}</div>
          <div><strong>GPA:</strong> {student && student.gpa ? student.gpa : 'N/A'}</div>
        </div>
      </div>
    </div>
  );

};

export default StudentView;