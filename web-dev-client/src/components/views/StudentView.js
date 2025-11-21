/*==================================================
StudentView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display the single student view page.
================================================== */
const StudentView = (props) => {
  const { student } = props;

  // Render a single Student view 
  return (
    <div>
      <h1>{(student && student.firstname ? student.firstname : '') + " " + (student && student.lastname ? student.lastname : '')}</h1>
      {/* student image */}
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
        return <img src={src} alt={`${student && student.firstname} avatar`} style={{maxWidth: '150px', display: 'block'}} />;
      })()}
      <h3>{student && student.campus ? student.campus.name : ''}</h3>
    </div>
  );

};

export default StudentView;