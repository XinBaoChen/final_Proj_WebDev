/*==================================================
AllCampusesView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display all campuses.
================================================== */
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const AllCampusesView = (props) => {
  // If there is no campus, display a message.
  if (!props.allCampuses.length) {
    return <div>There are no campuses.</div>;
  }

  // If there is at least one campus, render All Campuses view 
  return (
    <div className="container fade-in">
      <h1>All Campuses</h1>

      <div className="list">
        {props.allCampuses.map((campus) => {
          const publicUrl = process.env.PUBLIC_URL || '';
          let src = `${publicUrl}/logo192.png`;
          if (campus && campus.imageUrl) {
            if (campus.imageUrl.startsWith('http')) src = campus.imageUrl;
            else if (campus.imageUrl.startsWith('/')) src = campus.imageUrl;
            else src = `${publicUrl}/${campus.imageUrl}`;
          } else if (campus && campus.name) {
            const name = encodeURIComponent(campus.name);
            src = `https://ui-avatars.com/api/?name=${name}&size=512&background=0D8ABC&color=fff`;
          }

          return (
            <div key={campus.id} className="card list-item campus-card">
              <Link to={`/campus/${campus.id}`} style={{textDecoration: 'none', color: 'inherit', display:'flex', alignItems:'center', flex:1, gap:12}}>
                <img src={src} alt={campus.name} className="avatar" />
                <div style={{flex:1}}>
                  <h2>{campus.name}</h2>
                  <p className="badge">id: {campus.id}</p>
                  <p>{campus.address}</p>
                  <p className="muted">{campus.description}</p>
                </div>
              </Link>
              <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                <Link to={`/campus/${campus.id}/enroll`}>
                  <button className="btn btn-primary">Enroll Student</button>
                </Link>
                <button className="btn btn-danger" onClick={() => props.deleteCampus(campus.id)}>Delete</button>
                <Link to={`/campus/${campus.id}/edit`}>
                  <button className="btn btn-ghost">Edit</button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{marginTop:18}}>
        <Link to={`/newcampus`}>
          <button className="btn btn-primary">Add New Campus</button>
        </Link>
      </div>
    </div>
  );
};

// Validate data type of the props passed to component.
AllCampusesView.propTypes = {
  allCampuses: PropTypes.array.isRequired,
  deleteCampus: PropTypes.func,
};

export default AllCampusesView;