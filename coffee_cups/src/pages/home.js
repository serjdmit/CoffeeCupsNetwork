import React from 'react';
import useAxios from 'axios-hooks';

//MUI
import Grid from '@material-ui/core/Grid';

//Components
import Cup from '../components/Cup';
import Profile from '../components/Profile';

const Home = () => {
  const [res] = useAxios('/cups');
  const cups = res.data;

  let recentCupsMarkup = cups ? (
    cups.map((cup, index) => <Cup cup={cup} key={cup.cupId} />)
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

export default Home;
