/*==================================================
CampusView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display a single campus and its students (if any).
================================================== */
import { Link } from "react-router-dom";

// Take in props data to construct the component
const CampusView = (props) => {
  const {campus} = props;
  
  // Render a single Campus view with list of its students
  return (
    <div className="container fade-in">
      <div className="card">
        <div style={{display:'flex',gap:18,alignItems:'center'}}>
          {/* campus image */}
          {(() => {
            const publicUrl = process.env.PUBLIC_URL || '';
            let src = `${publicUrl}/logo192.png`;
            if (campus && campus.imageUrl) {
              if (campus.imageUrl.startsWith('http')) src = campus.imageUrl;
              else if (campus.imageUrl.startsWith('/')) src = campus.imageUrl;
              else src = `${publicUrl}/${campus.imageUrl}`;
            } else if (campus && campus.name) {
              const name = encodeURIComponent(campus.name);
              src = `https://ui-avatars.com/api/?name=${name}&size=1024&background=0D8ABC&color=fff`;
            }
            return <img src={src} alt={campus && campus.name} className="avatar" />;
          })()}

          <div style={{flex:1}}>
            <h1>{campus.name}</h1>
            <p>{campus.address}</p>
            <p className="muted">{campus.description}</p>
            <div style={{marginTop:12, display:'flex', gap:8}}>
              <Link to={`/newstudent?campusId=${campus.id}`}><button className="btn btn-primary">Enroll New Student</button></Link>
              <Link to={`/campus/${campus.id}/enroll`}><button className="btn btn-ghost">Enroll Existing Student</button></Link>
              <Link to={`/campus/${campus.id}/edit`}><button className="btn btn-ghost">Edit Campus</button></Link>
            </div>
          </div>
        </div>
      </div>

      <div style={{marginTop:16}}>
        <h3>Students</h3>
        <div className="list">
          {campus.students.map( student => {
            let name = (student.firstname || '') + " " + (student.lastname || '');
            const email = student.email || '';
            const gpa = (student.gpa !== undefined && student.gpa !== null) ? student.gpa : '';
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
                  <div><strong>Email:</strong> {email ? email : <span style={{color: 'red'}}>Missing</span>} {email && !emailValid ? <span style={{color:'orange'}}> (Invalid)</span> : null}</div>
                  <div><strong>GPA:</strong> {gpa !== '' ? gpa : 'N/A'}</div>
                </div>
                <div>
                  <Link to={`/student/${student.id}/edit`}><button className="btn btn-ghost">Edit Student</button></Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CampusView;