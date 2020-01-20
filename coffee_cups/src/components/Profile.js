import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
//Redux
import { connect } from 'react-redux';

//MUI
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import MuiLink from '@material-ui/core/Link';
//Icons
import LocationOn from '@material-ui/icons/LocationOn';
import InsertLink from '@material-ui/icons/InsertLink';
import CalendarToday from '@material-ui/icons/CalendarToday';

const useStyles = makeStyles(theme => ({
  ...theme.spreadIt,
  paper: { padding: 20 },
  profile: {
    '& .image-wrapper': {
      textAlign: 'center',
      position: 'relative',
      '& button': {
        position: 'absolute',
        top: '80%',
        left: '70%'
      }
    },
    '& .profile-image': {
      width: 200,
      height: 200,
      objectFit: 'cover',
      maxWidth: '100%',
      borderRadius: '50%'
    },
    '& .profile-details': {
      textAlign: 'center',
      '& span, svg': {
        verticalAlign: 'middle'
      },
      '& a': {
        color: theme.palette.primary.main
      }
    },
    '& hr': {
      border: 'none',
      margin: '0 0 10px 0'
    },
    '& svg.button': {
      '&:hover': {
        cursor: 'pointer'
      }
    }
  },
  buttons: {
    textAlign: 'center',
    '& a': {
      margin: '20px 10px'
    }
  }
}));

// Icons
const Profile = props => {
  Profile.PropTypes = {
    user: PropTypes.object.isRequired
  };
  const classes = useStyles();
  const {
    user: {
      credentials: { handle, createdAt, imageUrl, bio, website, location },
      loading,
      authenticated
    }
  } = props;

  let profileMarkup = !loading ? (
    authenticated ? (
      <Paper className={classes.paper}>
        <div className={classes.profile}>
          <div className="profile-image">
            <img src={imageUrl} alt="profile" className="profile-image" />
          </div>
          <hr />
          <div className="profile-details">
            <MuiLink
              component={Link}
              to={`/users/${handle}`}
              color="primary"
              variant="h5"
            >
              @{handle}
            </MuiLink>
            <hr />
            {bio && <Typography variant="body2">{bio}</Typography>}
            <hr />
            {location && (
              <Fragment>
                <LocationOn color="promary" /> <span>{location}</span>
                <hr />
              </Fragment>
            )}
            {website && (
              <Fragment>
                <InsertLink color="primary" />
                <a href={website} target="_blank" rel="noopener noreferrer">
                  {' '}
                  {website}
                </a>
                <hr />
              </Fragment>
            )}
            <CalendarToday color="primary" />{' '}
            <span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
          </div>
        </div>
      </Paper>
    ) : (
      <Paper className={classes.paper}>
        <Typography variant="body2" align="center">
          No profile found, please login again
        </Typography>
        <div className={classes.buttons}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/login"
          >
            Login
          </Button>
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            to="/signup"
          >
            Signup
          </Button>
        </div>
      </Paper>
    )
  ) : (
    <p>Loading...</p>
  );

  return profileMarkup;
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(Profile);
