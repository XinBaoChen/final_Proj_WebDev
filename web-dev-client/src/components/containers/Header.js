/*==================================================
Header.js

It contains the Header component to be displayed on every page.
The header contains navigation links to every other page.
================================================== */
// Import "material" library for building UI with React components
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import { Link } from 'react-router-dom';

// Define styling for the header
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    textAlign: 'left',
    fontWeight: 700,
    fontFamily: 'Inter, Roboto, sans-serif',
    fontSize: '20px',
    color: '#0f172a'
  },
  appBar:{
    background: 'linear-gradient(90deg,#eef2ff,#ffffff)',
    boxShadow: 'none',
    borderBottom: '1px solid rgba(15,23,42,0.04)'
  },
  greeting:{
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'white',
    width: "50%",
    margin: "auto",
  },
  links:{
    textDecoration: 'none',
  }
}));

// Header component, displayed on every page
// Links to every other page
const Header = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static" elevation={0} className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title} color="inherit" >
            Campus Management System
          </Typography>

          <nav style={{display:'flex',gap:10}}>
            <Link className={classes.links} to={'/'} >
              <Button variant="outlined" color="primary" style={{marginRight: '10px', borderRadius:8}}>
                Home
              </Button>
            </Link>

            <Link className={classes.links} to={'/campuses'} >
              <Button variant="outlined" color="primary" style={{marginRight: '10px', borderRadius:8}}>
                Campuses
              </Button>
            </Link>

            <Link className={classes.links} to={'/students'} >
              <Button variant="outlined" color="primary" style={{borderRadius:8}}>
                Students
              </Button>
            </Link>
          </nav>
        </Toolbar>
      </AppBar>
    </div>
  );    
}

export default Header;
