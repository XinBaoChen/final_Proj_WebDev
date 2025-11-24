import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const EnrollStudentView = ({ campusName, campusId, students = [], onEnroll }) => {
  return (
    <div className="container fade-in">
      <h1>Enroll Student to: {campusName || `Campus ${campusId}`}</h1>

      {students.length === 0 ? (
        <div className="card">There are no students available to enroll.</div>
      ) : (
        <div className="list">
          {students.map((s) => {
            const publicUrl = process.env.PUBLIC_URL || '';
            let src = `${publicUrl}/logo192.png`;
            if (s && s.imageUrl) {
              if (s.imageUrl.startsWith('http')) src = s.imageUrl;
              else if (s.imageUrl.startsWith('/')) src = s.imageUrl;
              else src = `${publicUrl}/${s.imageUrl}`;
            } else if (s && s.firstname) {
              const name = encodeURIComponent(`${s.firstname} ${s.lastname || ''}`);
              src = `https://ui-avatars.com/api/?name=${name}&size=512&background=0D8ABC&color=fff`;
            }

            return (
              <div key={s.id} className="card list-item student-card">
                <Link to={`/student/${s.id}`} style={{textDecoration:'none', color:'inherit', display:'flex', alignItems:'center', flex:1, gap:12}}>
                  <img src={src} alt={`${s.firstname} ${s.lastname}`} className="avatar-sm" />
                  <div style={{flex:1}}>
                    <h3>{s.firstname} {s.lastname}</h3>
                    <p className="muted">{s.email || 'No email'}</p>
                  </div>
                </Link>
                <div style={{display:'flex',gap:8}}>
                  <button className="btn btn-primary" onClick={() => onEnroll(s.id)}>Enroll</button>
                  <Link to={`/student/${s.id}`}>
                    <button className="btn btn-ghost">View</button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{marginTop:18}}>
        <Link to={`/campuses`}>Back to Campuses</Link>
      </div>
    </div>
  );
};

EnrollStudentView.propTypes = {
  campusName: PropTypes.string,
  campusId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  students: PropTypes.array,
  onEnroll: PropTypes.func.isRequired
};

export default EnrollStudentView;
