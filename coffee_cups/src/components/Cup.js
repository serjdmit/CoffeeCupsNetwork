import React from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';
import MyButton from '../util/MyButton';
//Redux
import { connect } from 'react-redux';
import { likeCup, unlikeCup } from '../redux/actions/dataActions';
//MUI
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

//Icons
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Chat from '@material-ui/icons/Chat';

const styles = {
  card: {
    display: 'flex',
    marginBottom: 20
  },
  image: {
    minWidth: 200
  },
  content: {
    padding: 25,
    objectFit: 'cover'
  }
};

const Cup = props => {
  Cup.propTypes = {
    likeCup: PropTypes.func.isRequired,
    unlikeCup: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    cup: PropTypes.object.isRequired
  };

  const likedCup = () => {
    if (
      props.user.likes &&
      props.user.likes.find(like => like.cupId === props.cup.cupId)
    ) {
      return true;
    } else {
      return false;
    }
  };
  const likeCup = () => {
    props.likeCup(props.cup.cupId);
  };
  const unlikeCup = () => {
    props.unlikeCup(props.cup.cupId);
  };
  dayjs.extend(relativeTime);
  const {
    cup: {
      body,
      createdAt,
      userImage,
      userHandle,
      cupId,
      likeCount,
      commentCount
    },
    user: { authenticated }
  } = props;
  const likeButton = !authenticated ? (
    <MyButton tip="Like">
      <Link to="/login">
        <FavoriteBorder color="primary" />
      </Link>
    </MyButton>
  ) : likedCup() ? (
    <MyButton tip="Undo like" onClick={unlikeCup}>
      <Favorite color="primary" />
    </MyButton>
  ) : (
    <MyButton tip="Like" onClick={likeCup}>
      <FavoriteBorder color="primary" />
    </MyButton>
  );
  return (
    <Card style={styles.card}>
      <CardMedia image={userImage} title="Profile image" style={styles.image} />
      <CardContent style={styles.content}>
        <Typography variant="h5" component={Link} to={`/users/${userHandle}`}>
          {userHandle}
        </Typography>
        <Typography variant="body1">{body}</Typography>
        <Typography variant="body2" color="textSecondary">
          {dayjs(createdAt).fromNow()}
        </Typography>
        {likeButton}
        <span>{likeCount} Likes</span>
        <MyButton tip="comments">
          <Chat color="primary" />
        </MyButton>
        <span>{commentCount} comments</span>
      </CardContent>
    </Card>
  );
};

const mapStateToProps = state => ({
  user: state.user
});

const mapActionsToProps = {
  likeCup,
  unlikeCup
};

export default connect(mapStateToProps, mapActionsToProps)(Cup);
