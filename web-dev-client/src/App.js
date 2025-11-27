import "./App.css";

//Router
import { Switch, Route } from "react-router-dom";
//Components
import {
  HomePageContainer,
  CampusContainer,
  StudentContainer,
  AllCampusesContainer,
  AllStudentsContainer,
  NewStudentContainer,
  NewCampusContainer
  ,EditCampusContainer, EditStudentContainer
} from './components/containers';

import { ToastProvider } from './components/ui/ToastProvider';
import { ConfirmProvider } from './components/ui/ConfirmDialog';

// if you create separate components for adding/editing 
// a student or campus, make sure you add routes to those
// components here

const App = () => {
  return (
    <div className="App">
      <ToastProvider>
        <ConfirmProvider>
          <Switch>
            <Route exact path="/" component={HomePageContainer} />
            <Route exact path="/campuses" component={AllCampusesContainer} />
            <Route exact path="/campus/:id" component={CampusContainer} />
            <Route exact path="/campus/:id/enroll" component={require('./components/containers/EnrollStudentContainer').default} />
            <Route exact path="/campus/:id/edit" component={EditCampusContainer} />
            <Route exact path="/students" component={AllStudentsContainer} />
            <Route exact path="/newstudent" component={NewStudentContainer} />
            <Route exact path="/newcampus" component={NewCampusContainer} />
            <Route exact path="/student/:id" component={StudentContainer} />
            <Route exact path="/student/:id/edit" component={EditStudentContainer} />
          </Switch>
        </ConfirmProvider>
      </ToastProvider>
    </div>
  );
}

export default App;
