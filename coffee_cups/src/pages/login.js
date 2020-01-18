import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import AppIcon from "../images/icon.svg";

const useStyles = makeStyles(theme => ({
    form: {
        textAlign: "center",
        justifyContent: "flex-start"
    },
    pageTitle: {
        margin: "10px auto"
    },
    textField: {
        margin: "10px auto"
    },
    image: {
        margin: "20px auto"
    },
    customError: {
        color: "red",
        fontSize: "0.8rem",
        marginTop: 10
    },
    button: {
        marginTop: 20,
        position: "relative"
    },
    progress: {
        position: "absolute"
    }
}));

const Login = props => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState("");
    const classes = useStyles();

    Login.propTypes = {
        classes: PropTypes.object.isRequired
    };

    const handleSubmit = event => {
        event.preventDefault();
        setLoading(true);

        const userData = {
            email: email,
            password: password
        };

        axios
            .post("/login", userData)
            .then(res => {
                console.log(res.data);
                setLoading(false);
                props.history.push("/");
            })
            .catch(err => {
                setErrors(err.response.data);
                setLoading(false);
            });

        console.log(email, password);
    };
    return (
        <Grid container className={classes.form}>
            <Grid item sm></Grid>
            <Grid item sm>
                <img
                    src={AppIcon}
                    alt="Coffee image"
                    сlassName={classes.image}
                />
                <Typography variant="h2" className={classes.pageTitle}>
                    Login
                </Typography>
                <form
                    noValidate
                    onSubmit={handleSubmit}
                    className={classes.formInner}
                >
                    <TextField
                        id="email"
                        name="email"
                        type="email"
                        label="Email"
                        className={classes.textField}
                        value={email}
                        helperText={errors.email}
                        error={errors.email ? true : false}
                        onChange={event => setEmail(event.target.value)}
                        fullWidth
                    />
                    <TextField
                        id="password"
                        name="password"
                        type="password"
                        label="Password"
                        className={classes.textField}
                        value={password}
                        helperText={errors.password}
                        error={errors.password ? true : false}
                        onChange={event => setPassword(event.target.value)}
                        fullWidth
                    />
                    {errors.general && (
                        <Typography
                            variant="body2"
                            className={classes.customError}
                        >
                            {errors.general}
                        </Typography>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        type="submit"
                        disabled={loading}
                    >
                        Login
                        {loading && (
                            <CircularProgress
                                size={30}
                                className={classes.progress}
                            />
                        )}
                    </Button>
                    <br />
                    <small>
                        don't have an account? sign up
                        <Link to="/signup"> here</Link>
                    </small>
                </form>
            </Grid>
            <Grid item sm></Grid>
        </Grid>
    );
};

export default Login;
