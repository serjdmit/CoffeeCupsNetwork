import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MyButton from '../util/MyButton';
// MUI stuff
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
//Icons
import AddIcon from '@material-ui/icons/Add';
import HomeIcon from '@material-ui/icons/Home';
import Notifications from '@material-ui/icons/Notifications';

const useStyles = makeStyles(theme => ({
  ...theme.spreadIt,
  icon: {
    color: theme.palette.secondary.contrastText
  }
}));
const Navbar = props => {
  const classes = useStyles();
  Navbar.propTypes = {
    authenticated: PropTypes.bool.isRequired
  };
  const { authenticated } = props;
  return (
    <AppBar position="fixed">
      <Toolbar className="nav-container">
        {authenticated ? (
          <Fragment>
            <MyButton tip="Make Coffee">
              <AddIcon color="secondary" className={classes.icon} />
            </MyButton>
            <Link to="/">
              <MyButton tip="Home">
                <HomeIcon color="secondary" className={classes.icon} />
              </MyButton>
            </Link>
            <MyButton tip="Notifications">
              <Notifications color="secondary" className={classes.icon} />
            </MyButton>
          </Fragment>
        ) : (
          <Fragment>
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/signup">
              Signup
            </Button>
          </Fragment>
        )}
      </Toolbar>
    </AppBar>
  );
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated
});

export default connect(mapStateToProps)(Navbar);
