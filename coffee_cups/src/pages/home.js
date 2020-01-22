import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

//Redux
import { connect } from 'react-redux';
import { getCups } from '../redux/actions/dataActions';

//MUI
import Grid from '@material-ui/core/Grid';

//Components
import Cup from '../components/Cup';
import Profile from '../components/Profile';

const Home = props => {
  useEffect(() => {
    if (props.data.cups !== []) {
      props.getCups();
    }
  }, []);
  Home.propTypes = {
    getCups: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
  };
  const { cups, loading } = props.data;

  let recentCupsMarkup = !loading ? (
    cups.map(cup => <Cup cup={cup} key={cup.cupId} />)
  ) : (
    <p>Loading...</p>
  );
  return (
    <Grid container spacing={4}>
      <Grid item sm={8} xs={12}>
        <div>{recentCupsMarkup}</div>
      </Grid>
      <Grid item sm={4} xs={12}>
        <Profile />
      </Grid>
    </Grid>
  );
};

const mapStateToProps = state => ({
  data: state.data
});

export default connect(mapStateToProps, { getCups })(Home);
