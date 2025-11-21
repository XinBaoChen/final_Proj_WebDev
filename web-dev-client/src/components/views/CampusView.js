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
    <div>
      <h1>{campus.name}</h1>
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
        return <img src={src} alt={`${campus && campus.name} image`} style={{maxWidth: '500px', display: 'block'}} />;
      })()}
      <p>{campus.address}</p>
      <p>{campus.description}</p>
      {campus.students.map( student => {
        let name = student.firstname + " " + student.lastname;
        return (
          <div key={student.id}>
            <Link to={`/student/${student.id}`}>
              <h2>{name}</h2>
            </Link>             
          </div>
        );
      })}
    </div>
  );
};

export default CampusView;