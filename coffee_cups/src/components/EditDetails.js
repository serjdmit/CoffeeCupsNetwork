import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import MyButton from '../util/MyButton';

//Redux
import { connect } from 'react-redux';
import { editUserDetails } from '../redux/actions/userActions';

//MUI
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
//Icons
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles(theme => ({
  ...theme.spreadIt,
  button: {
    float: 'right'
  }
}));

const EditDetails = props => {
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    mapUserDetailsToState(props.credentials);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = () => {
    const userDetails = {
      bio: bio,
      website: website,
      location: location
    };
    props.editUserDetails(userDetails);
    handleClose();
  };
  useEffect(() => {
    const { credentials } = props;
    mapUserDetailsToState(credentials);
  }, [props]);

  const mapUserDetailsToState = credentials => {
    setBio(bio ? credentials.bio : '');
    setWebsite(website ? credentials.website : '');
    setLocation(location ? credentials.location : '');
  };

  EditDetails.propTypes = {
    editUserDetails: PropTypes.func.isRequired
  };

  const classes = useStyles();
  return (
    <Fragment>
      <MyButton
        tip="Edit details"
        onClick={() => handleOpen()}
        btnClassName={classes.button}
      >
        <EditIcon color="primary" />
      </MyButton>
      <Dialog open={open} fullWidth maxWidth="sm">
        <DialogTitle>Edit your details</DialogTitle>
        <DialogContent>
          <form>
            <TextField
              name="bio"
              type="text"
              label="Bio"
              multiline
              rows="3"
              placeholder="A short bio about yourself"
              className={classes.TextField}
              value={bio}
              onChange={event => setBio(event.target.value)}
              fullWidth
            />
            <TextField
              name="website"
              type="text"
              label="Website"
              multiline
              rows="3"
              placeholder="Your personal/professional website"
              className={classes.TextField}
              value={website}
              onChange={event => setWebsite(event.target.value)}
              fullWidth
            />
            <TextField
              name="location"
              type="text"
              label="Location"
              multiline
              rows="3"
              placeholder="Where you live"
              className={classes.TextField}
              value={location}
              onChange={event => setLocation(event.target.value)}
              fullWidth
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleOpen()} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleSubmit()} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  credentials: state.user.credentials
});
const mapActionsProps = { editUserDetails };

export default connect(mapStateToProps, mapActionsProps)(EditDetails);
