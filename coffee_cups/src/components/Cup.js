import React from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

//MUI
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

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

const Cup = (props, { cup }) => {
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
    }
  } = props;
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
      </CardContent>
    </Card>
  );
};

export default Cup;
