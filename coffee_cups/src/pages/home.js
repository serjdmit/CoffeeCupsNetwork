import Grid from "@material-ui/core/Grid";
import useAxios from "axios-hooks";
import React from "react";
import Cup from "../components/Cup";

const Home = props => {
    // const [cups, setCups] = useState([]);

    const [res] = useAxios("/cups");
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
                <p>Profile</p>
            </Grid>
        </Grid>
    );
};

export default Home;
