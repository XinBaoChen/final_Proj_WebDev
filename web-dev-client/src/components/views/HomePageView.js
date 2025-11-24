/*==================================================
HomePageView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display the home page.
================================================== */
const HomePageView = ({ campusCount = 0, studentCount = 0 }) => {
  return (
    <div style={{maxWidth: '900px', margin: '20px auto', textAlign: 'center'}}>
      <h1>Campus & Student Directory</h1>
      <p style={{color: '#555'}}>A simple, clean directory for campuses and students.</p>
      <div style={{display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '24px'}}>
        <div style={{padding: '16px', border: '1px solid #ddd', borderRadius: '6px'}}>
          <h2>{campusCount}</h2>
          <div>Campuses</div>
        </div>
        <div style={{padding: '16px', border: '1px solid #ddd', borderRadius: '6px'}}>
          <h2>{studentCount}</h2>
          <div>Students</div>
        </div>
      </div>
      <div style={{marginTop: '24px'}}>
        <a href="/campuses"><button style={{marginRight: '12px'}}>View Campuses</button></a>
        <a href="/students"><button>View Students</button></a>
      </div>
    </div>
  );
}

export default HomePageView;