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
    <div>
      <h1>All Campuses</h1>

      {props.allCampuses.map((campus) => (
        <div key={campus.id}>
          <Link to={`/campus/${campus.id}`}>
            <h2>{campus.name}</h2>
          </Link>
          {/* Campus image (use provided imageUrl when available; otherwise fallback to default) */}
          {(() => {
            const publicUrl = process.env.PUBLIC_URL || '';
            // Use provided imageUrl when available; otherwise generate an avatar image using UI Avatars
            let src = `${publicUrl}/logo192.png`;
            if (campus && campus.imageUrl) {
              if (campus.imageUrl.startsWith('http')) src = campus.imageUrl;
              else if (campus.imageUrl.startsWith('/')) src = campus.imageUrl;
              else src = `${publicUrl}/${campus.imageUrl}`;
            } else if (campus && campus.name) {
              const name = encodeURIComponent(campus.name);
              src = `https://ui-avatars.com/api/?name=${name}&size=512&background=0D8ABC&color=fff`;
            }
            return <img src={src} alt={`${campus.name} image`} style={{maxWidth: '300px', display: 'block'}} />;
          })()}
          <button onClick={() => props.deleteCampus(campus.id)}>Delete</button>
          <Link to={`/campus/${campus.id}/edit`}>
            <button>Edit</button>
          </Link>
          <h4>campus id: {campus.id}</h4>
          <p>{campus.address}</p>
          <p>{campus.description}</p>
          <hr/>
        </div>
      ))}
      <br/>
      <Link to={`/newcampus`}>
        <button>Add New Campus</button>
      </Link>
      <br/><br/>
    </div>
  );
};

// Validate data type of the props passed to component.
AllCampusesView.propTypes = {
  allCampuses: PropTypes.array.isRequired,
  deleteCampus: PropTypes.func,
};

export default AllCampusesView;